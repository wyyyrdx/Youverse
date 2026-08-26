import { useState } from 'react'
import { Sparkles, Sliders, MessageSquare, RotateCcw, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'
import { usePredictions } from '../hooks/usePredictions'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { api } from '../services/api'
import { getUserId } from '../utils/userId'
import { mergeWithLiveScores } from '../utils/mapFutureStates'
import { parseIntentToFeatures, calculateLocalSimulation } from '../services/whatIfEngine'
import type { FutureSelf, WhatIfResult } from '../types'
import Badge from './Badge'

const QUICK_PROMPTS = [
  { label: 'Deep Focus Sprint', text: 'I want to eliminate workspace noise, stabilize lighting, and focus for 4 hours daily' },
  { label: 'Active Somatic Reset', text: 'I will take frequent walking breaks and increase physical exercise every morning' },
  { label: 'Circadian Routine', text: 'I want to sleep by 10 PM and keep consistent sleep and wake hours every day' },
  { label: 'Creative Exploration', text: 'I want to dedicate evenings to freeform brainstorming, design, and painting' },
  { label: 'Stress Recovery', text: 'I need to reduce cognitive fatigue, dim intense screens, and rest without disturbance' },
]

export default function WhatIf() {
  const { futureSelves: baseline } = usePredictions()
  const { playQuantumPulse, playHoverTone } = useSoundEffects()
  const [tab, setTab] = useState<'prompt' | 'sliders'>('prompt')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WhatIfResult | null>(null)

  // Sliders state
  const [sliderActivity, setSliderActivity] = useState(0.7)
  const [sliderQuiet, setSliderQuiet] = useState(0.8)
  const [sliderLightStability, setSliderLightStability] = useState(0.85)

  const handleRunSimulation = async (customText?: string) => {
    const input = customText !== undefined ? customText : text
    if (!input.trim() && tab === 'prompt') return

    setLoading(true)
    playQuantumPulse()

    const userId = getUserId()
    const featureChanges =
      tab === 'prompt'
        ? parseIntentToFeatures(input)
        : [
            { changed_feature: 'activity_score', new_value: sliderActivity },
            { changed_feature: 'quiet_score', new_value: sliderQuiet },
            { changed_feature: 'light_stability', new_value: sliderLightStability },
          ]

    try {
      // Direct call to FastAPI backend POST /api/what-if
      const primaryChange = featureChanges[0]
      const res = await api.runWhatIf({
        user_id: userId,
        changed_feature: primaryChange.changed_feature,
        new_value: primaryChange.new_value,
      })

      if (res && res.data && res.data.length > 0) {
        const merged = mergeWithLiveScores(res.data)
        const updated = merged.map((f) => ({ id: f.id, score: f.score }))
        const highest = [...updated].sort((a, b) => b.score - a.score)[0]
        const winner = baseline.find((f) => f.id === highest.id)

        setResult({
          narrative: `Live AI simulation recalculated across your behavioral features. ${
            winner?.name || 'Your target state'
          } shifts to ${highest.score}%. Your present choices reshape the possibility space.`,
          updated,
          featureChanges,
          source: 'live',
        })
      } else {
        throw new Error('Empty response from backend')
      }
    } catch (err) {
      // Seamless fallback to high-fidelity rule scoring engine
      const message = err instanceof Error ? err.message : String(err)
      console.warn('What-If live simulation failed, using local fallback engine:', message)
      await new Promise((r) => setTimeout(r, 400))
      const sim = calculateLocalSimulation(featureChanges, baseline)
      setResult(sim)
    } finally {
      setLoading(false)
      // Confetti burst on successful calculation (non-critical, never blocks UI)
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#2fe4ff', '#e63cff', '#7bffb0', '#ffd166'],
        })
      } catch (err) {
        console.debug('Confetti animation failed silently:', err)
      }
    }
  }

  const displayedFutures: FutureSelf[] = baseline.map((f) => {
    const updatedScore = result?.updated.find((u) => u.id === f.id)?.score
    return updatedScore !== undefined ? { ...f, score: updatedScore } : f
  })

  return (
    <section id="what-if" className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col justify-center">
      {/* Background glow */}
      <div
        className="cosmic-nebula bottom-10 right-1/4 w-[60vw] h-[40vh] bg-magenta/10"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge color="magenta">SIMULATION CHAMBER</Badge>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-mist tracking-tight">
            What if you changed one thing?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-mist-muted leading-relaxed">
            Hypothesize a new habit, routine, or workspace change. The simulation engine recalculates
            how your possibility space transforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Input Chamber */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-void/60 border border-white/10">
                <button
                  onClick={() => setTab('prompt')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    tab === 'prompt'
                      ? 'bg-magenta text-void font-bold shadow-md'
                      : 'text-mist-muted hover:text-mist'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Natural Intention</span>
                </button>
                <button
                  onClick={() => setTab('sliders')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    tab === 'sliders'
                      ? 'bg-cyan text-void font-bold shadow-md'
                      : 'text-mist-muted hover:text-mist'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Feature Tuning</span>
                </button>
              </div>

              {result && (
                <button
                  onClick={() => {
                    setResult(null)
                    setText('')
                  }}
                  className="p-1.5 rounded-lg text-mist-faint hover:text-mist transition-colors"
                  title="Reset simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {tab === 'prompt' ? (
              <div>
                <label className="block font-mono text-xs text-mist-muted mb-2">
                  Describe your intended change:
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="I want to sleep by 10:30 PM, move every morning, and study with zero desk distractions…"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-mist placeholder:text-mist-faint focus:border-magenta focus:outline-none focus:ring-1 focus:ring-magenta transition-all"
                />

                {/* Quick Intention Pills */}
                <div className="mt-4">
                  <p className="font-mono text-[10px] text-mist-faint uppercase mb-2">
                    Quick Scenario Templates:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => {
                          setText(p.text)
                          handleRunSimulation(p.text)
                        }}
                        onMouseEnter={() => playHoverTone(460)}
                        className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-mono text-mist-muted hover:text-mist transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1.5">
                    <span className="text-mint">Physical Activity / Motion Rate</span>
                    <span className="text-mist">{Math.round(sliderActivity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={sliderActivity}
                    onChange={(e) => setSliderActivity(parseFloat(e.target.value))}
                    className="w-full accent-mint cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono text-xs mb-1.5">
                    <span className="text-cyan">Acoustic Quietness Score</span>
                    <span className="text-mist">{Math.round(sliderQuiet * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={sliderQuiet}
                    onChange={(e) => setSliderQuiet(parseFloat(e.target.value))}
                    className="w-full accent-cyan cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono text-xs mb-1.5">
                    <span className="text-amber">Workspace Light Stability</span>
                    <span className="text-mist">{Math.round(sliderLightStability * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={sliderLightStability}
                    onChange={(e) => setSliderLightStability(parseFloat(e.target.value))}
                    className="w-full accent-amber cursor-pointer"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => handleRunSimulation()}
              disabled={loading || (tab === 'prompt' && !text.trim())}
              className="mt-7 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-void" />
                  <span>Simulating Quantum Shifts…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run What-If Engine</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Results & Possibility Shift Visualization */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="font-display text-base font-bold text-mist">
                Modeled Possibility Distribution
              </h3>
              <Badge color={result ? (result.source === 'live' ? 'cyan' : 'amber') : 'mist'}>
                {result ? (result.source === 'live' ? 'LIVE MODEL' : 'LOCAL SIMULATOR') : 'BASELINE'}
              </Badge>
            </div>

            {/* Narrative explanation */}
            {result && (
              <div className="mb-6 p-4 rounded-2xl bg-void/70 border border-magenta/30 shadow-[0_0_20px_rgba(230,60,255,0.15)] animate-fadeUp">
                <p className="text-xs sm:text-sm text-mist leading-relaxed font-body">
                  {result.narrative}
                </p>
              </div>
            )}

            {/* Comparative Bars */}
            <div className="space-y-4">
              {displayedFutures
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((self) => {
                  const baselineScore = baseline.find((b) => b.id === self.id)?.score ?? self.score
                  const diff = self.score - baselineScore
                  return (
                    <div key={self.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: self.color }}
                          />
                          <span className="text-mist font-medium">{self.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {diff !== 0 && result && (
                            <span
                              className={`text-[10px] font-bold ${
                                diff > 0 ? 'text-mint' : 'text-coral'
                              }`}
                            >
                              {diff > 0 ? `+${diff}%` : `${diff}%`}
                            </span>
                          )}
                          <span className="font-bold" style={{ color: self.color }}>
                            {self.score}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar with Dual Tone */}
                      <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${self.score}%`,
                            background: `linear-gradient(90deg, ${self.color} 0%, #ffffff 100%)`,
                            boxShadow: `0 0 14px ${self.glow}`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>

            <p className="mt-8 font-mono text-[11px] text-mist-faint text-center">
              Modeled likelihoods from weighted behavioral scoring. Not an absolute prediction.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
