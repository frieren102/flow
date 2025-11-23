import requests
import sys

BASE_URL = "http://127.0.0.1:5000/amplify"

def print_menu():
    print("\n--- Flow Music Controller ---")
    print("1. Focused (Lofi Girl)")
    print("2. Deep Work (Brown Noise)")
    print("3. Tired (Ambient Rain)")
    print("4. Stop Music")
    print("5. Exit")

def set_state(state):
    try:
        print(f"Sending state: {state}...")
        response = requests.post(f"{BASE_URL}/music", json={"state": state})
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Playing: {data.get('track', 'Unknown')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

def stop_music():
    try:
        requests.post(f"{BASE_URL}/stop")
        print("Music stopped.")
    except Exception as e:
        print(f"Error: {e}")

def main():
    while True:
        print_menu()
        choice = input("Select an option (1-5): ").strip()
        
        if choice == "1":
            set_state("focused")
        elif choice == "2":
            set_state("highly_focused") # Maps to Brown Noise
        elif choice == "3":
            set_state("tired")
        elif choice == "4":
            stop_music()
        elif choice == "5":
            stop_music()
            print("Exiting...")
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()
