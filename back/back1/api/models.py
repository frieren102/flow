from django.db import models

class BiometricRecord(models.Model):
    timestamp = models.DateTimeField()
    
    mean_iki = models.FloatField()
    variance_iki = models.FloatField()
    burstiness = models.FloatField()
    total_keys = models.IntegerField()
    backspace_rate = models.FloatField()

    mouse_distance = models.FloatField()
    click_rate = models.FloatField()

    idle_time_ms = models.IntegerField()

    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp}  | keys={self.total_keys}"
