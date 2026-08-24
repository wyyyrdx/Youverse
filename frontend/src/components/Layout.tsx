import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import Starfield from './Starfield'
import DottedPlanet from './DottedPlanet'

const NAV = [
  { to: '/', label: 'Universe' },
  { to: '/present', label: 'Present' },
  { to: '/what-if', label: 'What If' },
  { to: '/profile', label: 'Profile' },
  { to: '/discoveries', label: 'Discoveries' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="relative min-h-screen bg-void text-mist font-body">
      <Starfield />
      <DottedPlanet />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-void/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/youverse-logo.png"
              alt="Youverse"
              className="h-6 md:h-7 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to))
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 text-sm transition-colors duration-200 ${
                    active
                      ? 'text-mist border-b border-magenta'
                      : 'text-mist-muted hover:text-mist'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/what-if"
              className="hidden sm:inline-flex items-center rounded-md border border-white/15 px-3.5 py-1.5 text-xs font-mono text-mist hover:bg-white/5 transition-colors"
            >
              Run What-If
            </Link>
            {/* mobile nav */}
            <nav className="flex md:hidden items-center gap-0.5 overflow-x-auto max-w-[55vw]">
              {NAV.map((item) => {
                const active = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-2 py-1 text-[11px] whitespace-nowrap ${
                      active ? 'text-mist' : 'text-mist-muted'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-5 md:px-8 text-center text-[11px] text-mist-faint font-mono">
        Youverse is a hackathon project. Future selves are modeled likelihoods from behavioral
        signals, not predictions or measurements of your mental state.
      </footer>
    </div>
  )
}
