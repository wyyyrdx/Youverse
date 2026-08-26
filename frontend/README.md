# 🌌 Youverse Frontend

> **You are here. Your present state exists at the center of a living possibility space.**

Production-ready, interactive 3D frontend for the **Youverse** behavioral simulation platform (Reverie Hacks 2026).

---

## ✨ Key Features
- **Cinematic 3D Universe**: Powered by Three.js and React Three Fiber with custom celestial shaders and glowing planetary atmospheres.
- **Superposition Galaxy**: Real-time 3D orbital visualization of the **Present Self** surrounded by the 5 possible future states (*Focused, Consistent, Creative, Active, Burned-Out*).
- **Interactive Simulation Chamber (What-If)**: Natural language intention parser & feature sliders that communicate directly with `POST /api/what-if` on the FastAPI backend.
- **Live Hardware Telemetry**: Real-time sensor monitoring (LDR Light, PIR Motion, Sound/Noise, DHT Temperature & Humidity) with simulated data injection support.
- **Future Self Observatories**: Deep-dive profile pages (`/self/:id`) with alignment analytics, behavioral attribution, and guided reflection questions.
- **Milestones & Discoveries**: Gamified exploration tracking with coordinates and milestone achievements.

---

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling:** Tailwind CSS, PostCSS, Custom glassmorphic CSS design system
- **Routing:** React Router v6
- **Icons:** Lucide Icons

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```
