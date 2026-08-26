import type { ReactNode } from 'react'
import Navbar from './Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-void text-mist font-body flex flex-col justify-between selection:bg-magenta/30 selection:text-white">
      <Navbar />

      <main className="relative z-10 flex-grow">{children}</main>

      <footer className="relative z-10 border-t border-white/[0.08] bg-void/90 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-mist-faint font-mono">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="text-mist-muted">
            🌌 <strong>Youverse</strong> — Behavioral Possibility Simulation Platform · Reverie Hacks 2026
          </p>
          <p className="text-[11px] leading-relaxed max-w-2xl mx-auto">
            Future Selves are modeled probabilistic trajectories derived from weighted feature scoring.
            They are not medical or psychological diagnoses, nor deterministic prophecies.
          </p>
        </div>
      </footer>
    </div>
  )
}
