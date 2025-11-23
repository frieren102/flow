from django.urls import path
from .views import biometric

urlpatterns = [
    path('biometric/', biometric),
]
