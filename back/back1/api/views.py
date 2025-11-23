from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BiometricRecord, UserTask, GazeRecord
from datetime import datetime
import numpy as np
import onnxruntime as ort

sess = ort.InferenceSession("flow_model.onnx")

def all_gaze(request):
    records = GazeRecord.objects.all().order_by("-timestamp")

    data = []
    for r in records:
        data.append({
            "timestamp": r.timestamp,
            "gaze_x": r.gaze_x,
            "gaze_y": r.gaze_y,
            "screen_w": r.screen_w,
            "screen_h": r.screen_h,
            "received_at": r.received_at,
        })

    return JsonResponse({"gaze": data})


def latest_gaze(request):
    last = GazeRecord.objects.order_by("-timestamp").first()
    if not last:
        return JsonResponse({"error": "no gaze data"}, status=404)

    return JsonResponse({
        "timestamp": last.timestamp,
        "gaze_x": last.gaze_x,
        "gaze_y": last.gaze_y,
        "screen_w": last.screen_w,
        "screen_h": last.screen_h,
        "received_at": last.received_at,
    })

def predict_flow(features):
    X = np.array([features], dtype=np.float32)

    input_name = sess.get_inputs()[0].name
    pred = sess.run(None, {input_name: X})[0]

    return pred[0]

def latest_tasks(request):
    last_record = BiometricRecord.objects.order_by("-timestamp").first()
    if not last_record:
        return JsonResponse({"tasks": []})

    tasks = [
        {
            "timestamp": t.timestamp,
            "app": t.app,
            "title": t.title,
            "url": t.url,
            "active": t.active,
        }
        for t in last_record.tasks.all()
    ]

    return JsonResponse({"tasks": tasks})


def latest_state(request):
    last = BiometricRecord.objects.order_by("-timestamp").first()
    if not last:
        return JsonResponse({"error": "no data"}, status=404)

    return JsonResponse({
        "timestamp": last.timestamp,
        "received_at": last.received_at,

        # Typing metrics
        "mean_iki_ms": last.mean_iki_ms,
        "variance_iki": last.variance_iki,
        "burstiness": last.burstiness,
        "total_keys": last.total_keys,
        "backspace_rate": last.backspace_rate,
        "backspaces": last.backspaces,

        # Mouse metrics
        "distance_px": last.distance_px,
        "click_rate_per_sec": last.click_rate_per_sec,
        "mouse_clicks": last.mouse_clicks,

        # System metrics
        "idle_time_ms": last.idle_time_ms,

        # ML output
        "state_prediction": last.state_prediction,
        
        # gaze
        "gaze_x": last.gaze_x,
        "gaze_y": last.gaze_y,
        "screen_w": last.screen_w,
        "screen_h": last.screen_h,
    })

@csrf_exempt
def biometric(request):
    if request.method == "POST":
        data = json.loads(request.body)

        typing = data.get("typing", {})
        mouse = data.get("mouse", {})
        tasks = data.get("tasks", []) 
        gaze = data.get("gaze", {})

        timestamp_str = data.get("timestamp")
        timestamp = datetime.fromisoformat(timestamp_str.replace("Z", ""))

        # Create biometric record
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
            
            # Gaze
            gaze_x=gaze.get("x", 0),
            gaze_y=gaze.get("y", 0),
            screen_w=gaze.get("screen_w", 0),
            screen_h=gaze.get("screen_h", 0),
        )

        # ===== ML Prediction =====
        features = [
            record.mean_iki_ms,
            record.variance_iki,
            record.burstiness,
            record.total_keys,
            record.backspace_rate,
            record.backspaces,
            record.distance_px,
            record.click_rate_per_sec,
            record.mouse_clicks,
            record.idle_time_ms,
        ]

        state = predict_flow(features)
        record.state_prediction = state
        record.save()

        # ===== STORE TASKS =====
        for t in tasks:
            UserTask.objects.create(
                timestamp=timestamp,
                app=t.get("app", ""),
                title=t.get("title", ""),
                url=t.get("url", ""),
                active=t.get("active", False),
                record=record,   # link to biometrics
            )

        return JsonResponse({
            "status": "saved",
            "id": record.id,
            "state_prediction": record.state_prediction
        })

    return JsonResponse({"error": "POST only"}, status=405)

@csrf_exempt
def receive_gaze(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)
    gaze = data.get("gaze", {})

    if not gaze:
        return JsonResponse({"error": "no gaze data"}, status=400)

    ts = gaze.get("timestamp")
    from datetime import datetime
    timestamp = datetime.fromtimestamp(ts)

    rec = GazeRecord.objects.create(
        timestamp=timestamp,
        gaze_x=gaze.get("gaze_x", 0),
        gaze_y=gaze.get("gaze_y", 0),
        screen_w=gaze.get("screen_w", 0),
        screen_h=gaze.get("screen_h", 0),
    )

    return JsonResponse({"status": "saved", "id": rec.id})
