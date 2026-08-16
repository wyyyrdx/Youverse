# Firmware - YOUVERSE

## Overview
ESP32 firmware that reads sensor data, formats it per the agreed Sensor
Data Contract, and sends it to the backend via WiFi/HTTP.

## Status
✅ Sensor reading logic (DHT, LDR, PIR, simulated noise)
✅ Dynamic ISO 8601 timestamp via NTP
✅ WiFi connection + HTTP POST with retry logic
✅ Compiles successfully via arduino-cli (esp32:esp32 core)
✅ Manually verified backend ingestion via Swagger (201 success)
⏳ Live Serial verification pending - network/WebSocket connectivity
issue on current setup, being retested on a different network

## JSON Payload Format
\`\`\`json
{
"device_id": "esp32-sim-001",
"timestamp": "2026-08-16T12:00:00Z",
"light": 77.7,
"temperature": 25.0,
"humidity": 50.0,
"motion": 1,
"noise": 30.0
}
\`\`\`

## Backend Endpoint
POST https://youverse-stag-3.up.railway.app/api/sensors/ingest

## Required Libraries
Install via arduino-cli or Arduino IDE Library Manager:
- DHT sensor library (Adafruit)
- Adafruit Unified Sensor
- ArduinoJson

## Sampling
Every 5 seconds, per Sensor Data Contract.