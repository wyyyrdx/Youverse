# Hardware - Youverse

## Overview
ESP32-based sensor node collecting environmental/behavioral signals 
(light, temperature, humidity, motion, noise) as proxies for behavioral 
patterns, displayed locally on an OLED screen and streamed to the backend 
in real time. Currently simulated via Wokwi/Velxio; physical assembly 
planned post-hackathon once components are sourced.

## Folder Structure
- `bom/` - Bill of Materials
- `kicad/` - KiCad schematic + PCB project files
- `schematics/` - Exported schematic (PDF)
- `simulation/wokwi/` - Wokwi simulation files (diagram.json, wokwi.toml)
- `wiring/` - Pin connection reference
- `pcb/` - PCB layout

## Status
✅ Schematic complete and ERC-clean (ESP32-WROOM-32, DHT11/22, LDR, PIR, 
   Potentiometer, OLED, voltage regulation)
✅ Sensor Data Contract agreed with Backend
✅ Full end-to-end pipeline verified live (sensors → OLED → WiFi → 
   backend → Supabase)
✅ Real sensor data collected and used for AI model calibration
⏳ PCB layout - in progress
✅ Physical enclosure design 

## Components & Pin Mapping
| Component | Signal | ESP32 Pin |
|---|---|---|
| DHT11/22 | Temperature + Humidity | GPIO4 |
| LDR (Photoresistor) | Light | GPIO34 |
| PIR Motion Sensor | Motion | GPIO27 |
| Potentiometer | Noise (manual input) | GPIO35 |
| SSD1306 OLED (I2C) | Display | GPIO21 (SDA), GPIO22 (SCL) |

See `bom/BOM.md` for the full component list and `wiring/` for detailed 
connection notes.