def map_state_to_intensity(state):
    """
    Maps a cognitive state to a music intensity/category.
    """
    # Direct state-to-category mapping
    # We map specific user states to our internal keys
    state_map = {
        "focused": "focused",
        "highly_focused": "deep_work",
        "distracted": "deep_work", # If distracted, force deep focus
        "highly_distracted": "deep_work",
        "tired": "relaxed",
        "relaxed": "relaxed",
        "calm": "relaxed",
        "anxious": "calm_recovery",
        "stressed": "calm_recovery"
    }
    return state_map.get(state, "focused") # Default to focused

# Mapping categories to YouTube URLs
intensity_to_file = {
    "focused": "https://www.youtube.com/watch?v=jfKfPfyJRdk",      # Lofi Girl (General Focus)
    "deep_work": "https://www.youtube.com/watch?v=RqzGzwTY-6w",    # Brown Noise (Deep Concentration)
    "relaxed": "https://www.youtube.com/watch?v=t_28251qQnU",      # Ambient Rain (Relaxation/Tired)
    "calm_recovery": "https://www.youtube.com/watch?v=lTRiuFIWV54" # 528Hz Healing/Calming (Stress Relief)
}
