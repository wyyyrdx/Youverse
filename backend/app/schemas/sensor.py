"""
Sensor data schema for Youverse / Superposition You backend.

This module defines the Pydantic models used to validate incoming
payloads from the ESP32 hardware or Wokwi simulation. The constraints
and field descriptions follow the Day 01 Sensor Data Contract exactly.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class SensorData(BaseModel):
    """
    Model representing a single sensor reading from the ESP32.
    All numerical ranges are based on the agreed hardware contract.
    """

    # Unique identifier for the ESP32 device (e.g., "esp32-sim-001").
    device_id: str = Field(
        ...,
        min_length=1,
        description="ESP32 device ID (e.g., 'esp32-sim-001')",
        examples=["esp32-sim-001"],
    )

    # Ambient light level, proxy for environment brightness.
    # LDR photoresistor output: 0.0 (dark) to 100.0 (bright).
    light: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Ambient light level (0.0 – 100.0)",
        examples=[64.2],
    )

    # Ambient temperature in degrees Celsius.
    # DHT22 sensor range: 10.0°C to 45.0°C.
    temperature: float = Field(
        ...,
        ge=10.0,
        le=45.0,
        description="Ambient temperature in °C (10.0 – 45.0)",
        examples=[25.1],
    )

    # Relative humidity percentage.
    # DHT22 sensor range: 10.0% to 95.0%.
    humidity: float = Field(
        ...,
        ge=10.0,
        le=95.0,
        description="Relative humidity % (10.0 – 95.0)",
        examples=[49.8],
    )

    # Ambient noise level (simulated for now).
    # Range: 0.0 (silent) to 100.0 (very loud).
    noise: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Ambient noise level (0.0 – 100.0)",
        examples=[31.5],
    )

    # Motion detection flag.
    # Contract states it as int (0 or 1). However, hardware or frontend
    # may accidentally send a boolean (true/false). The validator below
    # converts booleans to integers so the database never breaks.
    motion: int = Field(
        ...,
        ge=0,
        le=1,
        description="Motion detected in the last sampling window (0/1)",
        examples=[0],
    )

    # Optional ISO 8601 timestamp string (e.g., "2026-08-14T17:00:00Z").
    # If not provided, the backend can use the current time.
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO 8601 UTC timestamp string (optional)",
        examples=["2026-08-14T17:00:00Z"],
    )

    @field_validator("motion", mode="before")
    @classmethod
    def convert_bool_to_int(cls, v):
        """
        Convert incoming boolean motion values to integer.

        This ensures that if the hardware or frontend sends
        {"motion": true} instead of {"motion": 1},
        the payload is still accepted and stored correctly.
        """
        if isinstance(v, bool):
            return 1 if v else 0
        # If it's already an int or a string that can be converted, do so.
        return int(v)

    # Optional: validate timestamp format if needed
    @field_validator("timestamp")
    @classmethod
    def validate_timestamp(cls, v):
        if v is not None:
            # Simple check: try to parse as ISO 8601
            try:
                datetime.fromisoformat(v.replace("Z", "+00:00"))
            except ValueError:
                raise ValueError("timestamp must be a valid ISO 8601 string")
        return v


# ---------------------------------------------------------------------
# Additional helper model for sensor response (used in API responses)
# ---------------------------------------------------------------------
class SensorResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None