"""
Integration layer for the backend.

Rana imports these two functions directly from FastAPI route handlers.
Each function takes raw inputs (sensor readings, or an existing feature
vector) and returns everything needed to both respond to the API call
AND insert the right row into the right table — so the backend doesn't
need to know anything about how features/scoring/what-if work internally.

Matches what was agreed in the AI Contract + API Contract:
- behavioral_features.features is a JSONB column -> features dict goes in as-is
- predictions.probability is 0-100 (a percentage) -> score values go in as-is, no conversion
- what_if_scenarios.parameters / .result are JSONB -> dicts go in as-is
"""

from features.extract import extract_features
from scoring.score import score_features
from what_if.whatif import apply_what_if


def process_window(readings: list[dict], user_id: str) -> dict:
    """
    Call this once you have a window of raw sensor_readings rows for a user.

    Returns:
      behavioral_features_record - insert directly into behavioral_features
                                    (features is already JSONB-ready)
      predictions_records        - insert directly into predictions, one row per state
      api_response                - exactly what GET /api/predictions/{user_id} should return
    """
    extracted = extract_features(readings, user_id=user_id)
    features = extracted["features"]
    window = extracted["window"]
    distribution = score_features(features)

    return {
        "behavioral_features_record": {
            "user_id": user_id,
            "window_start": window["start"],
            "window_end": window["end"],
            "features": features,  # JSONB column, store as-is
        },
        "predictions_records": [
            {"user_id": user_id, "state_name": p["future_state"], "probability": p["score"]}
            for p in distribution
        ],
        "api_response": {
            "status": "success",
            "data": distribution,
        },
    }


def process_what_if(stored_features: dict, changed_feature: str, new_value: float, user_id: str) -> dict:
    """
    Call this for POST /api/what-if.

    stored_features: the `features` dict already sitting in behavioral_features
                      for this user (i.e. what you'd fetch from the JSONB column).

    Returns:
      what_if_scenarios_record - insert directly into what_if_scenarios
      api_response              - exactly what POST /api/what-if should return
    """
    result = apply_what_if(stored_features, changed_feature, new_value)

    return {
        "what_if_scenarios_record": {
            "user_id": user_id,
            "scenario_type": "feature_override",
            "parameters": {"changed_feature": changed_feature, "new_value": new_value},
            "result": result["new_distribution"],
        },
        "api_response": {
            "status": "success",
            "data": result["new_distribution"],
        },
    }


if __name__ == "__main__":
    from data.synthetic import generate_window

    window = generate_window(minutes=5, profile="active")
    result = process_window(window, user_id="demo-user")
    print("behavioral_features row:", result["behavioral_features_record"])
    print("predictions rows:", result["predictions_records"])
    print("API response:", result["api_response"])

    wi = process_what_if(
        result["behavioral_features_record"]["features"],
        changed_feature="activity_score",
        new_value=0.9,
        user_id="demo-user",
    )
    print("what-if API response:", wi["api_response"])
