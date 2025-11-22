import tkinter as tk
import threading
import logging
import platform

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import pywin32 components for Windows click-through support
try:
    import win32gui
    import win32con
    import win32api
    HAS_PYWIN32 = True
except ImportError:
    logger.warning("pywin32 not found. Click-through support will be disabled.")
    HAS_PYWIN32 = False

class ScreenLightingController(threading.Thread):
    def __init__(self):
        super().__init__()
        self.daemon = True  # Daemon thread exits when main program exits
        self.root = None
        self.overlay = None
        self.running = False
        
        # Shared state
        self._lock = threading.Lock()
        self._target_color = "#BBDDFF"  # Default: focused
        self._target_opacity = 0.0      # Start hidden
        self._current_color = "#BBDDFF"
        self._current_opacity = 0.0
        self._visible = False

    def run(self):
        """Runs the Tkinter main loop in this thread."""
        logger.info("Starting ScreenLightingController thread")
        self.root = tk.Tk()
        self.root.title("Screen Lighting Overlay")
        
        # Remove window decorations
        self.root.overrideredirect(True)
        
        # Keep always on top
        self.root.attributes('-topmost', True)
        
        # Set initial geometry to cover the whole screen
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        self.root.geometry(f"{screen_width}x{screen_height}+0+0")
        
        # Set initial transparency
        self.root.attributes('-alpha', self._current_opacity)
        
        # Create a frame for the background color
        self.overlay = tk.Frame(self.root, bg=self._current_color)
        self.overlay.pack(fill='both', expand=True)
        
        # Apply click-through if on Windows and pywin32 is available
        if platform.system() == "Windows" and HAS_PYWIN32:
            self._enable_click_through()
        
        self.running = True
        self._update_loop()
        self.root.mainloop()
        logger.info("ScreenLightingController thread stopped")

    def _enable_click_through(self):
        """Sets the window style to allow mouse clicks to pass through."""
        try:
            # Allow the window to be created fully before getting HWND
            self.root.update()
            hwnd = win32gui.GetParent(self.root.winfo_id())
            
            # Get current window styles
            ex_style = win32gui.GetWindowLong(hwnd, win32con.GWL_EXSTYLE)
            
            # Add transparent and layered styles
            # WS_EX_TRANSPARENT: The window should not be painted until siblings beneath the window (that were created by the same thread) have been painted.
            # WS_EX_LAYERED: Required for transparency and alpha blending.
            # WS_EX_TOOLWINDOW: Prevents the window from appearing in the taskbar.
            new_style = ex_style | win32con.WS_EX_TRANSPARENT | win32con.WS_EX_LAYERED | win32con.WS_EX_TOOLWINDOW
            
            win32gui.SetWindowLong(hwnd, win32con.GWL_EXSTYLE, new_style)
            logger.info("Click-through support enabled.")
        except Exception as e:
            logger.error(f"Failed to enable click-through: {e}")

    def _update_loop(self):
        """Periodically updates the overlay state."""
        if not self.running:
            return

        with self._lock:
            target_color = self._target_color
            target_opacity = self._target_opacity

        # Update color if changed
        if self._current_color != target_color:
            self.overlay.configure(bg=target_color)
            self._current_color = target_color

        # Update opacity if changed
        # Note: Tkinter attributes call can be expensive, so only call if needed
        if self._current_opacity != target_opacity:
            self.root.attributes('-alpha', target_opacity)
            self._current_opacity = target_opacity
            
            # If opacity is 0, we might want to withdraw the window to save resources,
            # but for now we just keep it transparent as per requirements.
            if target_opacity == 0:
                pass # self.root.withdraw() could be used here if we wanted to hide it completely
            else:
                self.root.deiconify()

        # Schedule next update (100ms = 10fps)
        self.root.after(100, self._update_loop)

    def set_state(self, state_data):
        """
        Updates the target state.
        state_data: dict with 'color' and 'opacity'
        """
        with self._lock:
            self._target_color = state_data['color']
            self._target_opacity = state_data['opacity']
            self._visible = True
        logger.info(f"State set to: {state_data}")

    def turn_off(self):
        """Turns off the overlay."""
        with self._lock:
            self._target_opacity = 0.0
            self._visible = False
        logger.info("Overlay turned off")

    def stop(self):
        """Stops the thread and closes the window."""
        self.running = False
        if self.root:
            self.root.quit()
