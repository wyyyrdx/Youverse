import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import Starfield from './Starfield'

const NAV = [
  { to: '/', label: 'Universe' },
  { to: '/profile', label: 'Profile' },
  { to: '/achievements', label: 'Achievements' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="relative min-h-screen bg-void text-mist font-body">
      <Starfield />

      <header className="fixed top-4 md:top-6 left-1/2 z-40 w-[94%] md:w-auto -translate-x-1/2">
        <div className="flex items-center justify-between gap-6 md:gap-10 rounded-full border border-white/10 bg-void-panel/60 backdrop-blur-xl px-4 md:px-6 py-2.5 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span
              className="h-3 w-3 rounded-full bg-gradient-to-br from-magenta to-cyan shadow-glowMagenta group-hover:animate-drift"
              aria-hidden
            />
            <span className="font-display text-xs md:text-sm tracking-[0.35em] text-mist">
              YOUVERSE
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-xs md:text-sm font-mono">
            {NAV.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 md:px-4 py-1.5 rounded-full tracking-wide transition-colors duration-300 ${
                    active
                      ? 'text-void bg-mist'
                      : 'text-mist-muted hover:text-mist hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 border-t border-white/5 py-8 px-6 md:px-10 text-center text-xs text-mist-faint font-mono">
        Youverse is a hackathon project. Future selves are modeled likelihoods from behavioral
        signals, not predictions or measurements of your mental state.
      </footer>
    </div>
  )
}
