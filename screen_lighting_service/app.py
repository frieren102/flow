from flask import Flask, request, jsonify
from lighting.controller import ScreenLightingController
from lighting.mapping import get_preset, PRESETS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize the controller
controller = ScreenLightingController()

# Controller is started in __name__ == '__main__' block


@app.route('/amplify/light', methods=['POST'])
def set_light():
    data = request.get_json()
    if not data or 'state' not in data:
        return jsonify({"error": "Missing 'state' in request body"}), 400
    
    state = data['state']
    preset = get_preset(state)
    
    if not preset:
        return jsonify({"error": f"Invalid state. Valid states are: {list(PRESETS.keys())}"}), 400
    
    controller.set_state(preset)
    
    return jsonify({
        "status": "ok",
        "state": state,
        "preset": preset
    })

@app.route('/amplify/light/off', methods=['POST'])
def turn_off_light():
    controller.turn_off()
    return jsonify({"status": "ok", "message": "Light turned off"})

if __name__ == '__main__':
    # Start the controller immediately when running as main
    if not controller.is_alive():
        controller.start()
        
    # Run Flask app
    # debug=False is important because debug mode's reloader can cause issues with threads
    app.run(port=5000, debug=False, use_reloader=False)
