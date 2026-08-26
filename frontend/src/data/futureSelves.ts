import type { FutureSelf } from '../types'

export const futureSelves: FutureSelf[] = [
  {
    id: 'focused',
    name: 'Focused You',
    score: 38,
    color: '#2fe4ff',
    glow: 'rgba(47, 228, 255, 0.65)',
    orbitRadius: 160,
    orbitDuration: 28,
    orbitOffset: 0,
    description:
      'Steady light levels, low acoustic noise, sustained stillness. The version of you that achieves deep concentration and finishes what it starts.',
    characteristics: [
      'High light stability during work blocks',
      'Low environmental noise variance',
      'Prolonged stillness intervals with minimal distraction',
      'Consistent focus sprints without fragmentation',
    ],
    signals: ['light', 'noise', 'motion'],
    reflectionPrompts: [
      'What deep work block can you protect from interruptions today?',
      'How can you minimize acoustic distractions in your primary workspace?',
      'Which unfinished project would deliver the highest leverage right now?',
    ],
    nudges: [
      'Set phone to Do-Not-Disturb for 45 minutes',
      'Dim ambient distractions and create dedicated desk lighting',
      'Commit to a single priority task before checking communications',
    ],
  },
  {
    id: 'creative',
    name: 'Creative You',
    score: 24,
    color: '#e63cff',
    glow: 'rgba(230, 60, 255, 0.65)',
    orbitRadius: 220,
    orbitDuration: 36,
    orbitOffset: 72,
    description:
      'Dynamic environmental rhythms, late-night bursts of motion and variable lighting. The version of you that explores novel ideas and follows spontaneous inspiration.',
    characteristics: [
      'Variable light and temperature patterns',
      'Unstructured motion bursts indicating exploratory work',
      'Late-evening cognitive engagement and ideation spikes',
      'Fluid transitions between diverse creative modalities',
    ],
    signals: ['motion', 'light', 'temperature'],
    reflectionPrompts: [
      'What unusual combination of ideas have you been curious to explore?',
      'Where can you give yourself permission to create without judging the outcome?',
      'What physical space sparks the most unrestrained imagination for you?',
    ],
    nudges: [
      'Dedicate 30 minutes to freeform sketching, brainstorming, or writing',
      'Change your physical environment or walk a new route today',
      'Capture raw ideas immediately without editing or evaluating them',
    ],
  },
  {
    id: 'active',
    name: 'Active You',
    score: 18,
    color: '#7bffb0',
    glow: 'rgba(123, 255, 176, 0.6)',
    orbitRadius: 280,
    orbitDuration: 44,
    orbitOffset: 144,
    description:
      'Frequent motion triggers, shifting thermal dynamics, elevated physical throughput. The version of you that treats somatic vitality and energy as foundational.',
    characteristics: [
      'Frequent PIR motion sensor activations throughout the day',
      'Elevated thermal dissipation from physical exertion',
      'Regular postural shifts and walking intervals',
      'High vitality and kinetic momentum',
    ],
    signals: ['motion', 'temperature', 'humidity'],
    reflectionPrompts: [
      'How does physical movement directly affect your mental clarity?',
      'What kind of exercise feels joyful rather than like a chore?',
      'How can you introduce brief physical micro-breaks throughout your day?',
    ],
    nudges: [
      'Take a 15-minute brisk walk after your next work session',
      'Do a 5-minute stretch routine before starting your afternoon tasks',
      'Stand up and hydrate whenever you transition between tasks',
    ],
  },
  {
    id: 'consistent',
    name: 'Consistent You',
    score: 13,
    color: '#ffd166',
    glow: 'rgba(255, 209, 102, 0.6)',
    orbitRadius: 340,
    orbitDuration: 52,
    orbitOffset: 216,
    description:
      'Harmonic signal regularity, recurring circadian milestones, predictable ambient patterns. The version of you that builds momentum effortlessly through steady routines.',
    characteristics: [
      'Predictable morning and evening light transition signatures',
      'Regular circadian sensor markers across days',
      'Steady habit loops that do not rely on fluctuating motivation',
      'Low entropy across ambient noise and temperature cycles',
    ],
    signals: ['light', 'motion', 'noise'],
    reflectionPrompts: [
      'What small daily ritual anchors your day regardless of chaos?',
      'Which habit would you like to make completely automatic this month?',
      'How can you simplify your daily routine to reduce decision fatigue?',
    ],
    nudges: [
      'Wake up and wind down at the same target hour today',
      'Stack a new desired habit immediately after an existing anchor habit',
      'Prepare your workspace the night before to eliminate morning friction',
    ],
  },
  {
    id: 'burned-out',
    name: 'Burned-Out You',
    score: 7,
    color: '#ff6b6b',
    glow: 'rgba(255, 107, 107, 0.6)',
    orbitRadius: 400,
    orbitDuration: 60,
    orbitOffset: 288,
    description:
      'Disrupted circadian illumination, erratic noise spikes, prolonged stillness combined with late restlessness. The state the system gently warns you to avoid.',
    characteristics: [
      'Irregular late-night screen illumination and disturbed darkness',
      'High noise volatility during intended recovery hours',
      'Extended static posture accompanied by sudden frantic movement',
      'Elevated thermal instability in resting environments',
    ],
    signals: ['noise', 'light', 'motion'],
    reflectionPrompts: [
      'Where are you overcommitting your energy without adequate replenishment?',
      'What is one obligation you can gracefully decline or postpone this week?',
      'What does true, restorative rest look like for you right now?',
    ],
    nudges: [
      'Step away from all screens 30 minutes before sleep tonight',
      'Schedule a non-negotiable 30-minute quiet decompression window',
      'Take 10 deep belly breaths and check in with your physical body',
    ],
  },
]
