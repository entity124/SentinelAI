from detector import PatternDetector
import traceback

print("Testing PatternDetector with base model...")
try:
    display_path = "predatory-patterns-lora"
    detector = PatternDetector(adapter_path=display_path) 
    
    sample_txns = [{"date": "2023-01-01", "amt": 100.0, "desc": "Test Transaction"}]
    print("Running sample analysis...")
    result = detector.analyze_sequence(sample_txns)
    print("Result:", result)
    print("SUCCESS: Inference setup verified.")
except Exception as e:
    print("FAILURE: Inference setup failed.")
    traceback.print_exc()
