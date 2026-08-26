import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: 'cyan' | 'magenta' | 'mint' | 'amber' | 'coral' | 'mist'
  dot?: boolean
  className?: string
  title?: string
}

export default function Badge({
  children,
  color = 'cyan',
  dot = true,
  className = '',
  title,
}: BadgeProps) {
  const colorMap = {
    cyan: 'border-cyan/30 text-cyan bg-cyan/10',
    magenta: 'border-magenta/30 text-magenta bg-magenta/10',
    mint: 'border-mint/30 text-mint bg-mint/10',
    amber: 'border-amber/30 text-amber bg-amber/10',
    coral: 'border-coral/30 text-coral bg-coral/10',
    mist: 'border-white/15 text-mist-muted bg-white/5',
  }

  const dotMap = {
    cyan: 'bg-cyan shadow-[0_0_8px_#2fe4ff]',
    magenta: 'bg-magenta shadow-[0_0_8px_#e63cff]',
    mint: 'bg-mint shadow-[0_0_8px_#7bffb0]',
    amber: 'bg-amber shadow-[0_0_8px_#ffd166]',
    coral: 'bg-coral shadow-[0_0_8px_#ff6b6b]',
    mist: 'bg-mist-muted',
  }

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-[11px] backdrop-blur-md ${colorMap[color]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotMap[color]}`} aria-hidden />}
      {children}
    </span>
  )
}
