"""
Feature extraction: sensor_readings -> behavioral_features

Input: a list of raw readings for one user/device over a time window,
each shaped like { device_id, timestamp, light, temperature, humidity, motion, noise }.

Output: a single feature vector for that window:
{ user_id, window, feature_1..n }

Keep this function pure (no DB/IO) so it can run identically on
synthetic data now and real Supabase data later.
"""

from statistics import mean, pstdev
from datetime import datetime


def _parse_ts(ts: str) -> datetime:
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))


def extract_features(readings: list[dict], user_id: str = "user-1") -> dict:
    if not readings:
        raise ValueError("extract_features: readings window is empty")

    light = [r["light"] for r in readings]
    temp = [r["temperature"] for r in readings]
    hum = [r["humidity"] for r in readings]
    motion = [r["motion"] for r in readings]
    noise = [r["noise"] for r in readings]

    ts_start = _parse_ts(readings[0]["timestamp"])
    ts_end = _parse_ts(readings[-1]["timestamp"])

    return {
        "user_id": user_id,
        "window": {
            "start": readings[0]["timestamp"],
            "end": readings[-1]["timestamp"],
            "n_samples": len(readings),
            "duration_minutes": round((ts_end - ts_start).total_seconds() / 60, 1),
        },
        "features": {
            # Environmental averages
            "avg_light": round(mean(light), 2),
            "avg_temperature": round(mean(temp), 2),
            "avg_humidity": round(mean(hum), 2),
            "avg_noise": round(mean(noise), 2),

            # Stability / variability — proxy for "settled" vs "chaotic" environment
            "light_stability": round(1 / (1 + pstdev(light)), 3) if len(light) > 1 else 1.0,
            "noise_stability": round(1 / (1 + pstdev(noise)), 3) if len(noise) > 1 else 1.0,

            # Motion / activity
            "motion_rate": round(sum(1 for m in motion if m > 0) / len(motion), 3),
            "avg_motion": round(mean(motion), 3),

            # Composite proxies (still just observable signals, not claims about behavior)
            "quiet_score": round(max(0.0, 1 - (mean(noise) / 80)), 3),
            "activity_score": round(min(1.0, mean(motion) / 3), 3),
        },
    }

if __name__ == "__main__":
    from data.synthetic import generate_window

    window = generate_window(minutes=15, profile="focused")
    print(extract_features(window))
