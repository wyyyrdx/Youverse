import { useState } from 'react'
import Badge from '../components/Badge'

const AVATARS = [
  { id: 'orb-magenta', label: 'Nova', color: '#e63cff' },
  { id: 'orb-cyan', label: 'Vega', color: '#2fe4ff' },
]

export default function Profile() {
  const [selected, setSelected] = useState(AVATARS[0].id)
  const avatar = AVATARS.find((a) => a.id === selected)!

  return (
    <section className="min-h-screen px-6 pt-32 pb-24 max-w-2xl mx-auto">
      <Badge>PROFILE</Badge>
      <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold text-mist">Your signal</h1>

      <div className="mt-10 flex flex-col items-center">
        <div
          className="h-28 w-28 rounded-full transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 35% 30%, #fff, ${avatar.color})`,
            boxShadow: `0 0 60px 10px ${avatar.color}55`,
          }}
        />
        <p className="mt-4 font-mono text-sm text-mist-muted tracking-wide">{avatar.label}</p>

        <div className="mt-6 flex gap-4">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              aria-pressed={selected === a.id}
              aria-label={`Choose avatar ${a.label}`}
              className={`h-10 w-10 rounded-full transition-all duration-300 ${
                selected === a.id ? 'ring-2 ring-offset-2 ring-offset-void ring-mist' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ background: a.color }}
            />
          ))}
        </div>
      </div>

      <div className="mt-16 space-y-6">
        <div>
          <label className="font-mono text-xs tracking-wide text-mist-muted">Name</label>
          <input
            type="text"
            placeholder="Add your name"
            className="mt-2 w-full rounded-xl border border-white/10 bg-void-panel/60 px-4 py-3 text-sm text-mist placeholder:text-mist-faint focus:border-cyan/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs tracking-wide text-mist-muted">Short bio</label>
          <textarea
            rows={3}
            placeholder="A sentence or two about you"
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-void-panel/60 px-4 py-3 text-sm text-mist placeholder:text-mist-faint focus:border-cyan/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs tracking-wide text-mist-muted">Interests &amp; hobbies</label>
          <input
            type="text"
            placeholder="e.g. running, painting, late-night coding"
            className="mt-2 w-full rounded-xl border border-white/10 bg-void-panel/60 px-4 py-3 text-sm text-mist placeholder:text-mist-faint focus:border-cyan/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-16 rounded-2xl border border-white/10 bg-void-panel/50 px-6 py-6">
        <h2 className="font-display text-sm tracking-wide text-cyan">How Youverse works</h2>
        <p className="mt-3 text-sm leading-relaxed text-mist-muted">
          A small device near you reads light, temperature, humidity, motion, and noise. Those
          readings become behavioral features, and a lightweight model turns those features into
          modeled likelihoods for a handful of possible future selves. Nothing here is a diagnosis
          or a guarantee — it's a mirror for the patterns you're already living.
        </p>
      </div>
    </section>
  )
}
