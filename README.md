# 🌌 Youverse

> **You are here. Your habits shape the possibilities.**

### Built for Reverie Hacks 2026

Youverse is a behavioral simulation platform that explores how your current habits and environment can influence different possible versions of your future self.

Instead of telling you what your future will be, Youverse helps you understand how your **current state can shape future possibilities**.

[🎥 Watch the Demo](https://youtu.be/ZdHFRG2crXw?si=tzGFYWxcKCb7MCAu)

---

## 📖 Contents

- [🧠 The Idea](#-the-idea)
- [✨ Why Youverse?](#-why-youverse)
- [🔮 How It Works](#-how-it-works)
- [🪐 The Future Selves](#-the-future-selves)
- [🎮 What-If Simulation](#-what-if-simulation)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Repository Structure](#-repository-structure)
- [🚀 How to run the project](#-How-to-run-the-project)
- [📊 Data Flow](#-data-flow)
- [🔬 Scientific Honesty](#-scientific-honesty)
- [🧪 Current Status](#-current-status)
- [🌱 Future Vision](#-future-vision)
- [👥 Team](#-team)

---

## 🧠 The Idea

We often think about the future as a single destination.

But the future is shaped by what we repeatedly do today.

Youverse turns that idea into an interactive experience.

A physical device collects environmental and behavioral signals. These signals are transformed into behavioral features and processed by a lightweight modeling system. The result is a distribution across several possible **Future Selves**.

The user can then explore a **What-If scenario** by changing a hypothetical habit and observing how the modeled distribution changes.

> **Youverse does not predict your actual future. It helps you explore how your present behavior can influence different modeled possibilities.**

---

## ✨ Why Youverse?

Most productivity and habit-tracking tools tell you what you are doing.

Youverse asks a different question:

> **"If I keep going like this, what kind of person could I be moving toward?"**

And more importantly:

> **"What happens if I change something today?"**

The goal is not to create a deterministic prediction.

The goal is to make the connection between **present behavior and future possibilities** tangible, visual, and interactive.

---

## 🔮 How It Works

```text
Physical Environment
        ↓
ESP32 + Sensors
        ↓
Behavioral Signals
        ↓
Feature Extraction
        ↓
Behavioral Modeling
        ↓
Future-State Distribution
        ↓
Interactive What-If Simulation
        ↓
3D Future Selves Visualization
```

### 1. Sense

An ESP32-based device collects environmental and behavioral signals using sensors such as:

- Light
- Motion
- Temperature
- Other environmental signals

### 2. Interpret

The collected signals are transformed into engineered behavioral features such as activity, stability, quietness, and other relevant indicators.

### 3. Model

A lightweight behavioral scoring system maps these features to several modeled future states.

### 4. Visualize

The results are presented as an interactive visualization where multiple possible Future Selves coexist.

### 5. Explore

The user can modify a hypothetical behavioral input through the **What-If Engine** and immediately see how the modeled distribution changes.

---

## 🪐 The Future Selves

Youverse represents the future as a set of possibilities rather than a single prediction.

Each Future Self represents a modeled behavioral direction based on the current signals and assumptions.

| Future Self | Represents |
|---|---|
| 🎯 Focused You | Strong concentration and consistency |
| 🔥 Consistent You | Stable routines and sustained behavior |
| 🎨 Creative You | Higher exploration and creative activity |
| ⚡ Active You | Increased physical activity and engagement |
| 🌫️ Burned-Out You | Patterns associated with low stability or sustained strain |

These states are part of the simulation and should not be interpreted as psychological or medical diagnoses.

---

## 🎮 What-If Simulation

One of the core ideas behind Youverse is that **small changes can change the modeled possibilities**.

The user can modify a hypothetical behavioral input and observe the result.

```text
Current State
     ↓
"What if I become more consistent?"
     ↓
Recalculate
     ↓
New Future-State Distribution
```

This turns the experience from simply observing data into exploring possible consequences of changing behavior.

---

## 🏗️ System Architecture

```text
ESP32 Sensors
      │
      │ WiFi / HTTPS
      ▼
FastAPI Backend
      │
      ├── Data Processing
      ├── Feature Extraction
      └── Behavioral Modeling
      │
      ▼
Supabase / PostgreSQL
      │
      ▼
Future-State Distribution
      │
      ▼
What-If Simulation
      │
      ▼
React + TypeScript
      │
      ▼
Three.js / React Three Fiber
      │
      ▼
Interactive 3D Visualization
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Hardware | ESP32-WROOM-32 |
| Sensors | DHT11/22, LDR, PIR, potentiometer |
| Display | SSD1306 OLED |
| PCB Design | KiCad |
| Firmware | C++ / Arduino |
| Hardware Simulation | Wokwi |
| Backend | Python / FastAPI |
| Database | Supabase / PostgreSQL |
| AI / ML | Python / Engineered Behavioral Features / Weighted Scoring |
| Frontend | React / TypeScript |
| Styling | Tailwind CSS |
| 3D Visualization | Three.js / React Three Fiber |
| Backend Hosting | Railway |

---

## 📁 Repository Structure

```text
Youverse/
├── frontend/
├── backend/
├── hardware/ ---> checkout DRC (hardware/pcb) & ERC (hardware/schematic)
├── firmware/
├── docs/ ---> tech report & flowchart
├── .gitignore
└── README.md
└── LICENSE
```

---

## 🚀 How to run the project

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Supabase account
- Arduino CLI or Arduino IDE
- Wokwi account for hardware simulation

### Clone the Repository

```bash
git clone https://github.com/wyyyrdx/Youverse.git
cd Youverse
```

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file based on `.env.example`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

Run the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

API documentation:

```text
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Hardware

The firmware and hardware simulation are located in:

```text
firmware/
hardware/simulation/wokwi/
```

You can use the Wokwi simulation without physical hardware.

For the complete hardware setup, wiring, PCB files, and firmware instructions, see the corresponding directories in the repository.

---

## 📊 Data Flow

```text
Sensor Readings
      ↓
Behavioral Features
      ↓
Model Scoring
      ↓
Future States
      ↓
What-If Scenario
      ↓
Updated Distribution
```

The backend stores the relevant data and provides the API used by the frontend.

---

## 🔬 Scientific Honesty

Youverse uses quantum-inspired language and visualization as a conceptual metaphor.

It does **not** perform real quantum computing, and the Future Selves shown by the system are not guaranteed predictions.

The probabilities displayed by the application are **modeled likelihoods generated by the behavioral simulation system**.

They should be interpreted as an exploration of possible outcomes under the model's assumptions, not as facts about a person's actual future.

The system is also not intended to provide medical, psychological, or diagnostic conclusions.

---

## 🧪 Current Status

### Implemented

- [x] ESP32 sensor architecture
- [x] Hardware simulation
- [x] Behavioral feature extraction
- [x] Backend API
- [x] Database integration
- [x] Future-state modeling
- [x] What-If simulation
- [x] Interactive frontend
- [x] 3D Future Selves visualization

### Current Prototype Note

Youverse is currently a functional prototype that combines an interactive frontend, behavioral simulation, backend services, and a simulated ESP32-based hardware layer.

The current experience demonstrates the complete concept and data flow, while parts of the physical sensing pipeline are simulated rather than continuously collected from a deployed physical device.

The Future Selves and their probabilities are generated by the project's behavioral model. They represent modeled possibilities based on the available inputs and should not be interpreted as predictions of a person's actual future.

The next stage is to connect the physical hardware directly to the live pipeline, allowing real-world environmental and behavioral signals to continuously influence the user's modeled possibility space.

---

## 🌱 Future Vision

Youverse is currently a prototype exploring the relationship between present behavior and possible future states.

In future versions, the system could become a more complete personal reflection platform by combining richer behavioral signals, improved modeling, personalized feedback, and a more capable physical device.

The long-term vision is simple:

> **Make the future feel less like something that happens to you and more like something your present actions can influence.**

---

## 👥 Team

Built by:

- **[Wyyyrdx]** — [Hardware&Firmware engineer]
- **[Salmansanusisani]** — [Ai/Ml engineer]
- **[Awaisranahmad]** — [Backend engineer]

### 🏆 Hackathon

Built for **Reverie Hacks 2026**

[🔗 View our Devpost submission](https://devpost.com/software/youverse?ref_content=my-projects-tab&ref_feature=my_projects)

---

## 📄 License

This project is licensed under the MIT License.