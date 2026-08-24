import type { ReactNode } from 'react'

export default function Badge({
  children,
  color = 'magenta',
}: {
  children: ReactNode
  color?: 'magenta' | 'cyan'
}) {
  const dot = color === 'magenta' ? 'bg-magenta' : 'bg-cyan'
  return (
    <span className="inline-flex items-center gap-2 border border-white/10 bg-void-panel px-2.5 py-1 font-mono text-[11px] text-mist-muted rounded">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {children}
    </span>
  )
}
