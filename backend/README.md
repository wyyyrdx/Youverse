# Youverse Backend

FastAPI backend for Superposition You project.

## Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
Install dependencies:

bash
pip install -r requirements.txt
Create .env file from .env.example and fill Supabase credentials.

Run the server:

bash
uvicorn app.main:app --reload --port 8000
API docs available at: http://localhost:8000/docs

Endpoints
POST /api/sensors/ingest
Description: Receive sensor data from ESP32.

Request body:

json
{
  "device_id": "esp32-sim-001",
  "light": 64.2,
  "temperature": 25.1,
  "humidity": 49.8,
  "motion": 0,
  "noise": 31.5,
  "timestamp": "2026-08-14T17:00:00Z"
}
Response: 201 Created with stored record.

GET /api/sensors/latest?device_id=esp32-sim-001
Description: Fetch the latest sensor reading for a device (optional filter).

Response: 200 OK with latest record.

GET /api/health
Description: Health check.

Database Schema
Located in app/database/schema.sql. Tables: users, devices, sensor_readings, behavioral_features, predictions, what_if_scenarios, future_states.