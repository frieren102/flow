import vlc
import yt_dlp
import time

def test_vlc_youtube():
    youtube_url = "https://www.youtube.com/watch?v=jfKfPfyJRdk" # Lofi Girl
    print(f"Testing URL: {youtube_url}")

    # 1. Get Stream URL
    print("Resolving stream URL with yt-dlp...")
    ydl_opts = {'format': 'bestaudio/best', 'quiet': True}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=False)
            stream_url = info['url']
            print(f"Stream URL found: {stream_url[:50]}...")
    except Exception as e:
        print(f"Error getting stream: {e}")
        return

    # 2. Play with VLC
    print("Initializing VLC...")
    try:
        instance = vlc.Instance('--no-video')
        player = instance.media_player_new()
        media = instance.media_new(stream_url)
        player.set_media(media)
        
        print("Playing...")
        player.play()
        
        # Wait for it to actually start
        time.sleep(2)
        print(f"Is playing: {player.is_playing()}")
        print(f"Volume: {player.audio_get_volume()}")
        
        # Keep alive
        for i in range(10):
            if player.is_playing():
                print(f"Playing... {i+1}/10")
            else:
                print("Not playing.")
                # Print state
                print(f"State: {player.get_state()}")
            time.sleep(1)
            
        player.stop()
        
    except Exception as e:
        print(f"VLC Error: {e}")

if __name__ == "__main__":
    test_vlc_youtube()
