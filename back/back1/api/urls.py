from django.urls import path
from .views import biometric, latest_state, latest_tasks, receive_gaze, latest_gaze, all_gaze

urlpatterns = [
    path('biometric/', biometric),
    path("latest_state/", latest_state),
    path("latest_tasks/", latest_tasks),
    path("gaze/", receive_gaze),
    path("gaze/latest/", latest_gaze),
    path("gaze/all/", all_gaze),
]
