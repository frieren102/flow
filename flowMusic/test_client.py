import requests
import time
import sys

BASE_URL = "http://127.0.0.1:5000/amplify/music"

def test_state(state):
    print(f"Testing state: {state}")
    try:
        response = requests.post(BASE_URL, json={"state": state})
        if response.status_code == 200:
            print(f"Success: {response.json()}")
        else:
            print(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(3)
    
    states = [
        "highly_focused",
        "focused",
        "distracted",
        "highly_distracted",
        "tired",
        "unknown_state"
    ]

    for state in states:
        test_state(state)
        time.sleep(1)

if __name__ == "__main__":
    main()
