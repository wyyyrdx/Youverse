import { futureSelves } from '../data/futureSelves'
import type { FutureSelf, PredictionEntry } from '../types'

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function mergeWithLiveScores(live: PredictionEntry[]): FutureSelf[] {
  if (!live || !Array.isArray(live) || live.length === 0) {
    return futureSelves
  }

  return futureSelves.map((local) => {
    const localKey = normalize(local.name)
    const localId = normalize(local.id)

    const match = live.find((entry) => {
      const liveKey = normalize(entry.future_state)
      return (
        liveKey === localKey ||
        liveKey.includes(localId) ||
        localKey.includes(liveKey) ||
        (localId === 'burnedout' && liveKey.includes('burn')) ||
        (localId === 'consistent' && liveKey.includes('consist')) ||
        (localId === 'creative' && liveKey.includes('creat')) ||
        (localId === 'focused' && liveKey.includes('focus')) ||
        (localId === 'active' && liveKey.includes('activ'))
      )
    })

    if (match) {
      return {
        ...local,
        score: typeof match.score === 'number' ? Math.round(match.score) : local.score,
      }
    }
    return local
  })
}
