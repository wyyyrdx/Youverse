# Youverse — Frontend

React + Vite + TypeScript + Tailwind CSS frontend for Youverse: a pure-black cosmic
experience that turns behavioral sensor signals into a set of modeled future selves.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at the current backend
npm run dev
```

Open http://localhost:5173.

## Structure

```
src/
├── components/
│   ├── Layout.tsx      # nav + persistent starfield background
│   ├── Starfield.tsx   # animated canvas stars + nebula glows
│   ├── Hero.tsx         # landing section
│   ├── Galaxy.tsx       # orbit visualization — the centerpiece
│   └── WhatIf.tsx       # what-if text input + mock recalculation
├── pages/
│   ├── Profile.tsx
│   └── Achievements.tsx
├── data/futureSelves.ts # mock future-self data (design fields + fallback scores)
├── services/api.ts      # calls to the FastAPI backend (predictions, what-if)
├── types/index.ts
└── App.tsx              # composes Hero + Galaxy + WhatIf for the home route
```

## Current state

- **Wired to the real backend.** `src/hooks/usePredictions.ts` calls
  `GET /api/predictions/{user_id}` on load. If the backend is unreachable, returns an
  error, or has no data yet for that user, it silently falls back to the mock data in
  `src/data/futureSelves.ts` — the Galaxy shows a small status pill (`LIVE · ...` /
  `OFFLINE · SHOWING SAMPLE DATA`) so it's obvious which one you're looking at.
- **What-If** tries `POST /api/what-if` first (`src/components/WhatIf.tsx`) and falls
  back to a local keyword-weighted mock model if that fails. **The request body shape
  for `/api/what-if` has not been confirmed by the backend team** — only the response
  shape is documented. We're currently sending `{ user_id, text }`; check
  `src/services/api.ts` for the note and update it once backend confirms the real
  contract (they may expect structured behavioral-feature deltas instead of free text).
- There's no auth system yet. `src/utils/userId.ts` generates a random id per browser
  and stores it in `localStorage` so `user_id` has something to point at — swap this out
  once real accounts exist.
- `future_state` strings from the backend are matched to local visual metadata (color,
  orbit position, description) in `src/utils/mapFutureStates.ts` by normalizing and
  comparing names — this is tolerant of small wording differences but will silently keep
  the mock score for any future_state it can't match, so keep an eye on the console
  warning if the backend renames a state.
- Backend contract as of the last team update: `GET /api/predictions/{user_id}` and
  `POST /api/predictions/calculate` both return
  `{ status, data: [{ future_state, score }], is_simulated }`, with `score` on a 0–100
  scale.
- Base URL defaults to the staging Railway deploy (confirmed live as of this build);
  override with `VITE_API_BASE_URL` in `.env`.

## Design tokens

- Background: `#030308` (void), panel `#0b0b16`
- Accents: magenta `#e63cff`, cyan `#2fe4ff`
- Display font: Orbitron · Body: Space Grotesk · Data/labels: JetBrains Mono
