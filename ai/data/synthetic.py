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
    profiles = {
        "focused":    dict(light=(400, 600), temp=(20, 23), hum=(35, 45), motion=(0, 1), noise=(20, 35)),
        "active":     dict(light=(300, 800), temp=(21, 26), hum=(40, 55), motion=(1, 5), noise=(35, 60)),
        "burned_out": dict(light=(100, 250), temp=(23, 27), hum=(45, 60), motion=(0, 1), noise=(15, 30)),
        "creative":   dict(light=(350, 550), temp=(20, 24), hum=(38, 48), motion=(0, 3), noise=(30, 50)),
        "idle":       dict(light=(50, 150), temp=(19, 22), hum=(30, 40), motion=(0, 0), noise=(10, 20)),
    }
    p = profiles.get(profile, profiles["focused"])

    return {
        "device_id": device_id,
        "timestamp": timestamp.isoformat().replace("+00:00", "Z"),
        "light": round(random.uniform(*p["light"]), 1),
        "temperature": round(random.uniform(*p["temp"]), 1),
        "humidity": round(random.uniform(*p["hum"]), 1),
        "motion": random.randint(*p["motion"]),
        "noise": round(random.uniform(*p["noise"]), 1),
    }


def generate_window(
    device_id: str = "esp32-sim-001",
    minutes: int = 30,
    sample_every_seconds: int = 60,
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
    window = generate_window(minutes=10, sample_every_seconds=60, profile="active")
    for r in window:
        print(r)
