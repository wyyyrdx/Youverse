import Badge from './Badge'

const STEPS = [
  {
    label: 'Sense',
    detail: 'A small ESP32 device reads light, motion, noise, and temperature around you.',
    color: '#2fe4ff',
  },
  {
    label: 'Model',
    detail: 'Those signals become behavioral features, then modeled future-state likelihoods.',
    color: '#e63cff',
  },
  {
    label: 'See',
    detail: 'Your possible futures appear side by side, in one living view you can question.',
    color: '#7bffb0',
  },
]

const STATS = [
  { value: '5', label: 'Signals tracked' },
  { value: '5', label: 'Future selves modeled' },
  { value: '100%', label: 'Distribution, always' },
]

const PREVIEW_SELVES = [
  { name: 'Focused You', score: 40, color: '#2fe4ff' },
  { name: 'Creative You', score: 23, color: '#e63cff' },
  { name: 'Active You', score: 18, color: '#7bffb0' },
]

export default function Hero() {
  const scrollToGalaxy = () => {
    document.getElementById('galaxy')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <Badge>YOU ARE HERE</Badge>

      <h1 className="mt-7 font-display text-5xl md:text-7xl font-black tracking-wide text-mist">
        YOUVERSE
      </h1>

      <p className="mt-6 max-w-xl font-body text-lg md:text-xl text-mist/90 italic">
        Your body is already writing the story of your future.
      </p>

      <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-mist-muted">
        A small device reads the room you're in. Youverse turns those signals into a set of
        possible future selves, modeled side by side, so you can see which one your present
        moment is leaning toward.
      </p>

      <button
        onClick={scrollToGalaxy}
        className="mt-10 group relative rounded-full bg-gradient-to-r from-magenta to-cyan px-8 py-3 font-mono text-sm tracking-wide text-void font-medium transition-transform duration-300 hover:scale-105"
      >
        Explore your futures
        <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-1">
          &darr;
        </span>
      </button>

      {/* floating glass hero visual — a live preview of the galaxy card */}
      <div className="relative mt-16 w-full max-w-lg">
        <div
          className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-magenta/10 via-transparent to-cyan/10 blur-2xl"
          aria-hidden
        />
        <div className="relative rounded-3xl border border-white/10 bg-void-panel/60 backdrop-blur-xl px-6 py-6 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.25em] text-mist-faint">
              LIVE DISTRIBUTION
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-mist-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-twinkle" />
              simulated
            </span>
          </div>
          <div className="mt-5 space-y-3 text-left">
            {PREVIEW_SELVES.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
                />
                <span className="w-24 shrink-0 font-mono text-xs text-mist-muted">{s.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.score}%`, background: s.color }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-xs" style={{ color: s.color }}>
                  {s.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* stat bar */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="font-display text-2xl md:text-3xl text-mist">{s.value}</span>
            <span className="mt-1 font-mono text-[10px] tracking-[0.2em] text-mist-faint">
              {s.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Sense / Model / See card grid */}
      <div className="mt-16 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
          >
            <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: step.color }}>
              0{i + 1} · {step.label.toUpperCase()}
            </span>
            <p className="mt-2 text-xs leading-relaxed text-mist-muted">{step.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
