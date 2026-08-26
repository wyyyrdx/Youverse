import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Target, Activity, CheckCircle2 } from 'lucide-react'
import { usePredictions } from '../hooks/usePredictions'
import { futureSelves as fallbackSelves } from '../data/futureSelves'
import MiniPlanet3D from '../components/3d/MiniPlanet3D'
import Badge from '../components/Badge'

export default function FutureSelf() {
  const { id } = useParams<{ id: string }>()
  const { futureSelves } = usePredictions()
  const list = futureSelves.length > 0 ? futureSelves : fallbackSelves
  const self = list.find((f) => f.id === id) || list[0]

  if (!self) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center">
        <p className="text-mist-muted">Future self trajectory not found.</p>
        <Link to="/" className="btn-primary mt-4">
          Return to Universe
        </Link>
      </div>
    )
  }

  return (
    <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-24 max-w-4xl mx-auto">
      {/* Background glow in self color */}
      <div
        className="cosmic-nebula top-24 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh]"
        style={{ backgroundColor: `${self.color}15` }}
        aria-hidden
      />

      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-mist-muted hover:text-mist transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Universe</span>
        </Link>
      </div>

      {/* Hero Card with 3D MiniPlanet */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 text-center flex flex-col items-center mb-8">
        <MiniPlanet3D color={self.color} glowColor={self.glow} />

        <div className="mt-4">
          <Badge color="cyan">{self.score}% MODELED LIKELIHOOD</Badge>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: self.color }}>
            {self.name}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-mist-muted leading-relaxed max-w-xl mx-auto">
            {self.description}
          </p>
        </div>

        {/* Alignment Gauge */}
        <div className="mt-8 w-full max-w-md">
          <div className="flex justify-between font-mono text-xs text-mist-muted mb-1.5">
            <span>Possibility Space Share</span>
            <span className="font-bold" style={{ color: self.color }}>
              {self.score}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/5 p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${self.score}%`,
                background: `linear-gradient(90deg, ${self.color}, #ffffff)`,
                boxShadow: `0 0 16px ${self.glow}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Behavioral Characteristics */}
        <div className="glass-card rounded-3xl p-6 border border-white/10">
          <h3 className="font-display text-base font-bold text-mist mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan" />
            <span>Behavioral Signatures</span>
          </h3>
          <ul className="space-y-2.5">
            {self.characteristics.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-mist-muted leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Nudges */}
        <div className="glass-card rounded-3xl p-6 border border-white/10">
          <h3 className="font-display text-base font-bold text-mist mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-magenta" />
            <span>Actionable Habit Nudges</span>
          </h3>
          <ul className="space-y-2.5">
            {self.nudges.map((nudge, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-mist-muted leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-magenta/20 text-magenta font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                <span>{nudge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reflection Prompts */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-8">
        <h3 className="font-display text-base font-bold text-mist mb-4">
          Self-Reflection Inquiries for {self.name}
        </h3>
        <div className="space-y-3">
          {self.reflectionPrompts.map((p, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-void/60 border border-white/5 text-xs text-mist-muted leading-relaxed">
              <span className="font-mono text-cyan mr-2 font-bold">Q{i + 1}:</span>
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="btn-secondary">
          <span>← Universe Overview</span>
        </Link>
        <Link to="/what-if" className="btn-primary">
          <Sparkles className="w-4 h-4" />
          <span>Simulate Shifts Toward {self.name}</span>
        </Link>
      </div>
    </section>
  )
}
