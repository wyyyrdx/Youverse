import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional, Dict, Any

# Load environment variables from .env file
load_dotenv()

class SupabaseClient:
    _instance: Optional["SupabaseClient"] = None

    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self.client: Optional[Client] = None

        # Only connect if credentials are present, otherwise log a warning and stay in no-DB mode
        if self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
                print("Supabase connected successfully")
            except Exception as e:
                print(f"WARNING: Supabase connection failed: {e}")
                self.client = None
        else:
            print("WARNING: SUPABASE_URL/KEY not set. Running in no-DB mode.")

    @classmethod
    def get_instance(cls):
        # Singleton pattern to reuse the same client everywhere
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def insert_sensor_reading(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Insert a reading into sensor_readings table
        if self.client is None:
            print("DB not configured; skipping insert")
            return {"id": None, "warning": "database not configured"}

        try:
            response = self.client.table("sensor_readings").insert(payload).execute()
            return response.data[0] if response.data else {}
        except Exception as e:
            print(f"Database insert error: {e}")
            return {"id": None, "error": str(e)}