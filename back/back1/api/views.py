from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BiometricRecord
from datetime import datetime

@csrf_exempt
def biometric(request):
    if request.method == "POST":
        data = json.loads(request.body)

        t = data.get("timestamp")

        typing = data.get("typing", {})
        mouse = data.get("mouse", {})

        record = BiometricRecord.objects.create(
            timestamp=datetime.fromisoformat(t.replace("Z","")),
            mean_iki=typing.get("mean_iki_ms", 0),
            variance_iki=typing.get("variance_iki", 0),
            burstiness=typing.get("burstiness", 0),
            total_keys=typing.get("total_keys", 0),
            backspace_rate=typing.get("backspace_rate", 0),
            mouse_distance=mouse.get("distance_px", 0),
            click_rate=mouse.get("click_rate_per_sec", 0),
            idle_time_ms=data.get("idle_time_ms", 0)
        )

        return JsonResponse({"status": "ok", "id": record.id})

    return JsonResponse({"error": "GET not allowed"}, status=405)
