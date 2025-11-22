PRESETS = {
    "highly_focused":    {"color": "#AACCFF", "opacity": 0.18},
    "focused":           {"color": "#BBDDFF", "opacity": 0.14},
    "distracted":        {"color": "#FFF4CC", "opacity": 0.10},
    "highly_distracted": {"color": "#FFDDCC", "opacity": 0.16},
    "tired":             {"color": "#FFCCAA", "opacity": 0.20},
}

DEFAULT_STATE = "focused"

def get_preset(state):
    """
    Returns the preset for the given state.
    If state is invalid, returns None.
    """
    return PRESETS.get(state)

def get_default_preset():
    """Returns the default preset."""
    return PRESETS[DEFAULT_STATE]
