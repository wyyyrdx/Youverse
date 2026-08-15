from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SensorData(BaseModel):
    device_id: str = Field(..., min_length=1, description="ESP32 device ID")
    light: float = Field(..., ge=0, le=100, description="Light intensity (0-100)")
    temperature: float = Field(..., ge=10, le=45, description="Temperature in Celsius")
    humidity: float = Field(..., ge=10, le=95, description="Relative humidity %")
    motion: int = Field(..., ge=0, le=1, description="Motion detected (0/1)")
    noise: float = Field(..., ge=0, le=100, description="Noise level (0-100)")
    timestamp: Optional[datetime] = Field(default=None, description="ISO 8601 UTC timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "device_id": "esp32-sim-001",
                "timestamp": "2026-08-14T17:00:00Z",
                "light": 64.2,
                "temperature": 25.1,
                "humidity": 49.8,
                "motion": 0,
                "noise": 31.5
            }
        }