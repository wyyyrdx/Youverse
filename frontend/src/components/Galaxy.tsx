import { useState } from 'react'
import Badge from './Badge'
import { usePredictions } from '../hooks/usePredictions'

export default function Galaxy() {
  const { futureSelves, connection, isSimulated } = usePredictions()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = futureSelves.find((f) => f.id === activeId) ?? null

  return (
    <section id="galaxy" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <Badge>THE SUPERPOSITION</Badge>
        <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold text-mist">
          A tiny universe, orbiting who you might become
        </h2>
        <p className="mt-4 text-sm md:text-base text-mist-muted leading-relaxed">
          The glowing core is your present state. Each orbiting self is a possible future, modeled
          from what your environment is telling us right now. Hover or tap one to look closer.
        </p>
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-mist-faint">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connection === 'live' ? 'bg-cyan animate-twinkle' : 'bg-mist-faint'
              }`}
            />
            {connection === 'loading' && 'CONNECTING TO YOUVERSE…'}
            {connection === 'live' && (isSimulated ? 'LIVE · SIMULATED DATA' : 'LIVE · REAL SENSOR DATA')}
            {connection === 'offline' && 'OFFLINE · SHOWING SAMPLE DATA'}
          </span>
        </div>
      </div>

      <div className="relative mx-auto flex h-[560px] md:h-[820px] max-w-full items-center justify-center">
        {/* orbit rings */}
        {futureSelves.map((f) => (
          <div
            key={`ring-${f.id}`}
            className="absolute rounded-full border border-white/[0.06]"
            style={{
              width: `calc(2 * clamp(46px, ${(f.orbitRadius / 420) * 34}vw, ${f.orbitRadius}px))`,
              height: `calc(2 * clamp(46px, ${(f.orbitRadius / 420) * 34}vw, ${f.orbitRadius}px))`,
            }}
            aria-hidden
          />
        ))}

        {/* core = present self */}
        <div className="absolute z-20 flex flex-col items-center justify-center">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-mist via-cyan to-magenta shadow-glowCyan animate-drift" />
          <span className="mt-3 font-mono text-[10px] md:text-xs tracking-[0.25em] text-mist-muted">
            PRESENT YOU
          </span>
        </div>

        {/* orbiting future selves */}
        {futureSelves.map((f) => (
          <div
            key={f.id}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: `spin ${f.orbitDuration}s linear infinite`,
              animationDelay: `-${(f.orbitOffset / 360) * f.orbitDuration}s`,
            }}
          >
            <div
              style={{
                transform: `translateX(clamp(46px, ${(f.orbitRadius / 420) * 34}vw, ${f.orbitRadius}px))`,
              }}
            >
              <button
                onMouseEnter={() => setActiveId(f.id)}
                onFocus={() => setActiveId(f.id)}
                onClick={() => setActiveId(f.id)}
                style={{
                  animation: `spin-reverse ${f.orbitDuration}s linear infinite`,
                  animationDelay: `-${(f.orbitOffset / 360) * f.orbitDuration}s`,
                }}
                className="group relative flex flex-col items-center focus:outline-none"
                aria-label={`${f.name}, ${f.score} percent`}
              >
                <span
                  className="block h-8 w-8 md:h-10 md:w-10 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #fff, ${f.color})`,
                    boxShadow: `0 0 22px 4px ${f.glow}`,
                  }}
                />
                <span
                  className="mt-2 whitespace-nowrap font-mono text-[9px] md:text-[10px] tracking-wide transition-opacity duration-300"
                  style={{ color: f.color, opacity: activeId === f.id ? 1 : 0.55 }}
                >
                  {f.name} · {f.score}%
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* floating detail panel */}
      <div
        className={`mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-void-panel/70 backdrop-blur-md px-6 py-5 text-left transition-all duration-300 will-change-transform ${
          active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        style={{ boxShadow: active ? `0 0 40px ${active.glow}` : undefined }}
        role="status"
        aria-live="polite"
      >
        {active && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg tracking-wide" style={{ color: active.color }}>
                {active.name}
              </h3>
              <span className="font-mono text-sm text-mist-muted">{active.score}%</span>
            </div>
            <p className="mt-2 text-sm text-mist-muted leading-relaxed">{active.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.signals.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-mist-faint"
                >
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-[11px] text-mist-faint font-mono">
        Modeled likelihoods from behavioral signals — not a measurement or a guarantee.
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  )
}
