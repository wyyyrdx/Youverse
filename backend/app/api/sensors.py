from fastapi import APIRouter, HTTPException, status
from app.schemas.sensor import SensorData
from app.database.supabase_client import SupabaseClient
from datetime import datetime

router = APIRouter()
# Get singleton database client
db = SupabaseClient.get_instance()

# Endpoint to receive sensor data from ESP32
@router.post("/sensors/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_sensor_data(data: SensorData):
    # Build the payload to be stored in database
    payload = {
        "device_id": data.device_id,
        "light": data.light,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "motion": data.motion,
        "noise": data.noise,
        "timestamp": data.timestamp.isoformat() if data.timestamp else datetime.utcnow().isoformat()
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

# Optional: GET latest reading (dummy for now, will be replaced with DB query)
@router.get("/sensors/latest")
async def get_latest_reading(device_id: str = None):
    # Placeholder response until DB is connected
    return {
        "status": "success",
        "data": {
            "device_id": device_id or "esp32_dummy_001",
            "light": 450.5,
            "temperature": 26.3,
            "humidity": 55.0,
            "motion": True,
            "noise": 42.7,
            "timestamp": "2025-03-15T10:30:00Z"
        }
    }