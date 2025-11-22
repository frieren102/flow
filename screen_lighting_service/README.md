# Dynamic Screen Lighting Amplifier

A Python microservice that creates a fullscreen, transparent, always-on-top overlay to simulate "lighting changes" on your screen based on your cognitive state.

## Features

*   **Dynamic Overlay**: Changes color and opacity to match your focus level.
*   **Click-Through**: The overlay is visual-only; mouse clicks pass through to your applications (Windows only).
*   **REST API**: Control the lighting via simple HTTP requests.
*   **Non-Blocking**: The GUI runs in a separate thread, keeping the API responsive.

## Installation

1.  **Prerequisites**: Python 3.x installed.
2.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```

## Usage

1.  **Start the Service**:
    ```powershell
    python app.py
    ```
    The server will start on `http://localhost:5000`.

2.  **Control the Light**:
    You can send POST requests to the API to change the state.

### API Endpoints

#### 1. Set Lighting State (`POST /amplify/light`)

**Body Parameters:**
*   `state` (string): One of the valid states below.

**Valid States:**
*   `"focused"` (Default, Light Blue)
*   `"highly_focused"` (Blue)
*   `"distracted"` (Yellowish)
*   `"highly_distracted"` (Orange-ish)
*   `"tired"` (Warm Orange)

**PowerShell Example:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/amplify/light" -Method Post -ContentType "application/json" -Body '{"state": "highly_focused"}'
```

#### 2. Turn Off Light (`POST /amplify/light/off`)

Turns off the overlay (sets opacity to 0).

**PowerShell Example:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/amplify/light/off" -Method Post
```

## Project Structure

*   `app.py`: Main Flask application.
*   `lighting/controller.py`: Handles the Tkinter overlay and threading.
*   `lighting/mapping.py`: Defines the color/opacity presets.
*   `requirements.txt`: List of python dependencies.
