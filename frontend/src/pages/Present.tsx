import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, RefreshCw } from 'lucide-react'
import { usePredictions } from '../hooks/usePredictions'
import SensorMonitor from '../components/SensorMonitor'
import SensorOrb3D from '../components/3d/SensorOrb3D'
import Badge from '../components/Badge'

const PIPELINE_STEPS = [
  { step: '01', title: 'Sensors', desc: 'LDR, PIR, Noise Pot, DHT11 sampling at 5-second cadence.' },
  { step: '02', title: 'Signals', desc: 'Raw environmental readings streamed over WiFi HTTPS.' },
  { step: '03', title: 'Features', desc: 'Extraction of light_stability, activity_score, quiet_score.' },
  { step: '04', title: 'Possibility', desc: 'Weighted scoring generates normalized distribution of 5 selves.' },
]

export default function Present() {
  const { futureSelves, isRefreshing, triggerCalculate } = usePredictions()
  const [goal, setGoal] = useState(() => localStorage.getItem('youverse_goal') || '')
  const [blocker, setBlocker] = useState(() => localStorage.getItem('youverse_blocker') || '')
  const [saved, setSaved] = useState(false)

  const topSelf = [...futureSelves].sort((a, b) => b.score - a.score)[0]

  useEffect(() => {
    localStorage.setItem('youverse_goal', goal)
    localStorage.setItem('youverse_blocker', blocker)
    if (goal || blocker) {
      setSaved(true)
      const t = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(t)
    }
  }, [goal, blocker])

  return (
    <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-left mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge color="cyan">OBSERVATION CHAMBER</Badge>
          <span className="font-mono text-xs text-mist-faint">Present Self Ground State</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-mist tracking-tight">
          Start with where you are.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-mist-muted leading-relaxed max-w-2xl">
          Your current environment and behaviors form the starting coordinates. The Youverse modeling
          engine translates sensor signals into a living superposition.
        </p>
      </div>

      {/* Present Core Orb & State Alignment */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center justify-center shrink-0">
          <SensorOrb3D motionActive={true} className="w-36 h-36" />
          <span className="mt-2 font-mono text-[11px] text-cyan">Present Ground State</span>
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold text-mist">
              Dominant State Lean:{' '}
              <span style={{ color: topSelf?.color }}>{topSelf?.name}</span>
            </h2>
            <span className="font-mono text-sm font-bold" style={{ color: topSelf?.color }}>
              {topSelf?.score}% Alignment
            </span>
          </div>

          <p className="mt-2 text-sm text-mist-muted leading-relaxed">
            Based on your recent signals in {topSelf?.signals.join(', ')}, your current behavioral
            trajectory is most strongly aligned toward <strong>{topSelf?.name}</strong>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => triggerCalculate()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan text-void text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Processing Sensor Window…' : 'Re-calculate Possibility Distribution'}</span>
            </button>
            <Link
              to={`/self/${topSelf?.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-mist-muted hover:text-mist"
            >
              <span>Examine {topSelf?.name} →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Section */}
      <div className="mb-8">
        <SensorMonitor />
      </div>

      {/* Reflection Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-xs text-cyan">
              What are you moving toward?
            </label>
            {saved && <span className="font-mono text-[10px] text-mint">Saved</span>}
          </div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            placeholder="Define a primary focus or creative milestone you are aiming for…"
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-mist placeholder:text-mist-faint focus:border-cyan focus:outline-none"
          />
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-xs text-magenta">
              What friction or blocker is in the way?
            </label>
            {saved && <span className="font-mono text-[10px] text-mint">Saved</span>}
          </div>
          <textarea
            value={blocker}
            onChange={(e) => setBlocker(e.target.value)}
            rows={3}
            placeholder="What distractions, fatigue, or inconsistencies are pulling you away?"
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-mist placeholder:text-mist-faint focus:border-magenta focus:outline-none"
          />
        </div>
      </div>

      {/* Data Pipeline Flowchart */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-8">
        <h3 className="font-display text-lg font-bold text-mist mb-2">
          End-to-End Behavioral Simulation Pipeline
        </h3>
        <p className="text-xs text-mist-muted leading-relaxed mb-6">
          How physical environmental signals travel from your desk through AI feature extraction to your possibility space.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((step) => (
            <div key={step.step} className="p-4 rounded-2xl bg-void/60 border border-white/5 relative">
              <span className="font-mono text-xs font-bold text-magenta">{step.step}</span>
              <h4 className="font-display text-sm font-bold text-mist mt-1">{step.title}</h4>
              <p className="text-xs text-mist-muted mt-1 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="btn-secondary">
          <span>← Return to Universe</span>
        </Link>
        <Link to="/what-if" className="btn-primary">
          <Sparkles className="w-4 h-4" />
          <span>Simulate Habit Change in What-If</span>
        </Link>
      </div>
    </section>
  )
}
