import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Radio, Sparkles } from 'lucide-react'
import UniverseCanvas from './3d/UniverseCanvas'
import HeroPlanet3D from './3d/HeroPlanet3D'
import Starfield3D from './3d/Starfield3D'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const anim = (delay: string) =>
    `transition-all duration-1000 ${delay} ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden">
      {/* 3D WebGL Background Scene */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <UniverseCanvas>
          <Starfield3D count={1400} />
          <HeroPlanet3D />
        </UniverseCanvas>
      </div>

      {/* Atmospheric Ambient Glows */}
      <div
        className="cosmic-nebula bottom-0 left-0 w-[55vw] h-[45vh] bg-magenta/15"
        aria-hidden
      />
      <div
        className="cosmic-nebula top-1/4 right-0 w-[45vw] h-[40vh] bg-cyan/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl text-center flex flex-col items-center">
        {/* Hackathon / Platform Tag */}
        <div className={anim('delay-100')}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-void-panel/80 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-magenta animate-pulse shadow-[0_0_8px_#e63cff]" />
            <span className="font-mono text-[11px] tracking-widest text-mist-muted uppercase">
              Reverie Hacks 2026 · Behavioral Simulation
            </span>
          </div>
        </div>

        {/* Ethereal Logo Display */}
        <div className={`mt-8 mb-4 relative ${anim('delay-200')}`}>
          <div className="animate-floatXY inline-block">
            <img
              src="/youverse-logo.png"
              alt="Youverse"
              className="h-28 sm:h-36 md:h-44 w-auto object-contain relative z-10 drop-shadow-[0_0_32px_rgba(230,60,255,0.6)]"
            />
          </div>
          {/* Ethereal Halo */}
          <div
            className="absolute inset-0 -z-10 scale-150 opacity-60 animate-glowPulse pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(230, 60, 255, 0.45), transparent 70%)',
              filter: 'blur(30px)',
            }}
            aria-hidden
          />
        </div>

        {/* Main Headline */}
        <h1 className={`font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-mist max-w-4xl ${anim('delay-300')}`}>
          Your present{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-mist to-magenta">
            shapes what comes next.
          </span>
        </h1>

        {/* Narrative Description */}
        <p className={`mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-mist-muted leading-relaxed ${anim('delay-400')}`}>
          Youverse turns behavioral and environmental signals into an interactive 3D universe of
          possible future selves. Not a deterministic prediction. Not a diagnosis. A living simulation
          of where your current trajectory leads.
        </p>

        {/* CTA Buttons */}
        <div className={`mt-9 flex flex-wrap items-center justify-center gap-4 ${anim('delay-500')}`}>
          <a href="#universe" className="btn-primary">
            <span>Explore Your Universe</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link to="/present" className="btn-secondary">
            <Radio className="w-4 h-4 text-cyan" />
            <span>How It Works</span>
          </Link>
          <a
            href="#what-if"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono text-mist-muted hover:text-mist transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-magenta" />
            <span>Simulation Chamber</span>
          </a>
        </div>

        {/* Live Metrics Pill */}
        <div className={`mt-12 flex items-center justify-center gap-8 sm:gap-14 pt-8 border-t border-white/[0.08] ${anim('delay-600')}`}>
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-mist">5</p>
            <p className="font-mono text-[11px] text-mist-muted mt-0.5">Sensors Tracked</p>
          </div>
          <div className="w-px h-8 bg-white/10" aria-hidden />
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan to-magenta">
              5
            </p>
            <p className="font-mono text-[11px] text-mist-muted mt-0.5">Future Selves</p>
          </div>
          <div className="w-px h-8 bg-white/10" aria-hidden />
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-mist">100%</p>
            <p className="font-mono text-[11px] text-mist-muted mt-0.5">Superposition</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#universe"
          className="mt-14 inline-flex flex-col items-center gap-2 text-mist-faint hover:text-mist transition-colors group"
          aria-label="Scroll to Universe"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">Travel Through Space</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan" />
        </a>
      </div>
    </section>
  )
}
