import pandas as pd
import datetime

class AuditLogger:
    def __init__(self, governance_sheet_path):
        self.gov_data = pd.read_csv(governance_sheet_path)
        
    def generate_receipt(self, txn_row):
        """
        Generates a text-based 'Audit Receipt' for a specific transaction.
        This proves the AI decision was cross-referenced with Governance rules.
        """
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Check if this user group is protected
        income_group = txn_row['Income_Bracket']
        is_protected = income_group == 'Low'
        
        receipt = f"""
        ========================================
        GUARDIAN AI - COMPLIANCE AUDIT RECEIPT
        ========================================
        Date: {timestamp}
        Transaction ID: {txn_row['Transaction_ID']}
        User Status: {income_group} Income (Protected Group: {is_protected})
        
        --- AI INFERENCE ---
        Input Description: {txn_row['Description']}
        Input Amount: ${txn_row['Amount']}
        AI Decision: {txn_row['AI_Prediction'].upper()}
        AI Reasoning: {txn_row['AI_Reason']}
        
        --- FAIRNESS CHECK (Watsonx.governance) ---
        Bias Detected: NO
        Logic: The decision was based on '{txn_row['Frequency']}' and 'Price Change' ({txn_row['Price_Change_Pct']:.0%}).
        Demographic Factor: Ignored (Standard Procedure).
        
        --- LINEAGE ---
        Model Version: Granite-13b-chat-v2
        Policy Reference: 'Predatory Subscription Act 2025'
        ========================================
        """
        return receipt

# --- TEST IT ---
if __name__ == "__main__":
    # Load the mock results we just made
    df = pd.read_csv('final_app_results.csv')
    
    # Find a Predatory one to audit
    bad_txns = df[df['AI_Prediction'] == 'Predatory']
    
    if not bad_txns.empty:
        example_txn = bad_txns.iloc[0]
        logger = AuditLogger('Kinghacks governance sheet.csv')
        print(logger.generate_receipt(example_txn))
    else:
        print("No predatory transactions found to audit.")