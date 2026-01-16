import os
import json
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

class PatternDetector:
    def __init__(self, base_model_id=None, adapter_path=None):
        self.base_model_id = base_model_id or "ibm-granite/granite-3.1-3b-a800m-instruct"
        self.adapter_path = adapter_path or "predatory-patterns-lora"
        
        print(f"Loading base model: {self.base_model_id}")
        self.tokenizer = AutoTokenizer.from_pretrained(self.base_model_id)
        
        device = "cpu"
        print(f"Using device: {device}")
        
        self.base_model = AutoModelForCausalLM.from_pretrained(
            self.base_model_id,
            device_map=device,
            torch_dtype=torch.float32
        )
        
        if os.path.exists(self.adapter_path):
            print(f"Loading adapter from {self.adapter_path}")
            self.model = PeftModel.from_pretrained(self.base_model, self.adapter_path)
        else:
            print(f"Warning: Adapter {self.adapter_path} not found. Using base model only.")
            self.model = self.base_model

    def _build_prompt(self, transactions_context):
        # Format as input sample for the model
        clean_txns = []
        for t in transactions_context:
            clean_txns.append({
                "date": str(t.get("timestamp"))[:10],
                "amt": t.get("amount"),
                "desc": t.get("description")
            })
            
        system_prompt = "You are a financial pattern detection AI."
        instruction = "Analyze the transaction history for predatory patterns. Return JSON: {is_predatory, pattern_type, reason}."
        
        return f"""<|system|>
{system_prompt}
<|user|>
{instruction}

CONTEXT:
{json.dumps(clean_txns)}
<|assistant|>
"""

    def analyze_sequence(self, transactions):
        prompt = self._build_prompt(transactions)
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs, 
                max_new_tokens=200,
                temperature=0.1, # Low temp for deterministic JSON
                do_sample=False
            )
            
        output_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract the assistant's response
        # The output contains the full prompt + generation. 
        # We need to parse after <|assistant|> or just get the last part.
        try:
            # Heuristic: split by assistant banner if present in decoded text (it might disappear in skip_special_tokens)
            # Granite Instruct usually keeps structure if trained well.
            # Let's try to find the standard JSON structure.
            response_part = output_text.split("CONTEXT:")[-1] # fallback
            if "<|assistant|>" in output_text:
                response_part = output_text.split("<|assistant|>")[-1]
            
            # Find first { and last }
            start = response_part.find("{")
            end = response_part.rfind("}") + 1
            if start != -1 and end != -1:
                json_str = response_part[start:end]
                return json.loads(json_str)
            else:
                return {"is_predatory": False, "pattern_type": "ParseError", "reason": "No JSON found"}
                
        except Exception as e:
            return {
                "is_predatory": False, 
                "pattern_type": "Error", 
                "reason": str(e)
            }
