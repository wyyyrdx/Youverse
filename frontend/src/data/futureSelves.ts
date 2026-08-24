import type { FutureSelf } from '../types'

// Mock modeled likelihoods - in production these come from
// GET /api/predictions/{user_id}, which returns future_state + score (0-100).
// These are illustrative only, not real predictions about anyone's future.
export const futureSelves: FutureSelf[] = [
  {
    id: 'focused',
    name: 'Focused You',
    score: 40,
    color: '#2fe4ff',
    glow: 'rgba(47, 228, 255, 0.55)',
    orbitRadius: 150,
    orbitDuration: 26,
    orbitOffset: 0,
    description:
      'Steady light, low noise, long still periods. The version of you that finishes what it starts.',
    signals: ['light', 'noise', 'motion'],
  },
  {
    id: 'creative',
    name: 'Creative You',
    score: 23,
    color: '#e63cff',
    glow: 'rgba(230, 60, 255, 0.55)',
    orbitRadius: 210,
    orbitDuration: 34,
    orbitOffset: 70,
    description:
      'Irregular rhythms, late bursts of motion. The version of you that follows a spark instead of a schedule.',
    signals: ['motion', 'light', 'temperature'],
  },
  {
    id: 'active',
    name: 'Active You',
    score: 18,
    color: '#7bffb0',
    glow: 'rgba(123, 255, 176, 0.5)',
    orbitRadius: 270,
    orbitDuration: 42,
    orbitOffset: 150,
    description:
      'Frequent motion, shifting temperature. The version of you that treats the body as the whole point.',
    signals: ['motion', 'temperature', 'humidity'],
  },
  {
    id: 'consistent',
    name: 'Consistent You',
    score: 12,
    color: '#ffd166',
    glow: 'rgba(255, 209, 102, 0.5)',
    orbitRadius: 330,
    orbitDuration: 50,
    orbitOffset: 230,
    description:
      'Same signals, same hours, day after day. The version of you that shows up without needing motivation.',
    signals: ['light', 'motion', 'noise'],
  },
  {
    id: 'burned-out',
    name: 'Burned-Out You',
    score: 7,
    color: '#ff6b6b',
    glow: 'rgba(255, 107, 107, 0.5)',
    orbitRadius: 390,
    orbitDuration: 58,
    orbitOffset: 300,
    description:
      'Disrupted sleep signals, erratic noise, low stillness. The version of you the system gently warns about.',
    signals: ['noise', 'light', 'motion'],
  },
]
