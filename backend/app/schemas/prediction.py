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
    """Return latest predictions for a user (score 0-100 for frontend readability)."""
    client = SupabaseClient.get_instance().client
    if client is None:
        raise HTTPException(status_code=500, detail="Database not configured")

    response = client.table("predictions") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(5) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="No predictions found")

    # Convert DB probability (0-1) to score (0-100)
    states = []
    for row in response.data:
        states.append({
            "state_name": row["state_name"],
            "score": round(row["probability"] * 100, 2),
            "color": row.get("color")
        })

    return {
        "user_id": user_id,
        "timestamp": response.data[0]["created_at"],
        "states": states,
        "total_score": sum(s["score"] for s in states)
    }

@router.post("/what-if")
async def run_what_if(request: WhatIfRequest):
    """Run what-if simulation with a single changed feature."""
    result = simulate_what_if(request.user_id, request.changed_feature, request.new_value)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result