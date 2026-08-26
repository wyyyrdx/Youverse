import type { FutureSelf, WhatIfChange, WhatIfResult } from '../types'
import { futureSelves as defaultSelves } from '../data/futureSelves'

export function parseIntentToFeatures(text: string): WhatIfChange[] {
  const lower = text.toLowerCase()
  const changes: WhatIfChange[] = []

  if (/focus|study|deep work|concentrat|code|program|finish|complete|write|read/.test(lower)) {
    changes.push({ changed_feature: 'light_stability', new_value: 0.95 })
    changes.push({ changed_feature: 'quiet_score', new_value: 0.9 })
    changes.push({ changed_feature: 'noise_stability', new_value: 0.92 })
  }

  if (/sleep|routine|wake|bed|rest|consisten|schedule|habit|daily|morning/.test(lower)) {
    changes.push({ changed_feature: 'light_stability', new_value: 0.88 })
    changes.push({ changed_feature: 'avg_noise', new_value: 250 })
    changes.push({ changed_feature: 'noise_stability', new_value: 0.85 })
  }

  if (/move|walk|run|gym|workout|exercise|sport|active|hike|stretch|bike/.test(lower)) {
    changes.push({ changed_feature: 'activity_score', new_value: 0.95 })
    changes.push({ changed_feature: 'motion_rate', new_value: 0.85 })
  }

  if (/create|art|paint|music|design|idea|innovat|experiment|novel|draw/.test(lower)) {
    changes.push({ changed_feature: 'activity_score', new_value: 0.65 })
    changes.push({ changed_feature: 'light_stability', new_value: 0.45 })
  }

  if (/stress|tired|overwork|exhaust|deadline|late night|no sleep|burnout/.test(lower)) {
    changes.push({ changed_feature: 'noise_stability', new_value: 0.2 })
    changes.push({ changed_feature: 'light_stability', new_value: 0.25 })
    changes.push({ changed_feature: 'avg_noise', new_value: 1200 })
  }

  if (changes.length === 0) {
    changes.push({ changed_feature: 'activity_score', new_value: 0.75 })
  }

  // De-duplicate: if multiple matched categories touch the same feature
  // (e.g. "focus" and "daily routine" both affect noise_stability), keep
  // only the last (most specific) value so narratives and scoring don't
  // double-count or repeat the same feature name.
  const deduped = new Map<string, number>()
  changes.forEach(({ changed_feature, new_value }) => {
    deduped.set(changed_feature, new_value)
  })

  return Array.from(deduped, ([changed_feature, new_value]) => ({ changed_feature, new_value }))
}

export function calculateLocalSimulation(
  changes: WhatIfChange[],
  baseline: FutureSelf[] = defaultSelves,
  customNarrative?: string
): WhatIfResult {
  const nudges: Record<string, number> = {
    focused: 0,
    creative: 0,
    active: 0,
    consistent: 0,
    'burned-out': 0,
  }

  changes.forEach(({ changed_feature, new_value }) => {
    switch (changed_feature) {
      case 'activity_score':
      case 'motion_rate': {
        const delta = (new_value - 0.3) * 28
        nudges['active'] += delta
        nudges['creative'] += delta * 0.35
        nudges['focused'] -= delta * 0.25
        nudges['burned-out'] -= delta * 0.15
        break
      }
      case 'quiet_score':
      case 'noise_stability': {
        const delta = (new_value - 0.5) * 25
        nudges['focused'] += delta * 1.2
        nudges['consistent'] += delta * 0.9
        nudges['burned-out'] -= delta * 1.1
        nudges['active'] -= delta * 0.3
        break
      }
      case 'light_stability': {
        const delta = (new_value - 0.5) * 24
        nudges['focused'] += delta * 1.1
        nudges['consistent'] += delta * 1.0
        nudges['creative'] -= delta * 0.4
        nudges['burned-out'] -= delta * 0.8
        break
      }
      case 'avg_noise': {
        const delta = (new_value - 500) / 40
        nudges['burned-out'] += delta * 0.8
        nudges['focused'] -= delta * 0.9
        break
      }
      default:
        nudges['consistent'] += 6
        break
    }
  })

  const withNudges = baseline.map((f) => {
    const raw = Math.max(f.score + (nudges[f.id] ?? 0), 2)
    return { id: f.id, raw }
  })

  const total = withNudges.reduce((sum, item) => sum + item.raw, 0)
  const updated = withNudges.map((item) => ({
    id: item.id,
    score: Math.round((item.raw / total) * 100),
  }))

  const drift = 100 - updated.reduce((sum, item) => sum + item.score, 0)
  updated[0].score += drift

  const highest = [...updated].sort((a, b) => b.score - a.score)[0]
  const highestSelf = baseline.find((f) => f.id === highest.id)

  const narrative =
    customNarrative ||
    `By adjusting ${changes.map((c) => c.changed_feature.replace(/_/g, ' ')).join(', ')}, the behavioral model recalculates your state distribution. ${highestSelf?.name || 'Your target self'} strengthens to ${highest.score}%. Small changes in present signals ripple into future possibilities.`

  return {
    narrative,
    updated,
    featureChanges: changes,
    source: 'local',
  }
}
