import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- 1. CREDENTIALS ---
# John's API key - for fraud scoring (predictions endpoint)
SCORING_API_KEY = "OP1mOPIL34elWjPUuCyDwsPl-3lUMt8MOYm3NKjgAyeO"

# User's API key - for chat (text generation endpoint)
CHAT_API_KEY = "s2a3yjoicLrQf1yBZhR2OtftvavQk6-6nzk9LjK9dEN4"

PROJECT_ID = "edc17a57-148c-4ece-af8b-afa06143f283"
BASE_URL = "https://ca-tor.ml.cloud.ibm.com"
SCORING_URL = "https://ca-tor.ml.cloud.ibm.com/ml/v4/deployments/92ffc9fd-afa7-47b3-af34-0f8f22b440a0/predictions"

# --- 2. AUTHENTICATION ---
def get_iam_token(api_key):
    """Exchange API key for IAM bearer token."""
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = f"apikey={api_key}&grant_type=urn:ibm:params:oauth:grant-type:apikey"
    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        return response.json()["access_token"]
    except Exception as e:
        print(f"Error getting IAM token: {e}")
        return None

# --- 3. THE BRAIN (CHAT VERSION) ---
PROMPT_TEMPLATE = """You are Sentinel, a friendly AI assistant for GuardianAI - a financial protection service.

YOUR JOB:
Answer ANY questions about the user's transactions. You have access to ALL their transaction data below.

BEHAVIOR RULES:
1. For simple greetings like "hello", respond: "Hi! How can I help you with your transactions today?"
2. For questions about transactions (any category, any merchant, flagged or not), ANSWER using the data below.
3. For truly off-topic questions (movies, manga, personal life), redirect: "I'm focused on your finances. Ask me about your transactions!"
4. Keep responses to 1-3 sentences.

USER'S TRANSACTION DATA (use this to answer questions):
{transactions}

FLAGGED ALERTS:
{model_result}

OUTPUT RULES:
1. Short responses. 1-3 sentences.
2. No markdown. No asterisks. Plain text only.
3. When listing, use numbers (1, 2, 3).
4. Be helpful and accurate with transaction data.

User: {user_input}

Sentinel:"""

def get_watson_response(user_input, transactions, model_result):
    # 1. Get Token
    token = get_iam_token(CHAT_API_KEY)
    if not token:
        return "System Error: Could not authenticate with Watsonx."

    # 2. Prepare Payload
    url = f"{BASE_URL}/ml/v1/text/generation?version=2023-05-29"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    full_prompt = PROMPT_TEMPLATE.format(
        user_input=user_input,
        transactions=transactions,
        model_result=model_result
    )

    body = {
        "model_id": "meta-llama/llama-3-3-70b-instruct",
        "input": full_prompt,
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 500,
            "stop_sequences": ["User:", "User", "\nUser", "\n\nUser", "Sentinel:"]
        },
        "project_id": PROJECT_ID
    }

    # 3. Call API
    try:
        response = requests.post(url, headers=headers, json=body)
        if response.status_code != 200:
            print(f"API Error {response.status_code}: {response.text}")
            return "System Error: Watsonx API request failed."
        
        result = response.json()
        return result['results'][0]['generated_text'].strip()

    except Exception as e:
        print(f"Error calling Watsonx: {e}")
        return "System Error: Failed to generate response."

