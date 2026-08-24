import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePredictions } from '../hooks/usePredictions'

const PIPELINE = [
  { label: 'Sensors', detail: 'Light, motion, noise, temperature, humidity' },
  { label: 'Signals', detail: 'Raw environmental and behavioral readings' },
  { label: 'Features', detail: 'Stability, activity rate, quiet scores' },
  { label: 'Current State', detail: 'Modeled distribution of future selves' },
]

export default function Present() {
  const { futureSelves, connection } = usePredictions()
  const [goal, setGoal] = useState('')
  const [blocker, setBlocker] = useState('')

  const top = [...futureSelves].sort((a, b) => b.score - a.score)[0]

  return (
    <section className="relative min-h-screen px-4 md:px-6 pt-28 pb-24 max-w-3xl mx-auto">
      <div className="atmosphere-glow opacity-25" aria-hidden />

      <p className="font-mono text-[10px] tracking-[0.3em] text-mist-faint">YOUR PRESENT</p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-mist">
        Start with where you are.
      </h1>
      <p className="mt-3 text-sm text-mist-muted max-w-lg">
        Your current state is the starting point. The model maps signals into a distribution of
        possible futures.
      </p>

      {/* present orb */}
      <div className="mt-12 flex flex-col items-center">
        <div
          className="h-28 w-28 rounded-full animate-floatY"
          style={{
            background: 'radial-gradient(circle at 32% 28%, #fff, #2fe4ff 40%, #e63cff)',
            boxShadow: '0 0 50px 12px rgba(47, 228, 255, 0.3)',
          }}
        />
        <p className="mt-4 font-mono text-xs text-mist-muted">
          {connection === 'live' ? 'Signals streaming' : 'Sample baseline'}
        </p>
        {top && (
          <p className="mt-1 text-sm text-mist/80">
            Closest modeled lean: <span style={{ color: top.color }}>{top.name}</span> ({top.score}%)
          </p>
        )}
      </div>

      {/* reflection inputs */}
      <div className="mt-14 space-y-6">
        <div className="glass rounded-[20px] p-5">
          <label className="block font-mono text-xs text-mist-muted mb-2">
            What are you trying to move toward?
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={2}
            placeholder="Describe a goal you genuinely care about…"
            className="w-full resize-none rounded-[12px] border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-mist placeholder:text-mist-faint focus:border-cyan/40 focus:outline-none"
          />
        </div>
        <div className="glass rounded-[20px] p-5">
          <label className="block font-mono text-xs text-mist-muted mb-2">
            What is currently standing between you and that goal?
          </label>
          <textarea
            value={blocker}
            onChange={(e) => setBlocker(e.target.value)}
            rows={2}
            placeholder="What keeps getting in the way?"
            className="w-full resize-none rounded-[12px] border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-mist placeholder:text-mist-faint focus:border-cyan/40 focus:outline-none"
          />
        </div>
      </div>

      {/* distribution snapshot */}
      <div className="mt-12 glass rounded-[20px] p-5">
        <h2 className="font-mono text-xs text-cyan mb-4">Current modeled distribution</h2>
        <div className="space-y-2.5">
          {[...futureSelves]
            .sort((a, b) => b.score - a.score)
            .map((f) => (
              <div key={f.id} className="flex items-center gap-3">
                <span className="w-28 font-mono text-xs text-mist-muted">{f.name}</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${f.score}%`, background: f.color }}
                  />
                </div>
                <span className="w-9 text-right font-mono text-xs" style={{ color: f.color }}>
                  {f.score}%
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* hardware pipeline */}
      <div className="mt-14">
        <h2 className="font-display text-xl text-mist">Your environment leaves signals.</h2>
        <p className="mt-2 text-sm text-mist-muted max-w-lg">
          The physical Youverse device collects environmental and behavioral signals that help
          build a picture of your current state.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-3">
          {PIPELINE.map((step, i) => (
            <div key={step.label} className="glass rounded-[16px] p-4 relative">
              <span className="font-mono text-[10px] text-magenta">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 font-mono text-sm text-mist">{step.label}</h3>
              <p className="mt-1 text-xs text-mist-muted leading-relaxed">{step.detail}</p>
              {i < PIPELINE.length - 1 && (
                <span className="hidden sm:block absolute -right-2 top-1/2 text-mist-faint text-xs">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/" className="btn-float">
          Back to Universe
        </Link>
        <Link to="/what-if" className="btn-primary">
          Run a What-If
        </Link>
      </div>
    </section>
  )
}
