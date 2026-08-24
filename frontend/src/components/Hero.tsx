import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const show = ready
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-4'

  return (
    <section className="relative min-h-screen flex items-center px-5 md:px-8 pt-24 pb-16 overflow-hidden">
      {/* soft violet wash bottom-left like ambient light */}
      <div
        className="absolute bottom-0 left-0 w-[60vw] h-[40vh] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(130, 70, 220, 0.18), transparent 65%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-end">
          {/* LEFT: content */}
          <div className="lg:col-span-7 text-left">
            <p
              className={`font-mono text-[11px] tracking-[0.25em] text-mist-muted uppercase transition-all duration-700 ${show}`}
            >
              Reverie Hacks 2026
            </p>

            <div
            className={`mt-8 mb-3 relative transition-all duration-1000 delay-100 ${show}`}
            >
              <div className="animate-floatXY animate-breathe inline-block">
                <img
                src="/youverse-logo.png"
                alt="Youverse"
                className="h-28 md:h-36 w-auto object-contain relative z-10 drop-shadow-[0_0_24px_rgba(180,80,255,0.55)]"
                />
                </div>
                {/* neon halo */}
                <div
                className="absolute inset-0 -z-0 scale-125 opacity-70 animate-glowPulse pointer-events-none"
                style={{
                  background:
                  'radial-gradient(ellipse at center, rgba(180, 70, 255, 0.4), transparent 65%)',
                  filter: 'blur(22px)',
                }}
                aria-hidden
                />
                </div>

            <h1 className={`font-display text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight text-mist transition-all duration-1000 delay-150 ${show}`}>
                Your present
             </h1>

             <h2 className={`mt-1 font-display text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight text-mist transition-all duration-1000 delay-200 ${show}`}>
                shapes what comes next.
              </h2>

            <p
              className={`mt-6 max-w-md text-sm md:text-base text-mist-muted leading-relaxed transition-all duration-1000 delay-300 ${show}`}
            >
              Youverse turns behavioral and environmental signals into an interactive map of
              possible future selves. Not a prediction. Not a diagnosis. A simulation of where
              your current patterns could lead.
            </p>

            <div
              className={`mt-9 flex flex-wrap items-center gap-3 transition-all duration-1000 delay-400 ${show}`}
            >
              <a
                href="#universe"
                className="inline-flex items-center gap-2 rounded-md bg-[#a78bfa] hover:bg-[#b8a0ff] text-[#0a0a0f] font-medium text-sm px-5 py-2.5 transition-colors duration-200"
              >
                Explore Your Universe
                <span aria-hidden>→</span>
              </a>
              <Link
                to="/present"
                className="inline-flex items-center rounded-md border border-white/15 hover:bg-white/5 text-mist text-sm px-5 py-2.5 transition-colors duration-200"
              >
                How It Works
              </Link>
              <a
                href="#what-if"
                className="text-sm text-mist-muted hover:text-mist transition-colors px-2"
              >
                What If
              </a>
            </div>

            <p
              className={`mt-6 font-mono text-[11px] text-mist-faint transition-all duration-1000 delay-500 ${show}`}
            >
              5 signals · 5 future selves · modeled, not measured
            </p>
          </div>

          {/* RIGHT: stats (Reverie-style) */}
          <div
            className={`lg:col-span-5 flex lg:justify-end transition-all duration-1000 delay-300 ${show}`}
          >
            <div className="flex gap-10 md:gap-14">
              <div>
                <p className="font-display text-3xl md:text-4xl text-mist">5</p>
                <p className="mt-1 text-xs text-mist-muted">Signals tracked</p>
              </div>
              <div className="w-px bg-white/10" aria-hidden />
              <div>
                <p className="font-display text-3xl md:text-4xl text-mist">5</p>
                <p className="mt-1 text-xs text-mist-muted">Future selves</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
