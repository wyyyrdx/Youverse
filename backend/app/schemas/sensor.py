from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# This class defines the structure of sensor data sent by ESP32
class SensorData(BaseModel):
    device_id: str = Field(..., min_length=1, description="ESP32 device ID")
    light: float = Field(..., ge=0, description="Light intensity in lux")
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity %")
    motion: bool = Field(..., description="Motion detected")
    noise: float = Field(..., ge=0, description="Noise level in dB")
    timestamp: Optional[datetime] = Field(default=None, description="ISO 8601 UTC timestamp")

    # Example payload for Swagger UI
    class Config:
        json_schema_extra = {
            "example": {
                "device_id": "esp32_001",
                "light": 450.5,
                "temperature": 26.3,
                "humidity": 55.0,
                "motion": True,
                "noise": 42.7,
                "timestamp": "2025-03-15T10:30:00Z"
            }
        }