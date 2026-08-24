import { useState } from 'react'
import { futureSelves as fallbackFutureSelves } from '../data/futureSelves'
import type { FutureSelf, WhatIfResult } from '../types'
import { usePredictions } from '../hooks/usePredictions'
import { api, ApiError } from '../services/api'
import { getUserId } from '../utils/userId'
import { mergeWithLiveScores } from '../utils/mapFutureStates'

function mockWhatIf(text: string, baseline: FutureSelf[]): WhatIfResult {
  const lower = text.toLowerCase()
  const nudges: Record<string, number> = {
    focused: 0,
    creative: 0,
    active: 0,
    consistent: 0,
    'burned-out': 0,
  }
  const bump = (id: string, amount: number) => {
    nudges[id] = (nudges[id] ?? 0) + amount
  }

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
      narrative: 'Describe one change. The model will shift the possibility space.',
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

  const narrative = `The model reads that intention as a shift in light, motion, and noise patterns. ${winnerName} moves forward to ${winner.score}%. Nothing is fixed. This is what the current pattern becomes if it continues.`

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
          'Modeled against the scoring engine. Here is how that intention shifts your distribution.',
        updated: merged.map((f) => ({ id: f.id, score: f.score })),
      })
      setSource('live')
    } catch (err) {
      console.warn(
        'Youverse: /api/what-if unavailable, using local mock -',
        err instanceof ApiError ? err.message : err,
      )
      await new Promise((r) => window.setTimeout(r, 600))
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
    <section id="what-if" className="relative px-4 md:px-6 py-24 md:py-32">
      <div className="atmosphere-glow opacity-30" aria-hidden />

      <div className="mx-auto max-w-xl text-left">
        <p className="font-mono text-[10px] tracking-[0.3em] text-mist-faint mb-3">SIMULATION CHAMBER</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-mist">
          What if you changed one thing?
        </h2>
        <p className="mt-4 text-sm md:text-base text-mist-muted leading-relaxed">
          Change a modeled input and watch the possibility space respond.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl">
        <div className="glass-strong rounded-[24px] p-5 md:p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I want to sleep earlier, move daily, and finish my side project…"
            rows={4}
            className="w-full resize-none rounded-[16px] border border-white/10 bg-black/30 px-4 py-3 text-sm text-mist placeholder:text-mist-faint focus:border-magenta/40 focus:outline-none transition-colors duration-300"
          />

          <div className="mt-5 flex justify-center">
            <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? 'Recalculating…' : 'Run simulation'}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 glass rounded-[24px] px-5 py-6 transition-all duration-700 ease-out">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm leading-relaxed text-mist/90">{result.narrative}</p>
              <span className="shrink-0 font-mono text-[9px] tracking-wide text-mist-faint">
                {source === 'live' ? 'LIVE MODEL' : 'LOCAL FALLBACK'}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {displayed
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3"
                    style={{
                      animation: `fadeBar 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s both`,
                    }}
                  >
                    <span className="w-28 shrink-0 font-mono text-xs text-mist-muted">{f.name}</span>
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
              A modeled reaction to your text. Not a promise about who you will become.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeBar {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
