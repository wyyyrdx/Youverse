import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePredictions } from '../hooks/usePredictions'
import type { FutureSelf } from '../types'

export default function Galaxy() {
  const { futureSelves, connection, isSimulated } = usePredictions()
  const [activeId, setActiveId] = useState<string | null>(null)
  const navigate = useNavigate()
  const active = futureSelves.find((f) => f.id === activeId) ?? null

  const goToSelf = (f: FutureSelf) => {
    setActiveId(f.id)
    window.setTimeout(() => navigate(`/self/${f.id}`), 380)
  }

  return (
    <section id="universe" className="relative px-4 md:px-6 py-24 md:py-32">
      <div className="atmosphere-glow opacity-40" aria-hidden />

      <div className="mx-auto max-w-6xl text-left mb-14 px-1">
        <p className="font-mono text-[10px] tracking-[0.3em] text-mist-faint mb-3">THE SUPERPOSITION</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-mist">
          A living map of possible selves
        </h2>
        <p className="mt-4 text-sm md:text-base text-mist-muted leading-relaxed max-w-xl">
          The core is your present. Each orbiting body is a modeled future self. Hover to inspect.
          Click to enter that region of the possibility space.
        </p>
        <div className="mt-4 flex justify-start">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] text-mist-faint">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connection === 'live' ? 'bg-cyan animate-glowPulse' : 'bg-mist-faint'
              }`}
            />
            {connection === 'loading' && 'Connecting…'}
            {connection === 'live' && (isSimulated ? 'Live · simulated data' : 'Live · real sensor data')}
            {connection === 'offline' && 'Offline · sample data'}
          </span>
        </div>
      </div>

      <div className="relative mx-auto flex h-[520px] md:h-[760px] max-w-full items-center justify-center">
        {/* orbit rings */}
        {futureSelves.map((f) => (
          <div
            key={`ring-${f.id}`}
            className="absolute rounded-full border border-white/[0.05]"
            style={{
              width: `calc(2 * clamp(48px, ${(f.orbitRadius / 420) * 34}vw, ${f.orbitRadius}px))`,
              height: `calc(2 * clamp(48px, ${(f.orbitRadius / 420) * 34}vw, ${f.orbitRadius}px))`,
            }}
            aria-hidden
          />
        ))}

        {/* Present core */}
        <button
          onClick={() => navigate('/present')}
          className="absolute z-20 flex flex-col items-center justify-center group focus:outline-none"
          aria-label="Your Present"
        >
          <div
            className="h-16 w-16 md:h-[4.5rem] md:w-[4.5rem] rounded-full transition-transform duration-500 group-hover:scale-110 animate-floatY"
            style={{
              background: 'radial-gradient(circle at 32% 28%, #fff, #2fe4ff 38%, #e63cff 85%)',
              boxShadow: '0 0 40px 8px rgba(47, 228, 255, 0.35), 0 0 80px 16px rgba(230, 60, 255, 0.2)',
            }}
          />
          <span className="mt-3 font-mono text-[10px] tracking-wide text-mist-muted group-hover:text-mist transition-colors">
            Your Present
          </span>
        </button>

        {/* orbiting future selves */}
        {futureSelves.map((f) => (
          <div
            key={f.id}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              animation: `orbitSpin ${f.orbitDuration}s linear infinite`,
              animationDelay: `-${(f.orbitOffset / 360) * f.orbitDuration}s`,
            }}
          >
            <div
              className="pointer-events-auto"
              style={{
                transform: `translateX(clamp(48px, ${(f.orbitRadius / 420) * 34}vw, ${f.orbitRadius}px))`,
              }}
            >
              <button
                onMouseEnter={() => setActiveId(f.id)}
                onFocus={() => setActiveId(f.id)}
                onClick={() => goToSelf(f)}
                style={{
                  animation: `orbitSpinRev ${f.orbitDuration}s linear infinite`,
                  animationDelay: `-${(f.orbitOffset / 360) * f.orbitDuration}s`,
                }}
                className="group relative flex flex-col items-center focus:outline-none"
                aria-label={`${f.name}, ${f.score} percent`}
              >
                <span
                  className="block h-8 w-8 md:h-10 md:w-10 rounded-full transition-all duration-400 group-hover:scale-125"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #fff, ${f.color})`,
                    boxShadow:
                      activeId === f.id
                        ? `0 0 28px 6px ${f.glow}`
                        : `0 0 16px 3px ${f.glow}`,
                  }}
                />
                <span
                  className="mt-2 whitespace-nowrap font-mono text-[9px] md:text-[10px] transition-all duration-300"
                  style={{
                    color: f.color,
                    opacity: activeId === f.id ? 1 : 0.45,
                  }}
                >
                  {f.name} · {f.score}%
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* detail panel */}
      <div
        className={`mx-auto mt-8 max-w-md glass rounded-[20px] px-5 py-4 text-left transition-all duration-500 ${
          active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        {active && (
          <>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-base" style={{ color: active.color }}>
                {active.name}
              </h3>
              <span className="font-mono text-sm text-mist-muted">{active.score}%</span>
            </div>
            <p className="mt-2 text-sm text-mist-muted leading-relaxed">{active.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {active.signals.map((s) => (
                <span
                  key={s}
                  className="border border-white/10 px-2 py-0.5 font-mono text-[10px] text-mist-faint rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
            <button
              onClick={() => goToSelf(active)}
              className="mt-4 text-xs font-mono text-cyan hover:text-mist transition-colors"
            >
              Enter this region →
            </button>
          </>
        )}
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-[11px] text-mist-faint font-mono">
        Modeled likelihoods from behavioral signals. Not a measurement or a guarantee.
      </p>

      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitSpinRev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  )
}
