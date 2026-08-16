"""
Pipeline service that orchestrates raw sensor data to predictions using AI/ML.
"""

from app.database.supabase_client import SupabaseClient
from app.ai.service import process_window, process_what_if

db = SupabaseClient.get_instance()

def calculate_predictions(user_id: str, lookback_minutes: int = 30):
    """Fetch raw sensor readings, run AI feature extraction and prediction, store results."""
    client = db.client
    if client is None:
        return {"error": "Database not configured"}

    # Fetch recent sensor readings (last 50 rows for MVP)
    response = client.table("sensor_readings") \
        .select("*") \
        .order("timestamp", desc=True) \
        .limit(50) \
        .execute()

    if not response.data:
        return {"error": "No sensor data available"}

    # AI expects chronological order (oldest first)
    readings = list(reversed(response.data))

    # Call AI process_window
    result = process_window(readings, user_id)

    # Store behavioral_features row
    features_row = result["behavioral_features_record"]
    if features_row:
        client.table("behavioral_features").insert(features_row).execute()

    # Store predictions rows
    predictions_rows = result["predictions_records"]
    if predictions_rows:
        client.table("predictions").insert(predictions_rows).execute()

    # Return API response
    return result["api_response"]

def simulate_what_if(user_id: str, changed_feature: str, new_value: float):
    """Load stored features, run AI what-if simulation, store result."""
    client = db.client
    if client is None:
        return {"error": "Database not configured"}

    # Fetch latest behavioral_features for this user
    response = client.table("behavioral_features") \
        .select("features") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not response.data:
        return {"error": "No stored features found for user"}

    stored_features = response.data[0].get("features", {})

    # Call AI process_what_if
    result = process_what_if(stored_features, changed_feature, new_value, user_id)

    # Store what_if_scenarios row
    scenario_row = result["what_if_scenarios_record"]
    if scenario_row:
        client.table("what_if_scenarios").insert(scenario_row).execute()

    # Return API response
    return result["api_response"]