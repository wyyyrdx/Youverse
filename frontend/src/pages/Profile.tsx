import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, Sparkles } from 'lucide-react'
import { usePredictions } from '../hooks/usePredictions'
import { getUserId } from '../utils/userId'
import MiniPlanet3D from '../components/3d/MiniPlanet3D'
import Badge from '../components/Badge'

export default function Profile() {
  const { futureSelves, lastCalculated } = usePredictions()
  const [alias, setAlias] = useState(() => localStorage.getItem('youverse_alias') || '')
  const [currentId] = useState(getUserId())
  const [copied, setCopied] = useState(false)

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveAlias = (val: string) => {
    setAlias(val)
    localStorage.setItem('youverse_alias', val)
  }

  return (
    <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-left mb-8">
        <Badge color="cyan">OBSERVATORY METRICS</Badge>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-mist tracking-tight">
          Personal Observatory
        </h1>
        <p className="mt-2 text-sm sm:text-base text-mist-muted leading-relaxed">
          Your session identity, active state distribution, and trajectory telemetry.
        </p>
      </div>

      {/* Identity Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        <div className="sm:col-span-4 flex flex-col items-center justify-center">
          <MiniPlanet3D color="#2fe4ff" glowColor="#e63cff" className="w-28 h-28" />
          <p className="mt-2 font-mono text-xs text-mist font-medium">
            {alias || 'Cosmic Traveler'}
          </p>
        </div>

        <div className="sm:col-span-8 space-y-4 text-left">
          <div>
            <label className="font-mono text-xs text-mist-muted block mb-1.5">
              Explorer Display Alias
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => handleSaveAlias(e.target.value)}
              placeholder="e.g. Architect of Tomorrow"
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-mist placeholder:text-mist-faint focus:border-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-mist-muted block mb-1.5">
              Unique Session ID (FastAPI User ID)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentId}
                readOnly
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-mist-muted select-all"
              />
              <button
                onClick={handleCopyId}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-mist-muted hover:text-mist transition-colors shrink-0"
                title="Copy Session ID"
              >
                {copied ? <Check className="w-4 h-4 text-mint" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Summary Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-8">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <h3 className="font-display text-base font-bold text-mist">
            Current Possibility Space Allocation
          </h3>
          <span className="font-mono text-xs text-mist-faint">
            {lastCalculated ? `Last synced: ${new Date(lastCalculated).toLocaleTimeString()}` : 'Real-time'}
          </span>
        </div>

        <div className="space-y-3.5">
          {futureSelves
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((self) => (
              <Link
                key={self.id}
                to={`/self/${self.id}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-void/50 hover:bg-white/5 border border-white/5 hover:border-white/15 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: self.color,
                      boxShadow: `0 0 8px ${self.glow}`,
                    }}
                  />
                  <div>
                    <span className="font-display text-sm font-semibold text-mist group-hover:text-white">
                      {self.name}
                    </span>
                    <span className="block font-mono text-[10px] text-mist-faint">
                      {self.signals.join(' · ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold" style={{ color: self.color }}>
                    {self.score}%
                  </span>
                  <span className="text-mist-faint group-hover:text-mist transition-colors">→</span>
                </div>
              </Link>
            ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link to="/" className="btn-secondary">
          ← Back to Universe
        </Link>
        <Link to="/what-if" className="btn-primary">
          <Sparkles className="w-4 h-4" />
          <span>Launch Simulation</span>
        </Link>
      </div>
    </section>
  )
}
