"use client";

import { useEffect, useState } from "react";

export default function FocusTreeTimer() {
  const [isActive, setIsActive] = useState(false); // Timer active or not
  const [totalSeconds, setTotalSeconds] = useState(30 * 60); // default 30 min
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [inputMinutes, setInputMinutes] = useState(30); // user input for timer

  // countdown timer
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  // Format time
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  // growth % for animation
  const growth = isActive ? Math.min(1, 1 - secondsLeft / totalSeconds) : 0;

  // Start timer handler
  const startTimer = () => {
    setTotalSeconds(inputMinutes * 60);
    setSecondsLeft(inputMinutes * 60);
    setIsActive(true);
  };

  // Give up handler
  const giveUp = () => {
    setIsActive(false);
    setSecondsLeft(totalSeconds);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      <div
        className="w-72 h-[420px] rounded-3xl flex flex-col items-center justify-start gap-6 p-6"
        style={{ background: "#63b59c" }}
      >
        {!isActive ? (
          // Timer input UI
          <div className="flex flex-col items-center gap-4">
            <p className="text-white text-lg opacity-90 mt-2">
              Set Focus Timer
            </p>
            <input
              type="number"
              min={1}
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Number(e.target.value))}
              className="px-4 py-2 rounded-lg text-black w-24 text-center"
            />
            <button
              onClick={startTimer}
              className="mt-2 px-6 py-2 text-white border border-white rounded-lg hover:bg-white/20 transition"
            >
              Start
            </button>
          </div>
        ) : (
          // Timer running UI
          <>
            <p className="text-white text-lg opacity-90 mt-2">Stop phubbing!</p>

            <div
              className="w-40 h-40 rounded-full flex items-center justify-center shadow-inner"
              style={{ background: "#f1eab3" }}
            >
              <svg width="120" height="120">
                {/* Soil */}
                <ellipse
                  cx="60"
                  cy="80"
                  rx="45"
                  ry="25"
                  fill="#8B5A2B"
                  style={{ transform: `scale(${0.8 + growth * 0.2})` }}
                />

                {/* Stem */}
                <rect
                  x="58"
                  y={70 - growth * 20}
                  width="4"
                  height={20 + growth * 20}
                  fill="#6B8E23"
                  rx="2"
                />

                {/* Leaves */}
                <ellipse
                  cx={60 - 12}
                  cy={70 - growth * 20}
                  rx={8 + growth * 6}
                  ry={5 + growth * 4}
                  fill="#7CCF4A"
                  style={{ opacity: growth }}
                />
                <ellipse
                  cx={60 + 12}
                  cy={70 - growth * 20}
                  rx={8 + growth * 6}
                  ry={5 + growth * 4}
                  fill="#7CCF4A"
                  style={{ opacity: growth }}
                />
              </svg>
            </div>

            <div className="text-white text-5xl tracking-wide">
              {mm}:{ss}
            </div>

            <button
              onClick={giveUp}
              className="mt-4 px-6 py-2 text-white border border-white rounded-lg hover:bg-white/20 transition"
            >
              Give Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
