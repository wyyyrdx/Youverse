# SUPERPOSITION YOU

> "You are here. Your habits shape the possibilities. Your future isn't one state — it's a superposition of possibilities."

A quantum-inspired behavioral modeling system. A physical ESP32 device collects environmental/behavioral signals, transforms them into features, and a lightweight AI model generates modeled likelihoods for several possible future selves — visualized as an interactive "superposition" the user can collapse by changing a habit.

**These are not real quantum probabilities.** The quantum concept is a metaphor; the underlying system is a behavioral modeling and simulation system. All probabilities are modeled/simulated likelihoods, not predictions of an actual future.

---

## Table of Contents
- [The Core Idea](#the-core-idea)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started (Full Setup)](#getting-started-full-setup)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Database Setup](#2-database-setup)
  - [3. AI/ML Setup](#3-aiml-setup)
  - [4. Firmware / Hardware Setup](#4-firmware--hardware-setup)
  - [5. Frontend Setup](#5-frontend-setup)
- [Data Flow](#data-flow)
- [API Reference](#api-reference)
- [Team](#team)
- [Current Status](#current-status)
- [Scientific Honesty](#scientific-honesty)

---

## The Core Idea

- **Present State** — live environmental/behavioral signals from a physical device
- **Future Selves** — Focused You, Consistent You, Creative You, Burned-Out You, Active You — each with a modeled likelihood
- **What-If Engine** — the user changes a hypothetical habit and watches the distribution recalculate live

## System Architecture

```
ESP32 (sensors) → WiFi/HTTPS → FastAPI Backend → Supabase (PostgreSQL)
   → Feature Extraction → AI Scoring Model → Future-State Distribution
   → What-If Simulation → React + TypeScript Frontend → 3D Visualization
```

## Tech Stack

| Layer | Technology |
|---|---|
| Hardware | ESP32-WROOM-32, DHT11/22, LDR, PIR motion sensor, potentiometer, SSD1306 OLED |
| PCB Design | KiCad |
| Firmware | C++ (Arduino framework), simulated via Wokwi |
| Backend | Python, FastAPI |
| Database | Supabase (PostgreSQL) |
| AI/ML | Python, engineered behavioral features + weighted scoring |
| Frontend | React, TypeScript, Tailwind CSS |
| 3D Visualization | Three.js / React Three Fiber |
| Hosting | Railway (backend), free-tier Supabase |

## Repository Structure

```
superposition-you/
├── frontend/              # React + TypeScript app
│   ├── src/
│   └── package.json
├── backend/                # FastAPI app
│   └── app/
│       ├── main.py
│       ├── api/            # Route handlers (ingest, predictions, what-if)
│       ├── models/         # Request/response schemas
│       ├── database/       # Supabase client + queries
│       └── ai/              # Feature extraction, scoring model, calibration scripts
├── hardware/
│   ├── bom/                 # Bill of Materials
│   ├── kicad/                # Schematic + PCB project files (.kicad_pro/.kicad_sch/.kicad_pcb)
│   ├── schematics/            # Exported schematic (PDF)
│   ├── pcb/                   # PCB layout renders, DRC report
│   ├── simulation/wokwi/       # Wokwi simulation files (diagram.json, wokwi.toml)
│   └── wiring/                 # Pin connection reference
├── firmware/                # ESP32 C++ firmware (.ino) + flowchart
├── docs/                     # Project documentation, tech reports
├── .env.example
└── README.md                 # This file
```

---

## Getting Started (Full Setup)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) account
- [Arduino CLI](https://arduino.github.io/arduino-cli/latest/installation/) or Arduino IDE (for firmware)
- A free [Wokwi](https://wokwi.com) account (for hardware simulation) — or the VS Code Wokwi extension

---

### 1. Backend Setup

```bash
git clone <repo-url>
cd backend
pip install -r requirements.txt --break-system-packages   # or use a venv
```

Create a `.env` file in `backend/` based on `.env.example`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-or-publishable-key
```

Run the backend locally:
```bash
uvicorn app.main:app --reload --port 8000
```

Once running, interactive API docs (Swagger UI) are available at:
```
http://localhost:8000/docs
```

**Live deployed backend (for reference/testing without local setup):**
```
https://youverse-stag-3.up.railway.app/docs
```

---

### 2. Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Run the schema SQL (found in `backend/app/database/schema.sql`) in the Supabase SQL editor to create the required tables:
   - `users`
   - `devices`
   - `sensor_readings`
   - `behavioral_features`
   - `predictions`
   - `what_if_scenarios`
   - `future_states`
3. Copy your project's URL and anon/publishable key into `backend/.env` (see step 1).

Core data flow through the tables:
```
sensor_readings → behavioral_features → predictions → future_states
```

---

### 3. AI/ML Setup

The AI/ML scripts live in `backend/app/ai/`.

```bash
cd backend/app/ai
pip install supabase --break-system-packages
```

Set your Supabase credentials as environment variables (PowerShell example — adjust for your shell):
```powershell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_KEY="your-supabase-key"
```

Run the calibration/check script against live sensor data:
```bash
python check_real_data.py
```

This will:
- Fetch recent `sensor_readings` from the last 15 minutes
- Extract behavioral features (light/noise stability, motion rate, quiet/activity scores, etc.)
- Run the scoring model and print the resulting future-state distribution with an explanation

> Note: for meaningful output, make sure a device (real or simulated via Wokwi) is actively streaming sensor data before running the script.

---

### 4. Firmware / Hardware Setup

Firmware code lives in `firmware/`.

#### Option A — Simulate on Wokwi (no physical hardware needed)
1. Open `hardware/simulation/wokwi/diagram.json` on [wokwi.com](https://wokwi.com), or use the Wokwi extension in VS Code.
2. Build the firmware first (Wokwi needs a compiled `.bin`/`.elf`):
   ```bash
   cd firmware
   arduino-cli lib install "DHT sensor library"
   arduino-cli lib install "Adafruit Unified Sensor"
   arduino-cli lib install "ArduinoJson"
   arduino-cli lib install "Adafruit SSD1306"
   arduino-cli lib install "Adafruit GFX Library"
   arduino-cli compile --fqbn esp32:esp32:esp32 --output-dir build firmware.ino
   ```
3. Press ▶ Start Simulation in Wokwi. The OLED display will show live sensor readings and transmission status (`Sending...` → `Sent OK`).

#### Option B — Real ESP32 hardware
1. Wire the components per `hardware/wiring/connections.md` and the schematic in `hardware/schematics/`.
2. Update `firmware/firmware.ino`'s WiFi credentials (`ssid`, `password`) for your real network instead of the Wokwi virtual network.
3. Flash via Arduino IDE or `arduino-cli upload`.

**Sensor Data Contract** (JSON payload sent every 5 seconds to the backend):
```json
{
  "device_id": "esp32-sim-001",
  "timestamp": "2026-08-16T12:00:00Z",
  "light": 77.7,
  "temperature": 25.0,
  "humidity": 50.0,
  "motion": 1,
  "noise": 30.0
}
```

See `hardware/README.md` for the full pin mapping and `docs/HARDWARE_TECH_REPORT.pdf` for the full technical writeup.

---

### 5. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file based on `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:8000
# or, to use the live deployed backend:
# VITE_API_BASE_URL=https://youverse-stag-3.up.railway.app
```

Run the dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

---

## Data Flow

```
sensor_readings → behavioral_features → predictions → future_states
```

Raw sensor data, synthetic data, and model output are always kept clearly distinguished in the UI and data model.

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sensors/ingest` | Submit a sensor reading (used by firmware) |
| GET | `/api/sensors/latest` | Get the most recent sensor reading |
| GET | `/api/predictions/{user_id}` | Get current future-state distribution |
| POST | `/api/what-if` | Submit a hypothetical behavior change and get a recalculated distribution |

Full interactive documentation: `https://youverse-stag-3.up.railway.app/docs`

## Team

- **Hardware/Firmware** — ESP32 circuit design (KiCad), sensor integration, firmware (WiFi, HTTPS, OLED display, real-time sensor pipeline)
- **Backend** — FastAPI, database schema, ingestion + prediction endpoints, deployment
- **AI/ML** — Feature engineering, behavioral scoring model, What-If recalculation logic, calibration on real device data
- **Frontend** — React app, Superposition visualization, What-If interaction, 3D scene

## Current Status

✅ End-to-end pipeline verified live: real sensor data → backend → database → AI scoring, confirmed with live device readings
✅ Hardware: schematic complete (ERC clean), PCB routed (DRC clean), simulated on Wokwi
✅ Backend: deployed, tested, sensor ingestion + prediction endpoints live
✅ AI: feature extraction + scoring model calibrated against real collected sensor data
⏳ Frontend: in integration
⏳ Physical device assembly: planned post-hackathon (currently simulated)

## Scientific Honesty

This project does not claim to predict anyone's actual future, measure focus/productivity/mental health directly, or compute real quantum probabilities. Sensor readings are observable environmental proxies; everything downstream is a modeled, quantum-inspired behavioral simulation, clearly labeled as such throughout the product.
