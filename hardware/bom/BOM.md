# Bill of Materials (BOM) 

| # | Component | Qty | Notes |
|---|-----------|-----|-------|
| 1 | ESP32 DevKit V1 | 1 | Main microcontroller |
| 2 | DHT22 (or DHT11) | 1 | Temperature + Humidity sensor |
| 3 | LDR (Photoresistor) | 1 | Light sensor |
| 4 | PIR Motion Sensor (HC-SR501) | 1 | Motion detection |
| 5 | Resistor 10kΩ | 2 | 1x LDR voltage divider, 1x DHT pull-up |
| 6 | Breadboard (half-size) | 1 | Prototyping |
| 7 | Jumper Wires (Male-Male) | ~25 | Connections |
| 8 | Micro-USB Cable | 1 | Power + programming |
| 9 | Potentiometer (10kΩ) | 1 | Manual noise-level input (replaces random simulation) |

## Notes
- Noise sensor: simulated in firmware, no physical component required for MVP.
- All values verified against the Sensor Data Contract (Day 1 doc).
- Current stage: simulated on Wokwi. Physical assembly planned post-hackathon
once components are sourced.