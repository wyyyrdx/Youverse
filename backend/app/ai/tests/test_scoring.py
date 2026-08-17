"""
Validation test suite for the AI/ML module.

Run with: python3 -m tests.test_scoring   (from inside ai/)

Covers the "validation strategy" promised in the AI Contract:
- scores always sum to exactly 100 across all tested profiles
- no crashes on edge-case input (zero motion, max values, single-sample windows)
- what-if produces a visibly different result when a feature changes
"""

import sys
from datetime import datetime, timedelta, timezone

from ..data.synthetic import generate_window, generate_reading
from ..features.extract import extract_features
from ..scoring.score import score_features, FUTURE_STATES
from ..what_if.whatif import apply_what_if, apply_what_if_multi

FAILURES = []


def check(condition: bool, description: str):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {description}")
    if not condition:
        FAILURES.append(description)


def run_all():
    # 1. Sums to 100 across all synthetic profiles
    for profile in ["focused", "active", "burned_out", "creative", "idle"]:
        window = generate_window(minutes=5, profile=profile)
        fv = extract_features(window)["features"]
        dist = score_features(fv)
        total = round(sum(d["score"] for d in dist), 1)
        check(total == 100.0, f"'{profile}' profile distribution sums to 100 (got {total})")
        check(len(dist) == len(FUTURE_STATES), f"'{profile}' profile returns all {len(FUTURE_STATES)} states")

    # 2. Edge cases don't crash and still sum to 100
    base = datetime.now(timezone.utc)

    def flat_window(light, temp, hum, motion, noise, n=30):
        return [
            {
                "device_id": "test", "timestamp": (base + timedelta(seconds=5 * i)).isoformat().replace("+00:00", "Z"),
                "light": light, "temperature": temp, "humidity": hum, "motion": motion, "noise": noise,
            }
            for i in range(n)
        ]

    edge_cases = {
        "all-zero motion": flat_window(50, 22, 45, 0, 20),
        "constant motion=1": flat_window(50, 22, 45, 1, 20),
        "max noise+light": flat_window(100, 22, 45, 0, 100),
        "min everything": flat_window(0, 10, 10, 0, 0),
        "single reading": flat_window(50, 22, 45, 1, 20, n=1),
    }
    for name, readings in edge_cases.items():
        try:
            fv = extract_features(readings)["features"]
            dist = score_features(fv)
            total = round(sum(d["score"] for d in dist), 1)
            check(total == 100.0, f"edge case '{name}' sums to 100 without crashing (got {total})")
        except Exception as e:
            check(False, f"edge case '{name}' raised an exception: {e}")

    # 3. What-if visibly changes the distribution
    window = generate_window(minutes=5, profile="focused")
    fv = extract_features(window)["features"]
    baseline = score_features(fv)
    result = apply_what_if(fv, "activity_score", 0.95)
    changed = result["new_distribution"]
    baseline_top = baseline[0]["future_state"]
    changed_top = changed[0]["future_state"]
    check(baseline != changed, "what-if produces a different distribution than baseline")
    check(changed_top == "Active You" or changed_top != baseline_top,
          f"pushing activity_score high enough shifts or elevates the leading state (baseline={baseline_top}, changed={changed_top})")

    # 4. Multi-feature what-if works and still sums to 100
    multi_result = apply_what_if_multi(fv, [
        {"changed_feature": "activity_score", "new_value": 0.9},
        {"changed_feature": "quiet_score", "new_value": 0.1},
    ])
    multi_total = round(sum(d["score"] for d in multi_result["new_distribution"]), 1)
    check(multi_total == 100.0, f"multi-feature what-if still sums to 100 (got {multi_total})")

    # 5. Unknown feature name raises a clear error, doesn't silently fail
    try:
        apply_what_if(fv, "not_a_real_feature", 1.0)
        check(False, "apply_what_if raises ValueError on unknown feature name")
    except ValueError:
        check(True, "apply_what_if raises ValueError on unknown feature name")

    print()
    if FAILURES:
        print(f"{len(FAILURES)} check(s) failed:")
        for f in FAILURES:
            print(f" - {f}")
        sys.exit(1)
    else:
        print("All checks passed.")


if __name__ == "__main__":
    run_all()
