"""
Future-state scoring: behavioral_features -> predictions

Weighted rule-based scoring (per the plan doc's recommendation for a
10-day hackathon: engineered features + weighted scoring, ML optional
later). Output always normalizes to 100%.

Output shape: [{ future_state, score }] (matches `predictions` table)
"""

FUTURE_STATES = ["Focused You", "Consistent You", "Creative You", "Burned-Out You", "Active You"]

# Each rule maps a feature name -> (weight per future state).
# Positive weight = feature pushes toward that state; negative = pushes away.
# These are a starting point — tune them once you see real sensor ranges
# from Waad, and document any change as part of the AI contract.
WEIGHTS = {
    "light_stability":  {"Focused You": 1.2, "Consistent You": 1.0, "Creative You": 0.5, "Burned-Out You": 0.0, "Active You": -0.5},
    "noise_stability":  {"Focused You": 1.0, "Consistent You": 0.8, "Creative You": 0.0, "Burned-Out You": 0.5, "Active You": -0.8},
    "quiet_score":      {"Focused You": 1.0, "Consistent You": 0.5, "Creative You": 0.5, "Burned-Out You": 0.5, "Active You": -0.5},
    "activity_score":   {"Focused You": -1.0, "Consistent You": 0.0, "Creative You": 0.5, "Burned-Out You": -0.5, "Active You": 4.0},
    "motion_rate":       {"Focused You": -0.5, "Consistent You": 0.0, "Creative You": 0.5, "Burned-Out You": -0.5, "Active You": 3.0},
    # Level-based signals below react to the actual sensor value, not just
    # its variance — without these, a constant-max reading and a
    # constant-min reading looked identical (both fully "stable").
    "avg_noise":        {"Focused You": -0.03, "Consistent You": -0.01, "Creative You": 0.01, "Burned-Out You": 0.01, "Active You": 0.03},
    "avg_light":        {"Focused You": 0.01, "Consistent You": 0.01, "Creative You": 0.01, "Burned-Out You": -0.03, "Active You": 0.01},
    "avg_temperature":  {"Focused You": -0.01, "Consistent You": 0.0, "Creative You": 0.0, "Burned-Out You": 0.02, "Active You": 0.0},
}


def score_features(feature_vector: dict) -> list[dict]:
    """feature_vector is the `features` dict from extract_features()."""
    raw_scores = {state: 0.0 for state in FUTURE_STATES}

    for feature_name, per_state_weights in WEIGHTS.items():
        value = feature_vector.get(feature_name, 0.0)
        for state, weight in per_state_weights.items():
            raw_scores[state] += value * weight

    # Shift so the lowest raw score is >= a small positive floor,
    # so normalization never divides by ~0 or produces negatives.
    floor = min(raw_scores.values())
    shifted = {state: (v - floor) + 0.1 for state, v in raw_scores.items()}
    total = sum(shifted.values())

    distribution = [
        {"future_state": state, "score": round((v / total) * 100, 1)}
        for state, v in shifted.items()
    ]

    # Fix any rounding drift so it sums to exactly 100.0
    drift = round(100.0 - sum(d["score"] for d in distribution), 1)
    distribution[0]["score"] = round(distribution[0]["score"] + drift, 1)

    return sorted(distribution, key=lambda d: -d["score"])


if __name__ == "__main__":
    from data.synthetic import generate_window
    from features.extract import extract_features

    window = generate_window(minutes=15, profile="active")
    fv = extract_features(window)
    print(score_features(fv["features"]))