# --- 4. THE BRAIN (SCORING VERSION) ---
def analyze_transaction(transaction_data):
    # Unpack the data so we can check it
    # Format: [Amount, Price_Change_Pct, Total_Change, Days_Diff, Quick_Charge, Freq, Cat]
    price_change = transaction_data[1]
    days_diff = transaction_data[3]
    is_quick = transaction_data[4]
    
    # 1. GET THE SCORE FROM WATSON
    token = get_iam_token(SCORING_API_KEY)
    
    # --- THE FIX IS HERE ---
    # We must explicitly list the column names so Watson knows what the values are.
    # Also need to add ?version= query param and ensure proper data types
    scoring_url_with_version = f"{SCORING_URL}?version=2023-05-29"
    
    # Ensure proper data types for all values
    typed_values = [
        float(transaction_data[0]),  # amount
        float(transaction_data[1]),  # price_change_pct
        float(transaction_data[2]),  # total_change_pct
        float(transaction_data[3]),  # days_diff
        int(transaction_data[4]),    # is_quick_charge (0 or 1)
        str(transaction_data[5]),    # frequency
        str(transaction_data[6])     # category
    ]
    
    payload = {
        "input_data": [{
            "fields": ['amount', 'price_change_pct', 'total_change_pct', 'days_diff', 'is_quick_charge', 'frequency', 'category'],
            "values": [typed_values]
        }]
    }
    
    # Send the request
    response = requests.post(
        scoring_url_with_version, 
        json=payload, 
        headers={"Authorization": "Bearer " + token}
    )
    
    # Check if the request failed
    if response.status_code != 200:
        print(f"Watsonx Error Response: {response.text}")
        return {"risk_score": 0, "is_flagged": False, "explanation": "Error analyzing transaction"}

    # Get fraud probability (e.g., 0.85)
    try:
        result_json = response.json()
        print(f"Watsonx Response: {result_json}")  # Debug log
        
        # Extract the values - structure is typically: values = [[prediction, [prob_0, prob_1]]]
        values = result_json['predictions'][0]['values'][0]
        
        # The probability might be at index [1] as a list [prob_class_0, prob_class_1]
        # We want the probability of class 1 (flagged)
        if isinstance(values[1], list):
            fraud_prob = values[1][1]  # Get prob_class_1 from [prob_0, prob_1]
        else:
            fraud_prob = values[1]  # Direct probability value
            
    except (KeyError, IndexError, TypeError) as e:
        print(f"Error parsing response: {e}")
        # Fallback if the response format is unexpected
        return {"risk_score": 0, "is_flagged": False, "explanation": "Unexpected response format from Watson."}
    
    # 2. GENERATE THE "WHY" (The Logic Wrapper)
    reasons = []
    
    # LOCAL OVERRIDE: Flag if price change is 20% or more, regardless of AI score
    # This ensures our demo scenarios work correctly
    is_flagged = fraud_prob > 0.40 or price_change >= 20.0
    
    if is_flagged:
        # Check the "Big 3" Triggers
        if days_diff >= 60:
            reasons.append("Zombie Billing (Inactive for 60+ days)")
        
        if price_change >= 20.0:
            reasons.append(f"Price Surge ({price_change}% increase detected)")
            
        if is_quick:
            reasons.append("Rapid-Fire Charge (Too fast)")
            
        if not reasons:
            reasons.append("Suspicious Pattern (General Anomaly)")

    return {
        "risk_score": fraud_prob,
        "is_flagged": fraud_prob > 0.40,
        "explanation": " + ".join(reasons) if reasons else "Transaction looks safe."
    }


# --- 5. THE WEB SERVER ---
@app.route('/chat', methods=['POST'])
def chat():
    print("Received chat request...")
    data = request.json
    user_msg = data.get('message')
    tx_data = data.get('transactions', "No transactions provided.")
    risk_data = data.get('model_result', "No alerts.")
    
    response_text = get_watson_response(user_msg, tx_data, risk_data)
    return jsonify({"reply": response_text})

@app.route('/analyze', methods=['POST'])
def analyze():
    print("Received analysis request...")
    data = request.json
    # Expected format: {"feature_vector": [19.99, 0.0, 0.0, 30, 0, 1, 3]}
    feature_vector = data.get('feature_vector')
    
    if not feature_vector:
        return jsonify({"error": "No feature_vector provided"}), 400
        
    result = analyze_transaction(feature_vector)
    return jsonify(result)

if __name__ == '__main__':
    print("🚀 Sentinel Bridge running on port 5000")
    print("   Endpoint: http://localhost:5000/chat")
    print("   Endpoint: http://localhost:5000/analyze")
    app.run(port=5000)
