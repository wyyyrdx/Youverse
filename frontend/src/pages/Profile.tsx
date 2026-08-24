import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePredictions } from '../hooks/usePredictions'
import { getUserId } from '../utils/userId'

export default function Profile() {
  const { futureSelves, connection } = usePredictions()
  const [name, setName] = useState('')
  const userId = getUserId()
  const top = [...futureSelves].sort((a, b) => b.score - a.score).slice(0, 3)

  return (
    <section className="relative min-h-screen px-4 md:px-6 pt-28 pb-24 max-w-3xl mx-auto">
      <div className="atmosphere-glow opacity-20" aria-hidden />

      <p className="font-mono text-[10px] tracking-[0.3em] text-mist-faint">OBSERVATORY</p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-mist">Your Universe</h1>
      <p className="mt-2 text-sm text-mist-muted">
        A personal view of your modeled state. Not a social profile.
      </p>

      {/* orbital mini viz */}
      <div className="mt-12 relative mx-auto h-56 flex items-center justify-center">
        <div
          className="h-16 w-16 rounded-full animate-floatY z-10"
          style={{
            background: 'radial-gradient(circle at 32% 28%, #fff, #2fe4ff 45%, #e63cff)',
            boxShadow: '0 0 36px 8px rgba(47, 228, 255, 0.3)',
          }}
        />
        {top.map((f, i) => {
          const angle = (i / top.length) * 360
          const r = 90 + i * 12
          return (
            <div
              key={f.id}
              className="absolute h-6 w-6 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, #fff, ${f.color})`,
                boxShadow: `0 0 12px ${f.glow}`,
                transform: `rotate(${angle}deg) translateX(${r}px) rotate(-${angle}deg)`,
              }}
              title={f.name}
            />
          )
        })}
        <div className="absolute inset-8 rounded-full border border-white/5" aria-hidden />
        <div className="absolute inset-0 rounded-full border border-white/[0.03]" aria-hidden />
      </div>

      <div className="mt-4 text-center">
        <p className="font-mono text-xs text-mist-muted">
          Session id · {userId.slice(0, 18)}…
        </p>
        <p className="font-mono text-[10px] text-mist-faint mt-1">
          {connection === 'live' ? 'Connected' : 'Offline sample'}
        </p>
      </div>

      {/* name */}
      <div className="mt-12 glass rounded-[20px] p-5">
        <label className="block font-mono text-xs text-mist-muted mb-2">Display name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional"
          className="w-full rounded-[12px] border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-mist placeholder:text-mist-faint focus:border-cyan/40 focus:outline-none"
        />
      </div>

      {/* distribution */}
      <div className="mt-6 glass rounded-[20px] p-5">
        <h2 className="font-mono text-xs text-cyan mb-4">Future Self distribution</h2>
        <div className="space-y-2.5">
          {[...futureSelves]
            .sort((a, b) => b.score - a.score)
            .map((f) => (
              <Link
                key={f.id}
                to={`/self/${f.id}`}
                className="flex items-center gap-3 group"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: f.color, boxShadow: `0 0 8px ${f.glow}` }}
                />
                <span className="w-28 font-mono text-xs text-mist-muted group-hover:text-mist transition-colors">
                  {f.name}
                </span>
                <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${f.score}%`, background: f.color }}
                  />
                </div>
                <span className="w-9 text-right font-mono text-xs" style={{ color: f.color }}>
                  {f.score}%
                </span>
              </Link>
            ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass rounded-[20px] p-5">
          <h3 className="font-mono text-xs text-mist-muted">Goals</h3>
          <p className="mt-2 text-sm text-mist-faint">
            No saved goals yet. Reflect from the Present page.
          </p>
        </div>
        <div className="glass rounded-[20px] p-5">
          <h3 className="font-mono text-xs text-mist-muted">Exploration history</h3>
          <p className="mt-2 text-sm text-mist-faint">
            What-If runs will appear here once stored by the backend.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Link to="/" className="btn-float">
          Return to Universe
        </Link>
      </div>
    </section>
  )
}
