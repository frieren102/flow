import wave
import struct
import os
import random

def generate_brown_noise(filename, duration_sec=30):
    """
    Generates Brown Noise (Red Noise), which is deeper and more soothing than white noise.
    Good for focus and concentration.
    """
    sample_rate = 44100
    n_samples = int(sample_rate * duration_sec)
    
    print(f"Generating {filename} (Brown Noise)...")
    
    last_value = 0
    # amplitude control
    max_amp = 16000
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        
        for _ in range(n_samples):
            # Brown noise is integrated white noise
            white = random.uniform(-1, 1)
            last_value = (last_value + white * 0.05)
            
            # Soft clipping / leaking to keep it bounded
            last_value *= 0.99
            
            # Clamp
            if last_value > 1.0: last_value = 1.0
            if last_value < -1.0: last_value = -1.0
            
            # Scale to 16-bit integer
            sample = int(last_value * max_amp)
            data = struct.pack('<h', sample)
            wav_file.writeframes(data)

def main():
    output_dir = os.path.join("static", "focus_music")
    os.makedirs(output_dir, exist_ok=True)

    # Generate longer, soothing tracks
    files = [
        "calm_recovery_01.wav",
        "focus_medium_01.wav",
        "focus_high_01.wav"
    ]

    for filename in files:
        path = os.path.join(output_dir, filename)
        generate_brown_noise(path, duration_sec=10) # 10 seconds loop for demo (file size)

if __name__ == "__main__":
    main()
