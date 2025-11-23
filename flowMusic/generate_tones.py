import wave
import math
import struct
import os

def generate_tone(filename, frequency, duration_sec=1):
    sample_rate = 44100
    n_samples = int(sample_rate * duration_sec)
    amplitude = 16000  # Max 32767

    print(f"Generating {filename} ({frequency}Hz)...")
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 2 bytes per sample (16-bit)
        wav_file.setframerate(sample_rate)
        
        for i in range(n_samples):
            # Sine wave
            value = int(amplitude * math.sin(2 * math.pi * frequency * i / sample_rate))
            data = struct.pack('<h', value)
            wav_file.writeframes(data)

def main():
    output_dir = os.path.join("static", "focus_music")
    os.makedirs(output_dir, exist_ok=True)

    # Generate different tones for different intensities
    # Low = Low frequency, High = High frequency
    files = {
        "calm_recovery_01.wav": 220,  # A3
        "focus_medium_01.wav": 440,   # A4
        "focus_high_01.wav": 880      # A5
    }

    for filename, freq in files.items():
        path = os.path.join(output_dir, filename)
        generate_tone(path, freq, duration_sec=2) # 2 seconds loop

if __name__ == "__main__":
    main()
