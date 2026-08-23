"""
Prediction and What-If API endpoints for Youverse backend.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from app.services.feature_pipeline import calculate_predictions, simulate_what_if
from app.database.supabase_client import SupabaseClient

router = APIRouter()

class CalculateRequest(BaseModel):
    user_id: str = Field(..., example="default_user")
    lookback_minutes: Optional[int] = Field(default=30, ge=1, le=1440)

class WhatIfRequest(BaseModel):
    user_id: str = Field(..., example="default_user")
    changed_feature: str = Field(..., example="motion_rate")
    new_value: float = Field(..., example=0.8)

@router.post("/predictions/calculate")
async def trigger_prediction_calculation(request: CalculateRequest):
    """Trigger feature extraction and prediction from recent sensor data."""
    result = calculate_predictions(request.user_id, request.lookback_minutes)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/predictions/{user_id}")
async def get_latest_predictions(user_id: str):
    """
    Return latest predictions for a user in the agreed contract shape:
    {
      "status": "success",
      "data": [ {"future_state": str, "score": float}, ... ],
      "is_simulated": bool
    }
    """
    client = SupabaseClient.get_instance().client
    if client is None:
        raise HTTPException(status_code=500, detail="Database not configured")

    # Fetch latest 5 prediction rows (one for each future state)
    response = client.table("predictions") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(5) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="No predictions found")

    # Convert DB rows (probability 0-1, state_name) to contract format:
    # { future_state, score (0-100) }
    distribution = []
    for row in response.data:
        distribution.append({
            "future_state": row["state_name"],
            "score": round(row["probability"] * 100, 2)
        })

    # Determine is_simulated flag from the latest prediction row
    is_simulated = response.data[0].get("is_simulated", False)

    return {
        "status": "success",
        "data": distribution,
        "is_simulated": is_simulated
    }

@router.post("/what-if")
async def run_what_if(request: WhatIfRequest):
    """Run what-if simulation with a single changed feature."""
    result = simulate_what_if(request.user_id, request.changed_feature, request.new_value)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result