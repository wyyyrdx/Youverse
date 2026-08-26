import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Sparkles, Layers, Activity, TrendingUp, SunMedium, Target, BookOpen, Lock, type LucideIcon } from 'lucide-react'
import { DISCOVERIES_CATALOG } from '../data/discoveries'
import Badge from '../components/Badge'

const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  Sparkles,
  Layers,
  Activity,
  TrendingUp,
  SunMedium,
  Target,
  BookOpen,
}

export default function Discoveries() {
  const [discoveries] = useState(DISCOVERIES_CATALOG)
  const unlockedCount = discoveries.filter((d) => d.unlocked).length

  return (
    <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-left mb-8">
        <Badge color="mint">MILESTONES & COORDINATES</Badge>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-mist tracking-tight">
          Exploration Coordinates
        </h1>
        <p className="mt-2 text-sm sm:text-base text-mist-muted leading-relaxed">
          Markers earned while cartographing your personal possibility space.
        </p>

        {/* Progress Bar */}
        <div className="mt-6 glass rounded-2xl p-4 border border-white/10 max-w-md">
          <div className="flex justify-between font-mono text-xs text-mist-muted mb-2">
            <span>Milestones Discovered</span>
            <span className="text-mint font-bold">
              {unlockedCount} / {discoveries.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-mint transition-all duration-700"
              style={{ width: `${(unlockedCount / discoveries.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Discoveries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {discoveries.map((d) => {
          const Icon = ICON_MAP[d.iconName] || Compass
          return (
            <div
              key={d.id}
              className={`glass-card rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                d.unlocked
                  ? 'border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                  : 'border-white/5 opacity-50'
              }`}
              style={{
                boxShadow: d.unlocked ? `0 0 24px ${d.color}15` : undefined,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: d.unlocked ? `${d.color}20` : 'rgba(255,255,255,0.05)',
                      color: d.unlocked ? d.color : '#8b87a3',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-mist-faint">
                    {d.category}
                  </span>
                </div>

                <h3 className="font-display text-sm font-bold text-mist">{d.name}</h3>
                <p className="mt-2 text-xs text-mist-muted leading-relaxed">{d.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                <span className={d.unlocked ? 'text-mint font-bold' : 'text-mist-faint'}>
                  {d.unlocked ? 'Unlocked' : 'Uncharted'}
                </span>
                {!d.unlocked && <Lock className="w-3 h-3 text-mist-faint" />}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-start">
        <Link to="/" className="btn-secondary">
          ← Return to Universe
        </Link>
      </div>
    </section>
  )
}
