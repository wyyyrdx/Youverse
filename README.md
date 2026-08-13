# 🌌 Superposition You

> "You are here.
> Your habits shape the possibilities.
> Your future isn't one state. It's a superposition of possibilities."

**Superposition You** is a quantum-inspired behavioral visualization system. A small environmental sensor device observes real-world signals around you, and a web experience translates those signals into a set of *possible future selves* — visualized as a living, glowing tiny universe you can explore and interact with.

Built in 10 days for [Hackathon Name].

---

## 💡 The Concept

Before a quantum system is observed, it exists as a combination of possible states. We borrow this idea — **not as physics, but as metaphor** — to represent something every person intuitively understands: your future isn't fixed. It's a distribution of possibilities shaped by your current habits.

The experience starts at a simple truth:

**YOU ARE HERE.** *Present State.*

From there, the system shows several possible future selves, each with a modeled likelihood based on your behavioral patterns:

- 🧑‍💻 The Focused You
- 📚 The Consistent You
- 🎨 The Creative You
- 😴 The Burned-Out You
- 🏃 The Active You

```
Focused You       32%
Burned-Out You    28%
Balanced You      21%
Creative You      19%
```

You can then perform an **observation** — a "what-if" — like *"what if I start studying one hour earlier?"* — and watch the distribution recalculate and visually collapse into a new configuration.

```
Focused You       57% ↑
Burned-Out You    12% ↓
Balanced You      24%
Creative You       7%
```

---

## 🔬 Scientific Honesty

This project is **quantum-inspired, not quantum-accurate.** We are explicit about this throughout the product:

- These are **not** real physical quantum probabilities.
- The device does **not** measure focus, productivity, or mental health directly.
- Sensors capture **observable environmental/behavioral signals** (light, motion, temperature/humidity, noise) which become **engineered behavioral features**, which feed a **transparent, weighted scoring model** — not a black box.
- All outputs are labeled as **modeled likelihoods** / **visualized probabilities**, never as predictions of fact.

We'd rather be scientifically honest and still deliver something that feels magical than oversell the science.

---

## 🧠 How It Works — Pipeline

```
ESP32 (simulated on Wokwi)
   │  light, motion, temperature/humidity, noise sensors
   │  WiFi → JSON payload every 10s
   ▼
FastAPI backend  ── /ingest ──►  Supabase / Postgres (raw readings)
   │
   ├─► Feature extraction (rolling window: activity level, consistency,
   │    light exposure, quiet/noise periods)
   │
   ├─► Scoring engine (weighted features → 5 state scores → normalized to 100%)
   │
   ├─► /predict   → current future-state distribution
   └─► /whatif    → modify one behavioral feature, recalculate distribution
   ▼
React + TypeScript frontend
   ▼
React Three Fiber 3D visualization:
   a bumpy little "moon" representing your present self, with each
   future-self rendered as a tiny pixel-art creature whose glow/size
   reflects its modeled likelihood — snapping into a new configuration
   on every "observation"
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Hardware simulation | Wokwi (ESP32 + LDR + DHT22 + PIR + potentiometer as noise stand-in) |
| Firmware | C++ (Arduino framework) |
| PCB (concept only, not fabricated) | KiCad |
| Device visual design | Blueprint AI |
| Backend | Python + FastAPI |
| Database | Supabase (PostgreSQL) |
| Frontend | React + TypeScript + Tailwind CSS |
| 3D visualization | Three.js / React Three Fiber |
| Modeling | Engineered features + transparent weighted scoring (no black-box ML — see [Scientific Honesty](#-scientific-honesty)) |
| Hosting | Render (backend), free static hosting (frontend) |

> **Note on hardware:** the device is built and demoed as a **realistic Wokwi simulation** running real firmware — not a fabricated physical unit. This was a deliberate scope decision to protect demo reliability. See [SETUP.md](./SETUP.md) for the full reasoning and setup steps.

---

## 🎨 Visual Identity

A cozy, whimsical pixel-art cosmos — not cyberpunk, not a cold lab interface.

- **Palette:** lavender & deep cosmic blue base, with soft pink and cyan glow accents; each future-self gets its own pastel identity
- **Typography:** playful, game-like display headers with clean, highly readable body text and small pixel-art accents on labels/stats
- **Motion:** calm drifting/orbital motion at rest → a distinctive "quantum blip" snap + particle swirl on every observation event
- **Device shape:** a single bumpy, moon-like sphere (no rings, no orbiting parts) with a small square pixel-art screen on its face
- **Layout:** the site is a small multi-page universe, not a single dashboard — see [Pages](#-pages) below

---

## 📄 Pages

| Page | Purpose | Status |
|---|---|---|
| 🌌 Superposition (main) | Present state, future-state distribution, 3D visualization, what-if engine | **Core MVP — must ship** |
| 👾 Profile | Name, bio, interests, pick a pixel-art avatar | Should have |
| 🏆 Badges | Fun, physics/quantum-themed achievements unlocked through interaction | Nice to have |
| 🎟️ Sticker Collection | Collectible pixel-art illustrations, downloadable as printable transparent PNGs | Nice to have |

---

## 📁 Project Structure

```
/backend        FastAPI service (ingestion, feature extraction, scoring, prediction)
/firmware       ESP32 firmware (sketch.ino) + Wokwi wiring diagram (diagram.json)
/frontend       React + TypeScript + R3F web app  (added Day 4+)
SETUP.md        Full local/dev setup instructions (Render deploy, Wokwi setup, Blueprint AI prompt)
README.md       You are here.
```

---

## 🗺️ Roadmap (10-day build)

- [x] Day 1 — Backend deployed, Wokwi simulation wired and sending real data
- [ ] Day 2 — Supabase schema + feature extraction
- [ ] Day 3 — Scoring engine + multiple what-if scenarios
- [ ] Day 4 — Visual identity implemented on the main page
- [ ] Day 5 — 3D visualization (moon + future-self creatures)
- [ ] Day 6 — Quantum-blip observation transition, chained what-ifs
- [ ] Day 7 — Profile page + Badges
- [ ] Day 8 — Sticker collection
- [ ] Day 9 — Full integration testing + recorded-data demo fallback
- [ ] Day 10 — Pitch, PCB/device renders, final rehearsal

---

## ⚠️ Limitations & Future Work

- Modeled likelihoods are illustrative, derived from a small set of environmental proxies — not a validated behavioral prediction system.
- Sensor set is intentionally minimal (4 signals) for hackathon scope; a real product would need richer, privacy-respecting sensing and much more data before any claims about behavior patterns could be made responsibly.
- Physical hardware is simulated (Wokwi), not fabricated, for this build.

---
