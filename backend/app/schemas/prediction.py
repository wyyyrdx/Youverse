"""
Prediction schemas for Youverse / Superposition You.

These models define the structure for future-state predictions
and what-if simulation requests/responses. The probability values
are stored as floats between 0.0 and 1.0 (decimal scale), as agreed
with the AI/ML engineer (Binary G7).
"""

from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field


class FutureStateScore(BaseModel):
    """
    A single predicted future state with its probability.
    probability is a float between 0.0 and 1.0 (e.g., 0.354).
    """
    state_name: str = Field(..., description="Name of the future state (e.g., 'Focused You')")
    probability: float = Field(..., ge=0.0, le=1.0, description="Probability between 0 and 1")
    color: Optional[str] = Field(default=None, description="Hex color for UI representation")


class PredictionResult(BaseModel):
    """
    Complete prediction output containing a list of states.
    The sum of all probabilities should be exactly 1.0.
    """
    user_id: Optional[str] = Field(default="default_user", description="User identifier")
    timestamp: Optional[str] = Field(default=None, description="Timestamp of prediction")
    states: List[FutureStateScore] = Field(..., description="List of predicted future states")
    total_probability: float = Field(..., description="Sum of probabilities (should be 1.0)")


class WhatIfRequest(BaseModel):
    """
    Request body for the what-if simulation endpoint.
    The frontend sends a scenario type and optional parameters
    that modify the current behavioral features.
    """
    scenario_type: str = Field(..., description="Type of hypothetical change (e.g., 'early_study')")
    parameters: Optional[Dict[str, Any]] = Field(default=None, description="Additional scenario parameters")


class WhatIfResponse(BaseModel):
    """
    Response for what-if simulation, containing the new distribution.
    """
    scenario: Dict[str, Any] = Field(..., description="Echo of the scenario details")
    new_states: List[FutureStateScore] = Field(..., description="New distribution after hypothetical change")
    total_probability: float = Field(..., description="Sum of new probabilities (should be 1.0)")
    comparison: Optional[Dict[str, float]] = Field(default=None, description="Optional comparison with original probabilities")