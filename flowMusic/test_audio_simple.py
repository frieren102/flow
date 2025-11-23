import pygame
import os
import time

def test_playback():
    pygame.mixer.init()
    
    # Check if mixer is initialized
    if pygame.mixer.get_init():
        print(f"Mixer initialized: {pygame.mixer.get_init()}")
    else:
        print("Mixer failed to initialize")
        return

    # Path to a file we know exists (generated previously)
    track_path = os.path.join("static", "focus_music", "focus_medium_01.wav")
    
    if not os.path.exists(track_path):
        print(f"File not found: {track_path}")
        return

    print(f"Loading: {track_path}")
    try:
        pygame.mixer.music.load(track_path)
        pygame.mixer.music.set_volume(1.0)
        print("Playing... (Press Ctrl+C to stop)")
        pygame.mixer.music.play()
        
        # Keep script alive to let it play
        while pygame.mixer.music.get_busy():
            time.sleep(1)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_playback()
