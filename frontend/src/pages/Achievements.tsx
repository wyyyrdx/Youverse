import Badge from '../components/Badge'

interface BadgeItem {
  name: string
  description: string
  unlocked: boolean
  color: string
}

// Mock unlock state — in production this comes from the backend once
// achievement tracking exists server-side.
const BADGES: BadgeItem[] = [
  { name: 'Tiny Universe Explorer', description: 'Opened your galaxy for the first time.', unlocked: true, color: '#2fe4ff' },
  { name: 'Quantum Curious', description: 'Ran your first What-If simulation.', unlocked: true, color: '#e63cff' },
  { name: 'Orbit Master', description: 'Viewed all five future selves in one session.', unlocked: false, color: '#7bffb0' },
  { name: 'Professional Overthinker', description: 'Ran five What-If simulations in a day.', unlocked: false, color: '#ffd166' },
  { name: 'Brain in Superposition', description: 'Kept two future selves within 2% of each other.', unlocked: false, color: '#e63cff' },
  { name: 'Escape Velocity', description: 'Moved a future self by more than 20 points.', unlocked: false, color: '#2fe4ff' },
  { name: 'Probability Wizard', description: 'Checked your futures seven days in a row.', unlocked: false, color: '#ff6b6b' },
]

export default function Achievements() {
  return (
    <section className="min-h-screen px-6 pt-32 pb-24 max-w-3xl mx-auto">
      <Badge>ACHIEVEMENTS</Badge>
      <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold text-mist">
        Marks left in your universe
      </h1>
      <p className="mt-3 text-sm text-mist-muted max-w-md">
        Small proof that you showed up, explored, and changed something.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {BADGES.map((b) => (
          <div
            key={b.name}
            className={`rounded-2xl border px-5 py-5 transition-all duration-300 ${
              b.unlocked
                ? 'border-white/15 bg-void-panel/60'
                : 'border-white/5 bg-void-panel/25 opacity-50'
            }`}
            style={b.unlocked ? { boxShadow: `0 0 30px ${b.color}22` } : undefined}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-8 w-8 rounded-full shrink-0"
                style={{
                  background: b.unlocked
                    ? `radial-gradient(circle at 35% 30%, #fff, ${b.color})`
                    : 'rgba(255,255,255,0.08)',
                }}
              />
              <h3 className="font-display text-sm tracking-wide text-mist">{b.name}</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-mist-muted">{b.description}</p>
            <span className="mt-3 inline-block font-mono text-[10px] tracking-wide text-mist-faint">
              {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
