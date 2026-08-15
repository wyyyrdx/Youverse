from fastapi import APIRouter, HTTPException, status
from app.schemas.sensor import SensorData
from app.database.supabase_client import SupabaseClient
from datetime import datetime

router = APIRouter()
db = SupabaseClient.get_instance()

@router.post("/sensors/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_sensor_data(data: SensorData):
    payload = {
        "device_id": data.device_id,
        "light": data.light,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "motion": data.motion,
        "noise": data.noise,
       "timestamp": data.timestamp.isoformat() if data.timestamp else datetime.utcnow().isoformat(),
        "is_simulated": False  # default; can be set from header later
    }

    try:
        result = db.insert_sensor_reading(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "status": "success",
        "message": "Sensor data received",
        "data": result
    }

@router.get("/sensors/latest")
async def get_latest_reading(device_id: str = None):
    # Dummy response until DB is connected
    return {
        "status": "success",
        "data": {
            "device_id": device_id or "esp32-sim-001",
            "light": 64.2,
            "temperature": 25.1,
            "humidity": 49.8,
            "motion": 0,
            "noise": 31.5,
            "timestamp": "2026-08-14T17:00:00Z"
        }
    }