# Flow Music Service

A Flask-based microservice that plays focus-enhancing background music based on your cognitive state. It streams infinite audio from YouTube (Lofi Girl, Brown Noise, Ambient Rain) using VLC.

## Features

*   **State-Based Audio**: Automatically plays the right music for your current state (e.g., Focused, Tired, Stressed).
*   **Infinite Streaming**: Uses YouTube live streams or long videos for uninterrupted playback.
*   **Toggle Functionality**: Sending the same state twice toggles the music on/off.
*   **VLC Integration**: High-quality audio playback independent of the browser.

## Supported States

| State | Audio Type | Description |
| :--- | :--- | :--- |
| `focused` | **Lofi Hip Hop** | Relaxed beats for general work. |
| `highly_focused` | **Brown Noise** | Deep static for blocking distractions. |
| `distracted` | **Brown Noise** | Forces deep focus to get you back on track. |
| `tired` / `relaxed` | **Ambient Rain** | Soothing nature sounds for recovery. |
| `stressed` / `anxious` | **528Hz Healing** | Calming tones for stress relief. |

## Installation

1.  **Prerequisites**:
    *   Python 3.8+
    *   **VLC Media Player** must be installed on your system.

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

### 1. Start the Server
```bash
python app.py
```
The server runs on `http://localhost:5000`.

### 2. Control Music (Interactive)
Use the included controller script for an easy menu interface:
```bash
python interactive_controller.py
```

### 3. Control Music (API)

**Start/Toggle Music:**
Send a POST request to `/amplify/music` with your state.

*PowerShell:*
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/amplify/music" -Method Post -ContentType "application/json" -Body '{"state": "focused"}'
```

*Curl:*
```bash
curl -X POST http://localhost:5000/amplify/music -H "Content-Type: application/json" -d '{"state": "focused"}'
```

**Stop Music:**
Force stop playback.

*PowerShell:*
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/amplify/stop" -Method Post
```

## Project Structure

*   `app.py`: Main Flask application and API routes.
*   `audio_engine/engine.py`: Handles VLC playback and YouTube stream resolution (`yt-dlp`).
*   `logic/mapping.py`: Maps cognitive states to YouTube URLs.
*   `interactive_controller.py`: Simple CLI tool to test the service.
