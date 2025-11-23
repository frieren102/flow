import vlc
import yt_dlp
import time
import threading

class AudioEngine:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(AudioEngine, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        # Initialize VLC instance
        self.instance = vlc.Instance('--no-video')
        self.player = self.instance.media_player_new()
        self.current_url = None
        self._initialized = True

    def get_stream_url(self, youtube_url):
        """
        Extracts the best audio stream URL using yt-dlp.
        """
        ydl_opts = {
            'format': 'bestaudio/best',
            'quiet': True,
            'no_warnings': True,
        }
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(youtube_url, download=False)
                return info['url']
        except Exception as e:
            print(f"Error extracting stream URL: {e}")
            return None

    def play(self, youtube_url):
        """
        Plays audio from a YouTube URL.
        """
        # If already playing the same URL, do nothing
        if self.current_url == youtube_url and self.player.is_playing():
            print(f"Already playing: {youtube_url}")
            return

        print(f"Resolving stream for: {youtube_url}")
        stream_url = self.get_stream_url(youtube_url)
        
        if not stream_url:
            print("Failed to get stream URL.")
            return

        print(f"Streaming from: {stream_url}")
        
        # Create new media
        media = self.instance.media_new(stream_url)
        self.player.set_media(media)
        
        self.player.play()
        self.current_url = youtube_url

    def stop(self):
        """
        Stops playback.
        """
        if self.player.is_playing():
            self.player.stop()
        self.current_url = None

    def fade_out(self):
        # VLC python bindings don't have a simple fade out, just stop for now
        self.stop()
