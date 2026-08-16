# Hardware — YOUVERSE

## Overview
ESP32-based sensor node collecting environmental/behavioral signals
(light, temperature, humidity, motion, noise) as proxies for behavioral
patterns. Currently simulated via Wokwi; physical assembly planned
post-hackathon once components are sourced.

## Folder Structure
- `bom/` — Bill of Materials (component list)
- `kicad/` — KiCad schematic project files
- `schematics/` — Exported schematic (PDF)
- `simulation/wokwi/` — Wokwi simulation files (diagram.json, wokwi.toml)
- `wiring/` — Pin connection reference
- `pcb/` — PCB layout (in progress)

## Status
✅ Schematic complete (ESP32-WROOM-32, DHT11, LDR, PIR, voltage regulation)
✅ Sensor Data Contract agreed with Backend
⏳ PCB layout - in progress
⏳ Physical enclosure design - in progress (Tinkercad)

## Sensors
| Sensor | Signal | Pin |
|---|---|---|
| DHT11/22 | Temperature + Humidity | GPIO4 |
| LDR (Photoresistor) | Light | GPIO34 |
| PIR | Motion | GPIO27 |
| Noise | Simulated in firmware | GPIO35 |

See `bom/BOM.md` for full component list and `wiring/connections.md` for connection details.