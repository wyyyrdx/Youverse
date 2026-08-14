"""
Synthetic sensor data generator.

Matches the frozen Hardware -> Backend payload contract:
{ device_id, timestamp, light, temperature, humidity, motion, noise }

Use this to unblock feature extraction and scoring work before
real ESP32 data is flowing. All output here is explicitly synthetic
and must be labeled as such wherever it's consumed downstream.
"""

import random
from datetime import datetime, timedelta, timezone


def generate_reading(device_id: str, timestamp: datetime, profile: str = "focused") -> dict:
    """
    Generate one synthetic sensor reading.

    profile: a rough behavioral archetype to bias the synthetic values,
    useful for sanity-checking that your scoring model responds sensibly.
    Options: "focused", "active", "burned_out", "creative", "idle"
    """
    # Ranges per Waad's confirmed Sensor Data Contract:
    # light 0-100, temperature 10-45C, humidity 10-95%, noise 0-100, motion is 0/1 only.
    profiles = {
        "focused":    dict(light=(55, 75), temp=(20, 23), hum=(35, 45), motion_p=0.15, noise=(15, 30)),
        "active":     dict(light=(40, 90), temp=(21, 27), hum=(40, 55), motion_p=0.70, noise=(30, 55)),
        "burned_out": dict(light=(10, 30), temp=(24, 30), hum=(45, 65), motion_p=0.10, noise=(10, 25)),
        "creative":   dict(light=(45, 70), temp=(20, 25), hum=(38, 50), motion_p=0.35, noise=(25, 45)),
        "idle":       dict(light=(5, 20), temp=(18, 22), hum=(30, 40), motion_p=0.02, noise=(5, 15)),
    }
    p = profiles.get(profile, profiles["focused"])

    return {
        "device_id": device_id,
        "timestamp": timestamp.isoformat().replace("+00:00", "Z"),
        "light": round(random.uniform(*p["light"]), 1),
        "temperature": round(random.uniform(*p["temp"]), 1),
        "humidity": round(random.uniform(*p["hum"]), 1),
        "motion": 1 if random.random() < p["motion_p"] else 0,  # confirmed: 0 or 1 only
        "noise": round(random.uniform(*p["noise"]), 1),
    }


def generate_window(
    device_id: str = "esp32-sim-001",
    minutes: int = 30,
    sample_every_seconds: int = 5,  # confirmed: firmware samples every 5s
    profile: str = "focused",
    start: datetime | None = None,
) -> list[dict]:
    """Generate a window of readings simulating `minutes` of sampling."""
    start = start or datetime.now(timezone.utc)
    n_samples = max(1, (minutes * 60) // sample_every_seconds)
    return [
        generate_reading(device_id, start + timedelta(seconds=i * sample_every_seconds), profile)
        for i in range(n_samples)
    ]


if __name__ == "__main__":
    window = generate_window(minutes=1, profile="active")  # 12 samples at 5s intervals
    for r in window:
        print(r)
