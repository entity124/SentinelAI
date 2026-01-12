import pandas as pd
import numpy as np
import random
import json
from datetime import datetime, timedelta
import uuid

# Configuration
NUM_USERS = 300
START_DATE = datetime(2023, 1, 1) # Longer history
END_DATE = datetime(2024, 6, 30)
OUTPUT_FILE = "mock_transactions.csv"

# Merchants and Categories with description templates
NORMAL_MERCHANTS = [
    ("GroceryMart", "Groceries", 50, 200, ["Groceries", "Weekly Shop", "Store #402"]),
    ("CoffeeSpot", "Dining", 4, 15, ["Coffee", "Latte", "Morning Brew"]),
    ("MetroTransit", "Transport", 2, 10, ["Bus Fare", "Subway Token", "Ride Share"]),
    ("TechStore", "Electronics", 20, 500, ["Gadget", "Cable", "Repair"]),
    ("StreamFlix", "Entertainment", 12, 12, ["Monthly Sub", "Streaming Service"]),
    ("GymBody", "Health", 40, 40, ["Gym Membership", "Monthly Dues"]),
    ("CityPower", "Utilities", 80, 150, ["Electric Bill", "Power Usage"]),
    ("MobileNet", "Utilities", 45, 60, ["Phone Bill", "Data Plan"]),
    ("FastBurger", "Dining", 10, 30, ["Lunch", "Burger Combo", "Drive Thru"]),
    ("BookWorm", "Shopping", 15, 60, ["Books", "Novel", "Stationery"]),
    ("FashionHub", "Shopping", 30, 150, ["Clothing", "Shoes", "Accessory"]),
    ("RideGo", "Transport", 15, 45, ["Ride to Work", "Trip", "RideGo Svc"]),
]

def generate_random_date(start, end):
    delta = end - start
    random_days = random.randrange(delta.days)
    random_seconds = random.randrange(86400)
    return start + timedelta(days=random_days, seconds=random_seconds)

def generate_user_data(user_id):
    transactions = []
    
    # 1. Generate Normal Background Noise
    num_txns = random.randint(40, 120)
    for _ in range(num_txns):
        merchant, category, min_amt, max_amt, descs = random.choice(NORMAL_MERCHANTS)
        amount = round(random.uniform(min_amt, max_amt), 2)
        if min_amt == max_amt: 
            amount = min_amt
            
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": generate_random_date(START_DATE, END_DATE),
            "user_id": user_id,
            "merchant": merchant,
            "amount": amount,
            "description": random.choice(descs),
            "category": category,
            "pattern_label": "normal"
        })

    # 2. Inject Predatory Patterns
    # We allow multiple potential issues per user
    
    # Scenario A: Price Jump (Recurring sub doubles)
    if random.random() < 0.15:
        base_date = START_DATE + timedelta(days=random.randint(0, 60))
        merch = "SneakyVPN"
        # Stable phase
        for i in range(4):
            transactions.append({
                "transaction_id": str(uuid.uuid4()),
                "timestamp": base_date + timedelta(days=30*i),
                "user_id": user_id,
                "merchant": merch,
                "amount": 9.99,
                "description": "Monthly Access",
                "category": "Software",
                "pattern_label": "normal"
            })
        # The Jump
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date + timedelta(days=120),
            "user_id": user_id,
            "merchant": merch,
            "amount": 49.99, 
            "description": "Monthly Access Premium",
            "category": "Software",
            "pattern_label": "predatory_jump"
        })

    # Scenario B: Inactivity Fee (Dormant then charged)
    if random.random() < 0.15:
        base_date = START_DATE + timedelta(days=random.randint(0, 60))
        merch = "OldBank"
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date,
            "user_id": user_id,
            "merchant": merch,
            "amount": 200.00,
            "description": "Opening Deposit",
            "category": "Finance",
            "pattern_label": "normal"
        })
        # Fee after 5 months silence
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date + timedelta(days=150),
            "user_id": user_id,
            "merchant": merch,
            "amount": 25.00,
            "description": "Dormancy Fee",
            "category": "Finance",
            "pattern_label": "predatory_inactivity"
        })

    # Scenario C: Hidden Subscription (Trap)
    if random.random() < 0.15:
        base_date = START_DATE + timedelta(days=random.randint(0, 150))
        merch = "FreeGadget"
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date,
            "user_id": user_id,
            "merchant": merch,
            "amount": 4.95,
            "description": "S&H for Trial",
            "category": "Shopping",
            "pattern_label": "potential_trap"
        })
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date + timedelta(days=14),
            "user_id": user_id,
            "merchant": merch,
            "amount": 99.00,
            "description": "Quarterly Membership",
            "category": "Shopping",
            "pattern_label": "predatory_hidden"
        })

    # Scenario D: Creeping Fee (Slow boil)
    if random.random() < 0.10:
        base_date = START_DATE + timedelta(days=random.randint(0, 30))
        merch = "StreamPlus"
        base_amt = 12.00
        for i in range(6):
            amt = round(base_amt * (1.08 ** i), 2) # 8% increase each time
            transactions.append({
                "transaction_id": str(uuid.uuid4()),
                "timestamp": base_date + timedelta(days=30*i),
                "user_id": user_id,
                "merchant": merch,
                "amount": amt,
                "description": "Streaming Plan",
                "category": "Entertainment",
                "pattern_label": "predatory_creeping" if i > 3 else "normal"
            })

    # Scenario E: Double Billing (Accidental duplicate)
    if random.random() < 0.10:
        base_date = generate_random_date(START_DATE, END_DATE)
        merch = "GlitchyStore"
        amt = 45.50
        # Charge 1
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date,
            "user_id": user_id,
            "merchant": merch,
            "amount": amt,
            "description": "Purchase #8821",
            "category": "Shopping",
            "pattern_label": "normal"
        })
        # Charge 2 (Same day, slightly different time)
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date + timedelta(seconds=random.randint(10, 300)),
            "user_id": user_id,
            "merchant": merch,
            "amount": amt,
            "description": "Purchase #8821",
            "category": "Shopping",
            "pattern_label": "predatory_double"
        })

    # Scenario F: Zombie Subscription (Returns from dead)
    if random.random() < 0.10:
        base_date = START_DATE
        merch = "ZombieGym"
        # Users cancels
        for i in range(3):
            transactions.append({
                "transaction_id": str(uuid.uuid4()),
                "timestamp": base_date + timedelta(days=30*i),
                "user_id": user_id,
                "merchant": merch,
                "amount": 29.99,
                "description": "Monthly Gym",
                "category": "Health",
                "pattern_label": "normal"
            })
        # 6 Month Gap
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": base_date + timedelta(days=240), # 8 months later
            "user_id": user_id,
            "merchant": merch,
            "amount": 29.99,
            "description": "Monthly Gym",
            "category": "Health",
            "pattern_label": "predatory_zombie"
        })

    return transactions

