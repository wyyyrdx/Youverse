from fastapi import APIRouter, HTTPException, status
from app.schemas.sensor import SensorData
from app.database.supabase_client import SupabaseClient
from datetime import datetime

router = APIRouter()
db = SupabaseClient.get_instance()

@router.post("/sensors/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_sensor_data(data: SensorData):
    # Prepare payload for database insertion
    payload = {
        "device_id": data.device_id,
        "light": data.light,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "motion": data.motion,
        "noise": data.noise,
        "timestamp": data.timestamp.isoformat() if data.timestamp else datetime.utcnow().isoformat(),
        "is_simulated": False   # default; can be set from headers later
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
    """
    Fetch the most recent sensor reading from Supabase.
    Optional filter: device_id
    """
    client = db.client   # Access the Supabase client instance
    if client is None:
        # Fallback for no-DB mode (when credentials missing)
        return {
            "status": "error",
            "message": "Database not configured",
            "data": None
        }

    try:
        # Build query: select all, order by timestamp desc, limit 1
        query = client.table("sensor_readings") \
            .select("*") \
            .order("timestamp", desc=True) \
            .limit(1)

        # Apply device filter if provided
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