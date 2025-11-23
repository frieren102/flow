from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BiometricRecord
from datetime import datetime

@csrf_exempt
def biometric(request):
    if request.method == "POST":
        data = json.loads(request.body)

        typing = data.get("typing", {})
        mouse = data.get("mouse", {})

        timestamp_str = data.get("timestamp")
        timestamp = datetime.fromisoformat(timestamp_str.replace("Z", ""))

        record = BiometricRecord.objects.create(
            timestamp=timestamp,

            # Typing metrics
            mean_iki_ms=typing.get("mean_iki_ms", 0),
            variance_iki=typing.get("variance_iki", 0),
            burstiness=typing.get("burstiness", 0),
            total_keys=int(typing.get("total_keys", 0)),
            backspace_rate=typing.get("backspace_rate", 0),
            backspaces=int(typing.get("backspaces", 0)),

            # Mouse metrics
            distance_px=int(mouse.get("distance_px", 0)),
            click_rate_per_sec=mouse.get("click_rate_per_sec", 0),
            mouse_clicks=int(mouse.get("mouse_clicks", 0)),

            # System metrics
            idle_time_ms=int(data.get("idle_time_ms", 0)),
        )

        return JsonResponse({"status": "saved", "id": record.id})

    return JsonResponse({"error": "POST only"}, status=405)