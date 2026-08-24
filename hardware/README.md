# Hardware - Youverse

## Overview

An ESP32-based sensor node collects environmental/behavioral signals (light, temperature, humidity, motion, noise) as proxies for behavioral patterns, displays them live on an onboard OLED screen, and streams them to the backend over WiFi/HTTPS every 5 seconds. Currently simulated via Wokwi; physical assembly is planned post-hackathon once components are sourced.

## Folder Structure

- `bom/` — Bill of Materials
- `kicad/` — KiCad schematic + PCB project files
- `schematics/` — Exported schematic (PDF)
- `pcb/` — PCB layout, DRC report, renders
- `simulation/wokwi/` — Wokwi simulation files (diagram.json, wokwi.toml)
- `wiring/` — Pin connection reference

## Components & Pin Mapping

| Component | Signal | ESP32 GPIO (Physical Pin) |
|---|---|---|
| DHT11/22 | Temperature + Humidity | GPIO4 (Pin 26) |
| LDR (Photoresistor) | Light (voltage divider) | GPIO34 (Pin 6) |
| PIR Motion Sensor | Motion | GPIO27 (Pin 12) |
| Potentiometer (10kΩ) | Noise (manual input) | GPIO35 (Pin 7) |
| SSD1306 OLED (I2C) | Local display | GPIO21 SDA (Pin 33), GPIO22 SCL (Pin 36) |

Full connection details in `wiring/connections.md`. Full component list with quantities in `bom/BOM.md`.

## Design Process

1. **Schematic** (KiCad Eeschema) — all components placed and wired according to the pin mapping above. ESP32-WROOM-32 powered via AP2112K-3.3 LDO regulator from USB Micro-B, with decoupling capacitors and an EN pull-up resistor per standard ESP32 reference design.
2. **ERC (Electrical Rules Check)** — passed clean. Remaining notices are expected unused pins (SPI-flash internal pins, USB data lines not used since only power is drawn from USB) — documented, not functional issues.
3. **PCB Layout** — footprints assigned to every symbol, components placed in logical zones (Power / MCU / Sensors / Display) around the ESP32, all antenna keep-out zone requirements respected (no traces or components placed over the ESP32's onboard antenna area).
4. **DRC (Design Rules Check)** — passed with 0 real violations after fixing drill-size and zone-fill issues. Power distribution uses filled copper zones for +3V3 and GND to simplify routing and improve reliability. Remaining notices (USB shield pin, zone self-reference) documented as known non-issues.

## Status

✅ Schematic complete and ERC-clean
✅ PCB routed and DRC-clean
✅ Sensor Data Contract agreed with Backend team
✅ Full end-to-end pipeline verified live (sensors → OLED → WiFi → backend → database)
✅ Real sensor data collected from a live device session and used for AI model calibration
⏳ Physical enclosure design - in progress (Tinkercad concept, cosmic/orb-shaped device)
⏳ Physical assembly - planned post-hackathon once components are sourced

## Known Non-Issues (Documented)

- **USB Shield pin (J1)** - intentionally unconnected; no functional impact.
- **+3V3 zone self-reference warnings** - persist even after zone deletion/recreation; a known KiCad zone-fill quirk. Every +3V3 pad has been individually verified as correctly connected to the zone.

## Physical Enclosure (In Progress)

The device's outer shell is designed to match the project's visual identity a "miniature quantum planet / superposition orb" concept (cosmic, pixel-art inspired), modeled in Tinkercad. Full physical assembly is planned post-hackathon.
