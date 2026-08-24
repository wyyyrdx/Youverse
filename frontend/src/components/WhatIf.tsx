import { useState } from 'react'
import { futureSelves as fallbackFutureSelves } from '../data/futureSelves'
import type { FutureSelf, WhatIfResult } from '../types'
import Badge from './Badge'
import { usePredictions } from '../hooks/usePredictions'
import { api, ApiError } from '../services/api'
import { getUserId } from '../utils/userId'
import { mergeWithLiveScores } from '../utils/mapFutureStates'

// Local fallback "model", used only if POST /api/what-if is unreachable or the request
// shape backend expects turns out to differ from what we're sending (see api.ts note).
// Keeps the interaction working end-to-end even before that contract is locked down.
function mockWhatIf(text: string, baseline: FutureSelf[]): WhatIfResult {
  const lower = text.toLowerCase()
  const nudges: Record<string, number> = {
    focused: 0,
    creative: 0,
    active: 0,
    consistent: 0,
    'burned-out': 0,
  }
  const bump = (id: string, amount: number) => (nudges[id] = (nudges[id] ?? 0) + amount)

  if (/sleep|rest|earlier|routine|consisten/.test(lower)) {
    bump('consistent', 14)
    bump('focused', 8)
    bump('burned-out', -12)
  }
  if (/move|walk|run|gym|exercise|active|workout/.test(lower)) {
    bump('active', 16)
    bump('burned-out', -6)
  }
  if (/focus|study|deep work|finish|project|deadline/.test(lower)) {
    bump('focused', 14)
    bump('creative', 4)
  }
  if (/paint|write|create|music|design|idea|art/.test(lower)) {
    bump('creative', 16)
  }
  if (/stress|tired|overwhelm|burnout|late night|no sleep/.test(lower)) {
    bump('burned-out', 14)
    bump('focused', -6)
  }
  if (text.trim().length === 0) {
    return {
      narrative: "Tell me what you're changing, and I'll show you where it moves the distribution.",
      updated: baseline.map((f) => ({ id: f.id, score: f.score })),
    }
  }

  const withNudges = baseline.map((f) => ({ id: f.id, raw: f.score + (nudges[f.id] ?? 0) }))
  const floor = withNudges.map((f) => ({ id: f.id, raw: Math.max(f.raw, 2) }))
  const total = floor.reduce((sum, f) => sum + f.raw, 0)
  const updated = floor.map((f) => ({ id: f.id, score: Math.round((f.raw / total) * 100) }))

  const drift = 100 - updated.reduce((s, f) => s + f.score, 0)
  updated[0].score += drift

  const winner = [...updated].sort((a, b) => b.score - a.score)[0]
  const winnerName = baseline.find((f) => f.id === winner.id)?.name ?? 'a future self'

  const narrative = `Read as behavior, that intention leans your signals toward stiller light, more regular motion, and less late-night noise. Modeled forward, it shifts the distribution — ${winnerName} moves to the front at ${winner.score}%. Nothing is fixed. This is what today's pattern would become if it kept going.`

  return { narrative, updated }
}

export default function WhatIf() {
  const { futureSelves: baseline } = usePredictions()
  const [text, setText] = useState('')
  const [result, setResult] = useState<WhatIfResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<'live' | 'local'>('local')

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.runWhatIf(getUserId(), text)
      const merged = mergeWithLiveScores(res.data)
      setResult({
        narrative:
          "Modeled against the real scoring engine: here's how that intention shifts your distribution.",
        updated: merged.map((f) => ({ id: f.id, score: f.score })),
      })
      setSource('live')
    } catch (err) {
      console.warn(
        'Youverse: /api/what-if unavailable, using local mock model —',
        err instanceof ApiError ? err.message : err,
      )
      // small delay so the local fallback still feels like a deliberate modeling pass
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      setResult(mockWhatIf(text, baseline.length ? baseline : fallbackFutureSelves))
      setSource('local')
    } finally {
      setLoading(false)
    }
  }

  const displayed: FutureSelf[] = (baseline.length ? baseline : fallbackFutureSelves).map((f) => {
    const updated = result?.updated.find((u) => u.id === f.id)
    return updated ? { ...f, score: updated.score } : f
  })

  return (
    <section id="what-if" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <Badge color="cyan">WHAT IF</Badge>
        <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold text-mist">
          Change one behavior. Watch the futures move.
        </h2>
        <p className="mt-4 text-sm md:text-base text-mist-muted leading-relaxed">
          Write what you're planning to change — sleeping earlier, moving more, finishing
          something you started. The model recalculates your distribution as if you'd already
          begun.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I want to sleep more, move daily, and finish my side project…"
          rows={4}
          className="w-full resize-none rounded-2xl border border-white/10 bg-void-panel/60 backdrop-blur-md px-5 py-4 text-sm md:text-base text-mist placeholder:text-mist-faint focus:border-cyan/60 focus:outline-none transition-colors duration-300"
        />

        <div className="mt-5 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-magenta to-cyan px-8 py-3 font-mono text-sm tracking-wide text-void font-medium transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? 'Modeling…' : 'See what happens'}
          </button>
        </div>

        {result && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-void-panel/50 backdrop-blur-md px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm md:text-base leading-relaxed text-mist/90">{result.narrative}</p>
              <span className="shrink-0 font-mono text-[9px] tracking-[0.2em] text-mist-faint">
                {source === 'live' ? 'LIVE MODEL' : 'LOCAL FALLBACK'}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {displayed
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((f) => (
                  <div key={f.id} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 font-mono text-xs text-mist-muted">
                      {f.name}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${f.score}%`,
                          background: `linear-gradient(90deg, ${f.color}, transparent)`,
                          boxShadow: `0 0 12px ${f.glow}`,
                        }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono text-xs" style={{ color: f.color }}>
                      {f.score}%
                    </span>
                  </div>
                ))}
            </div>

            <p className="mt-5 text-[11px] font-mono text-mist-faint">
              A modeled reaction to your text, not a promise about who you'll become.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
