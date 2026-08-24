interface Discovery {
  name: string
  description: string
  unlocked: boolean
  color: string
}

const DISCOVERIES: Discovery[] = [
  {
    name: 'First orbit',
    description: 'You opened the galaxy and saw your modeled distribution.',
    unlocked: true,
    color: '#2fe4ff',
  },
  {
    name: 'First What-If',
    description: 'You explored an alternative scenario in the simulation chamber.',
    unlocked: true,
    color: '#e63cff',
  },
  {
    name: 'Pattern explorer',
    description: 'You inspected multiple Future Self regions in one session.',
    unlocked: false,
    color: '#7bffb0',
  },
  {
    name: 'Signal reader',
    description: 'You viewed live sensor-backed predictions.',
    unlocked: false,
    color: '#ffd166',
  },
  {
    name: 'Shift observed',
    description: 'A What-If moved a future self by more than 15 points.',
    unlocked: false,
    color: '#e63cff',
  },
  {
    name: 'Quiet return',
    description: 'You checked your futures across consecutive days.',
    unlocked: false,
    color: '#2fe4ff',
  },
]

export default function Discoveries() {
  return (
    <section className="relative min-h-screen px-4 md:px-6 pt-28 pb-24 max-w-3xl mx-auto">
      <div className="atmosphere-glow opacity-20" aria-hidden />

      <p className="font-mono text-[10px] tracking-[0.3em] text-mist-faint">MILESTONES</p>
      <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-mist">Discoveries</h1>
      <p className="mt-2 text-sm text-mist-muted max-w-md">
        Markers left while exploring the possibility space. Not trophies. Coordinates.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DISCOVERIES.map((d) => (
          <div
            key={d.name}
            className={`glass rounded-[20px] p-5 transition-all duration-300 ${
              d.unlocked ? '' : 'opacity-45'
            }`}
            style={
              d.unlocked
                ? { boxShadow: `0 0 28px ${d.color}18` }
                : undefined
            }
          >
            <div className="flex items-center gap-3">
              <span
                className="h-8 w-8 rounded-full shrink-0"
                style={{
                  background: d.unlocked
                    ? `radial-gradient(circle at 35% 30%, #fff, ${d.color})`
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: d.unlocked ? `0 0 14px ${d.color}66` : undefined,
                }}
              />
              <h3 className="font-display text-sm text-mist">{d.name}</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-mist-muted">{d.description}</p>
            <span className="mt-3 inline-block font-mono text-[10px] text-mist-faint">
              {d.unlocked ? 'Found' : 'Uncharted'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
