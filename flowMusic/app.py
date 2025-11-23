from flask import Flask, request, jsonify
import os
from audio_engine.engine import AudioEngine
from logic.mapping import map_state_to_intensity, intensity_to_file

app = Flask(__name__)
audio_engine = AudioEngine()

@app.route("/amplify/music", methods=["POST"])
def amplify_music():
    try:
        data = request.json
        if not data or "state" not in data:
            return jsonify({"error": "Missing 'state' in request body"}), 400

        state = data["state"]
        intensity = map_state_to_intensity(state)
        
        track_filename = intensity_to_file.get(intensity)
        if not track_filename:
            # Fallback or error if mapping fails unexpectedly
            return jsonify({"error": f"No track mapped for intensity: {intensity}"}), 500

        # Check if we are already playing this exact track/url
        if audio_engine.current_url == track_filename and audio_engine.player.is_playing():
            # User wants to toggle off / stop
            print(f"Toggling off: {track_filename}")
            audio_engine.stop()
            return jsonify({
                "status": "stopped",
                "message": "Music stopped (toggled off)"
            })

        # Otherwise, play (AudioEngine handles stopping previous track)
        audio_engine.play(track_filename)

        return jsonify({
            "status": "playing",
            "track": track_filename,
            "intensity": intensity,
            "state": state
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/amplify/stop", methods=["POST"])
def stop_music():
    audio_engine.stop()
    return jsonify({"status": "stopped"})

if __name__ == "__main__":
    # Ensure static directory exists
    os.makedirs(os.path.join("static", "focus_music"), exist_ok=True)
    app.run(host="0.0.0.0", port=5000, debug=True)
