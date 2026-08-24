# Youverse Frontend

Immersive React + Vite + TypeScript + Tailwind experience for Youverse.

## Theme

- Black void canvas with dense multi-layer particles
- Mouse parallax + independent drift
- Floating logo with soft violet glow
- Glass navigation and panels
- Orbiting Future Selves as interactive regions

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

## Routes

| Path | Page |
|------|------|
| `/` | Hero + Universe + What-If |
| `/present` | Present state + hardware pipeline |
| `/what-if` | Simulation chamber |
| `/profile` | Personal observatory |
| `/discoveries` | Milestones |
| `/self/:id` | Future Self detail |

## Structure

```
src/
├── components/   Layout, Starfield, Hero, Galaxy, WhatIf
├── pages/        Present, Profile, Discoveries, FutureSelf
├── data/         futureSelves mock
├── services/     API client
├── hooks/        usePredictions
└── utils/        userId, mapFutureStates
```

Logo: `public/youverse-logo.png`
