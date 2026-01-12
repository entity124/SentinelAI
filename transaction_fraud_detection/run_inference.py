import pandas as pd
import argparse
import sys
import os
import time
from detector import PatternDetector

def main():
    parser = argparse.ArgumentParser(description="Flag predatory transactions using Watsonx.ai")
    parser.add_argument("input_file", help="Path to input CSV file")
    parser.add_argument("--output", default="flagged_report.csv", help="Path to output CSV")
    parser.add_argument("--limit", type=int, default=10, help="Max number of sequences to analyze (for demo speed)")
    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Error: File {args.input_file} not found.")
        sys.exit(1)

    print(f"Loading data from {args.input_file}...")
    df = pd.read_csv(args.input_file)
    
    # 1. Group data by User and Merchant
    # This creates timelines of interaction: User A interacting with Netflix, User A with Spotify, etc.
    grouped = df.groupby(['user_id', 'merchant'])
    
    sequences_to_check = []
    
    for (user, merchant), group in grouped:
        # We only care about sequences with potential history (e.g. > 1 transaction)
        # unless it's a known 'hit and run' type, but for this demo, history is key.
        if len(group) >= 2:
            # Sort by time
            sorted_txns = group.sort_values("timestamp").to_dict('records')
            sequences_to_check.append({
                "user": user,
                "merchant": merchant,
                "transactions": sorted_txns
            })
    
    print(f"Found {len(sequences_to_check)} transaction sequences.")
    
    # Initialize Model
    # Note: Expects WATSONX_API_KEY and WATSONX_PROJECT_ID env vars
    try:
        detector = PatternDetector()
    except Exception as e:
        print(f"Warning: Could not initialize Watsonx.ai client ({e}).")
        print("Ensure 'ibm-watsonx-ai' is installed and env vars are set.")
        sys.exit(1)

    results = []
    count = 0
    
    print(f"Analyzing top {args.limit} sequences...")
    
    for seq in sequences_to_check:
        if count >= args.limit:
            break
            
        print(f"Analyzing {seq['user']} @ {seq['merchant']}...")
        
        # Call the model
        analysis = detector.analyze_sequence(seq['transactions'])
        
        if analysis.get("is_predatory"):
            print(f"  [!] FLAGGED: {analysis.get('pattern_type')}")
            results.append({
                "user_id": seq['user'],
                "merchant": seq['merchant'],
                "pattern_type": analysis.get("pattern_type"),
                "reason": analysis.get("reason"),
                "confidence": "High" # Granite doesn't give confidence score by default in this simple mode
            })
        else:
            print("  [OK] Clean")
            
        count += 1
        # Rate limit protection for demo
        time.sleep(0.5)

    # Save results
    if results:
        res_df = pd.DataFrame(results)
        res_df.to_csv(args.output, index=False)
        print(f"\nAnalysis complete. Found {len(results)} flags. Saved to {args.output}.")
    else:
        print("\nAnalysis complete. No predatory patterns flagged in the sampled batch.")

if __name__ == "__main__":
    main()
