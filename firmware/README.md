# Firmware -  Youverse

ESP32 firmware that collects environmental/behavioral signals and outputs them in the agreed Sensor Data Contract format.

## Sensors Used

| Sensor | Pin | Value Range | Description |
|---------------------|------|-----------------|---------------------------------|
| DHT22 | 4 | Temp (°C), Humidity (%) | Temperature & Humidity |
| LDR (Photoresistor) | 34 | 0 – 100 | Ambient light level |
| PIR Motion Sensor | 27 | 0 or 1 | Motion detected |
| Potentiometer | 35 | 0 – 100 | Simulated noise level |

## JSON Output Format

The firmware prints a JSON object every 5 seconds:

```json
{
"device_id": "esp32-sim-001",
"timestamp": "2026-08-14T23:00:00Z",
"light": 68.0,
"temperature": 25.3,
"humidity": 47.5,
"motion": 1,
"noise": 32.0
}
```

## Current Status

- Running successfully on Wokwi simulator
- JSON output matches the Backend Sensor Data Contract
- Values are realistic and changing over time
- WiFi + HTTP POST will be added once Backend provides a public endpoint

## Files

- `youverse.ino` → Main firmware code
- `diagram.json` → Circuit diagram from the simulator

## Notes

- Currently in simulation mode (no real hardware yet)
- DHT library is required (DHT sensor library + Adafruit Unified Sensor)
- Timestamp is still static (will be improved next)