import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Volume2, VolumeX, Menu, X, Sparkles } from 'lucide-react'
import { usePredictions } from '../hooks/usePredictions'
import { useSoundEffects } from '../hooks/useSoundEffects'
import Badge from './Badge'

const NAV_ITEMS = [
  { to: '/', label: 'Universe' },
  { to: '/present', label: 'Present' },
  { to: '/what-if', label: 'What If' },
  { to: '/profile', label: 'Observatory' },
  { to: '/discoveries', label: 'Discoveries' },
]

export default function Navbar() {
  const location = useLocation()
  const { connection, isSimulated } = usePredictions()
  const { toggleMute, isMuted, playHoverTone } = useSoundEffects()
  const [muted, setMuted] = useState(isMuted)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMuteToggle = () => {
    const next = toggleMute()
    setMuted(next)
    if (!next) playHoverTone(600)
  }

  const getConnectionBadge = () => {
    if (connection === 'loading') {
      return <Badge color="mist">Connecting…</Badge>
    }
    if (connection === 'live') {
      return isSimulated ? (
        <Badge color="cyan" title="Connected to FastAPI backend with simulated data">
          Live · Simulated
        </Badge>
      ) : (
        <Badge color="mint" title="Connected to FastAPI backend with live ESP32 sensors">
          Live · Real Sensors
        </Badge>
      )
    }
    return (
      <Badge color="amber" title="Using local predictive baseline model">
        Offline Baseline
      </Badge>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-void/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
          onMouseEnter={() => playHoverTone(520)}
        >
          <img
            src="/youverse-logo.png"
            alt="Youverse"
            className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(230,60,255,0.4)]"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.08] bg-void-panel/60 px-3 py-1 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/' && location.pathname.startsWith(item.to))
            return (
              <Link
                key={item.to}
                to={item.to}
                onMouseEnter={() => playHoverTone(480)}
                className={`relative px-4 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-mist bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                    : 'text-mist-muted hover:text-mist hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3">
          {/* Connection Status Badge */}
          <div className="hidden lg:block">{getConnectionBadge()}</div>

          {/* Sound FX Toggle */}
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-mist-muted hover:text-mist hover:bg-white/10 transition-colors focus:outline-none"
            title={muted ? 'Enable Ambient Audio' : 'Mute Ambient Audio'}
            aria-label="Toggle Audio"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan" />}
          </button>

          {/* Quick What-If Action Button */}
          <Link
            to="/what-if"
            onMouseEnter={() => playHoverTone(580)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-gradient-to-r from-magenta to-cyan text-void hover:brightness-110 shadow-[0_0_16px_rgba(230,60,255,0.35)] transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run What-If</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-mist-muted hover:text-mist focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-void-panel/95 px-5 py-4 backdrop-blur-2xl">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to))
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'text-mist bg-white/10 font-semibold'
                      : 'text-mist-muted hover:text-mist hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            {getConnectionBadge()}
            <Link
              to="/what-if"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-magenta to-cyan text-void"
            >
              <Sparkles className="w-3 h-3" />
              <span>What-If</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
