"""
Sensor API routes for Youverse / Superposition You.
Handles ingestion of sensor data from ESP32 and retrieval of readings.
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.sensor import SensorData
from app.database.supabase_client import SupabaseClient
from datetime import datetime, timezone

router = APIRouter()
db = SupabaseClient.get_instance()

@router.post("/sensors/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_sensor_data(data: SensorData):
    """
    Receive sensor data from ESP32 / Wokwi and store in Supabase.
    """
    # Build payload for database insertion
    payload = {
        "device_id": data.device_id,
        "light": data.light,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "motion": data.motion,   # Already validated and converted to int by Pydantic
        "noise": data.noise,
        # timestamp is now a string; use directly or fallback to current UTC
        "timestamp": data.timestamp or datetime.now(timezone.utc).isoformat(),
        "is_simulated": False    # default for real hardware; can be changed later
    }

    try:
        result = db.insert_sensor_reading(payload)
        # If the insert function returned an error dict, raise HTTP 500
        if result.get("error"):
            raise HTTPException(
                status_code=500,
                detail=f"Database insert failed: {result['error']}"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "status": "success",
        "message": "Sensor data received",
        "data": result
    }

@router.get("/sensors/latest")
async def get_latest_reading(device_id: str = None):
    """
    Fetch the most recent sensor reading from Supabase.
    Optional filter: device_id
    """
    client = db.client
    if client is None:
        return {
            "status": "error",
            "message": "Database not configured",
            "data": None
        }

    try:
        query = client.table("sensor_readings") \
            .select("*") \
            .order("timestamp", desc=True) \
            .limit(1)

        if device_id:
            query = query.eq("device_id", device_id)

        response = query.execute()

        if response.data:
            return {
                "status": "success",
                "data": response.data[0],
                "message": "Latest sensor reading retrieved"
            }
        else:
            return {
                "status": "success",
                "data": None,
                "message": "No sensor data found"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")
