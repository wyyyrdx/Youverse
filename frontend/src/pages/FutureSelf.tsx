import { Link, useParams } from 'react-router-dom'
import { usePredictions } from '../hooks/usePredictions'
import { futureSelves as fallback } from '../data/futureSelves'

export default function FutureSelf() {
  const { id } = useParams<{ id: string }>()
  const { futureSelves } = usePredictions()
  const list = futureSelves.length ? futureSelves : fallback
  const self = list.find((f) => f.id === id) ?? list[0]

  if (!self) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-24">
        <p className="text-mist-muted">Unknown region.</p>
        <Link to="/" className="btn-float ml-4">
          Universe
        </Link>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen px-4 md:px-6 pt-28 pb-24 max-w-3xl mx-auto">
      <div
        className="absolute top-32 left-1/2 -translate-x-1/2 w-[400px] h-[280px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${self.glow}, transparent 70%)`,
          filter: 'blur(40px)',
          opacity: 0.5,
        }}
        aria-hidden
      />

      <Link to="/#universe" className="font-mono text-[10px] text-mist-faint hover:text-mist transition-colors">
        ← Universe
      </Link>

      <div className="mt-10 flex flex-col items-center text-center">
        <div
          className="h-32 w-32 md:h-40 md:w-40 rounded-full animate-floatY"
          style={{
            background: `radial-gradient(circle at 35% 28%, #fff, ${self.color})`,
            boxShadow: `0 0 60px 14px ${self.glow}`,
          }}
        />
        <h1 className="mt-8 font-display text-3xl md:text-4xl font-bold" style={{ color: self.color }}>
          {self.name}
        </h1>
        <p className="mt-2 font-mono text-sm text-mist-muted">{self.score}% modeled likelihood</p>
        <p className="mt-4 max-w-md text-sm text-mist-muted leading-relaxed">{self.description}</p>
      </div>

      <div className="mt-12 space-y-4">
        <div className="glass rounded-[20px] p-5">
          <h2 className="font-mono text-xs text-cyan">Why this state appears</h2>
          <p className="mt-2 text-sm text-mist-muted leading-relaxed">
            The model currently associates your signals with this state based on patterns in{' '}
            {self.signals.join(', ')}. These are environmental proxies, not direct measures of
            identity or mental health.
          </p>
        </div>

        <div className="glass rounded-[20px] p-5">
          <h2 className="font-mono text-xs text-cyan">Current alignment</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {self.signals.map((s) => (
              <span
                key={s}
                className="border border-white/10 rounded-full px-3 py-1 font-mono text-[11px] text-mist-muted"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${self.score}%`, background: self.color }}
            />
          </div>
        </div>

        <div className="glass rounded-[20px] p-5">
          <h2 className="font-mono text-xs text-cyan">Reflection</h2>
          <p className="mt-2 text-sm text-mist-muted">
            What in your current routine supports this direction?
          </p>
          <p className="mt-2 text-sm text-mist-muted">
            What could make this direction more likely?
          </p>
          <p className="mt-4 text-[11px] font-mono text-mist-faint">
            A model can show possibilities. It cannot tell you what will happen.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/" className="btn-float">
          Back to Universe
        </Link>
        <Link to="/what-if" className="btn-primary">
          Change one thing
        </Link>
      </div>
    </section>
  )
}
