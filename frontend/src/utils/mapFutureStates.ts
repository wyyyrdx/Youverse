import { futureSelves } from '../data/futureSelves'
import type { FutureSelf } from '../types'
import type { PredictionEntry } from '../services/api'

// Backend sends future_state as a name string (e.g. "Focused You"). This maps that
// string to the local visual/design metadata (color, orbit radius, description) that
// isn't part of the API contract. Matching is tolerant of minor naming differences.
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, '')
}

export function mergeWithLiveScores(live: PredictionEntry[]): FutureSelf[] {
  return futureSelves.map((local) => {
    const localKey = normalize(local.name)
    const match = live.find((entry) => {
      const key = normalize(entry.future_state)
      return key === localKey || key.includes(normalize(local.id)) || localKey.includes(key)
    })
    return match ? { ...local, score: match.score } : local
  })
}
