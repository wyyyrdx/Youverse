# Firmware - Youverse

## Overview
ESP32 firmware that reads sensor data, displays it live on an OLED screen, 
formats it per the agreed Sensor Data Contract, and sends it to the 
backend via WiFi/HTTPS.

## Status
✅ Sensor reading logic (DHT, LDR, PIR, Potentiometer for noise)
✅ Dynamic ISO 8601 timestamp via NTP
✅ WiFi connection + HTTPS POST with retry logic
✅ OLED display showing live readings + send status
✅ Compiles successfully via arduino-cli (esp32:esp32 core)
✅ Verified end-to-end: live simulation → backend → Supabase confirmed
✅ Backend motion type bug fixed and re-verified

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
- Adafruit SSD1306
- Adafruit GFX Library

## Sampling
Every 5 seconds, per Sensor Data Contract.

## Notes
- Noise value comes from a physical potentiometer (GPIO35), not random 
  simulation — this allows manual control during demos/testing.
- OLED display (I2C, GPIO21/22) shows live sensor readings and real-time 
  send status (Sending... / Sent OK) for local monitoring only, does 
  not affect the data sent to the backend.