def main():
    print(f"Generating advanced data for {NUM_USERS} users...")
    all_transactions = []
    
    for i in range(NUM_USERS):
        user_id = f"user_{i:03d}"
        all_transactions.extend(generate_user_data(user_id))
        
    df = pd.DataFrame(all_transactions)
    df = df.sort_values("timestamp")
    
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Saved {len(df)} transactions to {OUTPUT_FILE}")
    
    # Generate Training Data (JSONL)
    print("Generating training dataset (train.jsonl)...")
    training_data = []
    
    grouped = df.groupby(['user_id', 'merchant'])
    for (user, merchant), group in grouped:
        if len(group) < 2: continue
        
        sorted_txns = group.sort_values("timestamp").to_dict('records')
        clean_txns = []
        for t in sorted_txns:
            clean_txns.append({
                "date": str(t.get("timestamp"))[:10],
                "amt": t.get("amount"),
                "desc": t.get("description")
            })
            
        predatory_txns = group[group['pattern_label'].str.startswith('predatory')]
        
        is_predatory = len(predatory_txns) > 0
        pattern_type = "None"
        reason = "Transactions show normal consistent activity."
        
        if is_predatory:
            labels = predatory_txns['pattern_label'].unique()
            if "predatory_jump" in labels:
                pattern_type = "Price Jump"
                reason = "Subscription price increased >50%."
            elif "predatory_inactivity" in labels:
                pattern_type = "Inactivity Fee"
                reason = "Fee charged after long period of inactivity."
            elif "predatory_hidden" in labels:
                pattern_type = "Hidden Subscription"
                reason = "Trial converted to high recurring fee."
            elif "predatory_creeping" in labels:
                pattern_type = "Creeping Fee"
                reason = "Subscription cost increased multiple times sequentially."
            elif "predatory_double" in labels:
                pattern_type = "Double Billing"
                reason = "Duplicate charge for same amount on same day."
            elif "predatory_zombie" in labels:
                pattern_type = "Zombie Subscription"
                reason = "Recurring charge resumed after >6 months of silence."

        sample = {
            "instruction": "Analyze the transaction history for predatory patterns. Return JSON: {is_predatory, pattern_type, reason}.",
            "input": json.dumps(clean_txns),
            "output": json.dumps({
                "is_predatory": is_predatory,
                "pattern_type": pattern_type,
                "reason": reason
            })
        }
        training_data.append(sample)
        
    with open("train.jsonl", "w") as f:
        for entry in training_data:
            f.write(json.dumps(entry) + "\n")
            
    print(f"Saved {len(training_data)} training examples to train.jsonl")

if __name__ == "__main__":
    main()
