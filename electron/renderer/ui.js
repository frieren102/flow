// ----- State -----
let lastKeyTime = null;
let ikiList = [];
let totalKeys = 0;
let backspaceCount = 0;

let lastMousePos = null;
let mouseDistance = 0;
let clickCount = 0;

let lastActivityTime = Date.now();

// For click rate over interval
let intervalStartTime = Date.now();

// ----- Helpers -----
function updateActivity() {
  lastActivityTime = Date.now();
}

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function variance(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length;
}

// A simple "burstiness" metric: std / mean (coefficient of variation)
function burstiness(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  if (m === 0) return 0;
  const v = variance(arr);
  const std = Math.sqrt(v);
  return std / m;
}

// ----- Event listeners -----

const typingArea = document.getElementById("typingArea");

// Key events only inside the Electron window (demo-style)
window.addEventListener("keydown", (e) => {
  const now = performance.now();
  updateActivity();

  // Inter-keystroke interval
  if (lastKeyTime !== null) {
    ikiList.push(now - lastKeyTime);
  }
  lastKeyTime = now;

  totalKeys++;

  if (e.key === "Backspace") {
    backspaceCount++;
  }
});

// Mouse movement inside window
window.addEventListener("mousemove", (e) => {
  const now = performance.now();
  updateActivity();

  if (lastMousePos) {
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    mouseDistance += Math.sqrt(dx * dx + dy * dy);
  }
  lastMousePos = { x: e.clientX, y: e.clientY };
});

// Clicks inside window
window.addEventListener("mousedown", () => {
  updateActivity();
  clickCount++;
});

// ----- Sending loop -----

const backendUrl = "http://127.0.0.1:8000/biometric/"; 

async function sendMetrics() {
  const now = Date.now();

  const intervalSeconds = (now - intervalStartTime) / 1000;
  const clicksPerSec =
    intervalSeconds > 0 ? clickCount / intervalSeconds : 0;

  const data = {
    typing: {
      mean_iki_ms: Number(mean(ikiList).toFixed(2)),
      variance_iki: Number(variance(ikiList).toFixed(2)),
      burstiness: Number(burstiness(ikiList).toFixed(3)),
      total_keys: totalKeys,
      backspace_rate:
        totalKeys > 0 ? Number((backspaceCount / totalKeys).toFixed(3)) : 0
    },
    mouse: {
      distance_px: Math.round(mouseDistance),
      click_rate_per_sec: Number(clicksPerSec.toFixed(3))
    },
    idle_time_ms: now - lastActivityTime,
    timestamp: new Date().toISOString()
  };

  // Reset interval counters
  ikiList = [];
  mouseDistance = 0;
  clickCount = 0;
  intervalStartTime = now;

  // Update UI
  document.getElementById("iki").innerText = data.typing.mean_iki_ms;
  document.getElementById("ikiVar").innerText = data.typing.variance_iki;
  document.getElementById("backRate").innerText = data.typing.backspace_rate;
  document.getElementById("burst").innerText = data.typing.burstiness;
  document.getElementById("dist").innerText = data.mouse.distance_px;
  document.getElementById("clickRate").innerText =
    data.mouse.click_rate_per_sec;
  document.getElementById("idle").innerText = data.idle_time_ms;
  document.getElementById("time").innerText = data.timestamp;

  // Send to backend
  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      document.getElementById("status").innerText = "Sent ✅";
    } else {
      document.getElementById("status").innerText =
        "Error: " + res.status + " ❌";
    }
  } catch (err) {
    document.getElementById("status").innerText = "Backend unreachable ❌";
    console.log("Backend error:", err.message);
  }
}

setInterval(sendMetrics, 5000);
