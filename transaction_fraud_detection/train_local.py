import os
import json
import torch
from datasets import Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, TaskType

# Configuration
# Granite 3.1 MoE (3B params, 800M active)
MODEL_NAME = "ibm-granite/granite-3.1-3b-a800m-instruct"
OUTPUT_DIR = "predatory-patterns-lora"
TRAIN_FILE = "train.jsonl"
NUM_EPOCHS = 3
BATCH_SIZE = 1 # Small batch size for Mac memory safety

def format_instruction(sample):
    """
    Format the sample into a ChatML-like or Alpaca-like prompt.
    TinyLlama Chat expects specific chat templates, but for simplicity
    we will stick to a clear Input/Output structure.
    """
    return f"""<|system|>
You are a financial pattern detection AI.
<|user|>
{sample['instruction']}

CONTEXT:
{sample['input']}
<|assistant|>
{sample['output']}"""

def main():
    print(f"Loading data from {TRAIN_FILE}...")
    # Load JSONL
    data = []
    with open(TRAIN_FILE, "r") as f:
        for line in f:
            data.append(json.loads(line))
            
    # Convert to HF Dataset
    raw_dataset = Dataset.from_list(data)
    
    print(f"Loading tokenizer for {MODEL_NAME}...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token # Fix for padding
    
    def preprocess_function(examples):
        texts = [format_instruction(ex) for ex in examples]
        encodings = tokenizer(texts, padding="max_length", truncation=True, max_length=512)
        # For Causal LM, labels are the same as input_ids
        encodings["labels"] = encodings["input_ids"].copy()
        return encodings

    print("Tokenizing dataset...")
    # Using 'map' with batched=False for simplicity with list of dicts logic above, 
    # but actually 'examples' in map is a dict of lists.
    # Let's adjust preprocess to handle dict of lists
    def preprocess_batched(examples):
        # examples is a dict of lists: {'instruction': [...], 'input': [...], ...}
        output_texts = []
        for i in range(len(examples['instruction'])):
            text = f"""<|system|>
You are a financial pattern detection AI.
<|user|>
{examples['instruction'][i]}

CONTEXT:
{examples['input'][i]}
<|assistant|>
{examples['output'][i]}"""
            output_texts.append(text)
            
        encodings = tokenizer(output_texts, padding="max_length", truncation=True, max_length=512)
        encodings["labels"] = encodings["input_ids"].copy()
        return encodings

    tokenized_datasets = raw_dataset.map(preprocess_batched, batched=True)
    
    print("Loading Model (This may take a while)...")
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Using device: {device}")
    
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME, 
        device_map=device,
        torch_dtype=torch.float16 if device == "mps" else torch.float32
    )
    
    # Configure LoRA
    print("Applying LoRA adapters...")
    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM, 
        inference_mode=False, 
        r=8, 
        lora_alpha=32, 
        lora_dropout=0.1,
        target_modules=["q_proj", "v_proj"]
    )
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()
    
    # Training Arguments
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=NUM_EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        logging_steps=10,
        save_strategy="epoch",
        fp16=False,
        use_mps_device=True if device=="mps" else False,
        dataloader_num_workers=0, # Critical for Mac to prevent hangs
        dataloader_pin_memory=False # Fixes warning and potential MPS issues
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )
    
    print("Starting Training...")
    trainer.train()
    
    print(f"Training complete. Saving model to {OUTPUT_DIR}...")
    trainer.save_model(OUTPUT_DIR)
    
if __name__ == "__main__":
    main()
