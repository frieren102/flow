import requests
import time
import json

BASE_URL = "http://localhost:5000"

def test_set_state(state):
    print(f"Testing state: {state}")
    try:
        response = requests.post(f"{BASE_URL}/amplify/light", json={"state": state})
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)

def test_turn_off():
    print("Testing turn off")
    try:
        response = requests.post(f"{BASE_URL}/amplify/light/off")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)

if __name__ == "__main__":
    # Wait for server to start
    print("Waiting for server to be ready...")
    time.sleep(2)
    
    states = ["focused", "highly_focused", "distracted", "highly_distracted", "tired"]
    
    for state in states:
        test_set_state(state)
        time.sleep(2) # Wait to see the effect
        
    test_turn_off()
