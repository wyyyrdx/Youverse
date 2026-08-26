import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, RefreshCw, Compass } from 'lucide-react'
import UniverseCanvas from './3d/UniverseCanvas'
import Superposition3D from './3d/Superposition3D'
import Starfield3D from './3d/Starfield3D'
import { usePredictions } from '../hooks/usePredictions'
import { useSoundEffects } from '../hooks/useSoundEffects'
import type { FutureSelf } from '../types'
import Badge from './Badge'

export default function Galaxy() {
  const { futureSelves, connection, isSimulated, isRefreshing, triggerCalculate } = usePredictions()
  const [activeId, setActiveId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { playHoverTone, playQuantumPulse } = useSoundEffects()

  const activeSelf = futureSelves.find((f) => f.id === activeId) ?? null

  const handleSelectSelf = (self: FutureSelf) => {
    setActiveId(self.id)
    playQuantumPulse()
    setTimeout(() => {
      navigate(`/self/${self.id}`)
    }, 450)
  }

  const handleSelectPresent = () => {
    playQuantumPulse()
    navigate('/present')
  }

  return (
    <section id="universe" className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col justify-center">
      {/* Background Ambience */}
      <div
        className="cosmic-nebula top-1/3 left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] bg-cyan/10"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="text-left max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Badge color="cyan">THE SUPERPOSITION</Badge>
              <span className="font-mono text-[11px] text-mist-faint">
                {connection === 'live'
                  ? isSimulated
                    ? 'Connected (Simulated stream)'
                    : 'Connected (Live ESP32 stream)'
                  : 'Predictive Baseline Engine'}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-mist tracking-tight">
              A living map of possible selves
            </h2>
            <p className="mt-4 text-sm sm:text-base text-mist-muted leading-relaxed">
              At the center sits your <strong>Present Self</strong>. Orbiting around it are 5 modeled
              future trajectories. Hover to inspect orbital characteristics. Click any node to enter that
              region of the possibility space.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerCalculate()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-mist hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan' : ''}`} />
              <span>{isRefreshing ? 'Recalculating…' : 'Sync Model'}</span>
            </button>
          </div>
        </div>

        {/* 3D Superposition Canvas */}
        <div className="relative w-full h-[540px] sm:h-[620px] md:h-[720px] rounded-3xl border border-white/[0.08] bg-void-card/60 backdrop-blur-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
          <UniverseCanvas>
            <Starfield3D count={1000} />
            <Superposition3D
              futureSelves={futureSelves}
              activeId={activeId}
              onHoverNode={(id) => {
                setActiveId(id)
                if (id) playHoverTone(id === 'present' ? 440 : 540)
              }}
              onSelectNode={handleSelectSelf}
              onSelectPresent={handleSelectPresent}
            />
          </UniverseCanvas>

          {/* Top-Right Quick Selector Bar */}
          <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-1.5 max-w-xs justify-end">
            {futureSelves.map((f) => (
              <button
                key={`btn-${f.id}`}
                onClick={() => handleSelectSelf(f)}
                onMouseEnter={() => {
                  setActiveId(f.id)
                  playHoverTone(500)
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all duration-300 backdrop-blur-md border ${
                  activeId === f.id
                    ? 'bg-void-panel border-white/40 shadow-lg scale-105'
                    : 'bg-void/60 border-white/10 text-mist-muted hover:text-mist hover:bg-white/10'
                }`}
                style={{
                  color: activeId === f.id ? f.color : undefined,
                  boxShadow: activeId === f.id ? `0 0 12px ${f.glow}` : 'none',
                }}
              >
                {f.name.split(' ')[0]} · {f.score}%
              </button>
            ))}
          </div>

          {/* Bottom Interactive Inspector Overlay */}
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-20">
            <div className="glass-card rounded-2xl p-5 border border-white/15 backdrop-blur-2xl shadow-2xl transition-all duration-300">
              {activeSelf ? (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: activeSelf.color,
                          boxShadow: `0 0 10px ${activeSelf.color}`,
                        }}
                      />
                      <h3
                        className="font-display text-lg font-bold"
                        style={{ color: activeSelf.color }}
                      >
                        {activeSelf.name}
                      </h3>
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: activeSelf.color }}>
                      {activeSelf.score}% modeled
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs text-mist-muted leading-relaxed">
                    {activeSelf.description}
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-mist-faint mr-1">Signals:</span>
                    {activeSelf.signals.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 font-mono text-[10px] text-mist-muted uppercase"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectSelf(activeSelf)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-mist transition-colors border border-white/10"
                  >
                    <span>Enter {activeSelf.name} Possibility Space</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                  </button>
                </div>
              ) : (
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan animate-pulse" />
                    <h3 className="font-display text-sm font-bold text-mist">
                      Possibility Space Inspector
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-mist-muted leading-relaxed">
                    Hover over any planet node to inspect its trajectory and signal attributions, or click the center to examine your Present Self.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={handleSelectPresent}
                      className="text-xs font-mono text-cyan hover:underline"
                    >
                      Examine Present Core →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
