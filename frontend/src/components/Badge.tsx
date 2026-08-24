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
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] tracking-[0.25em] text-mist-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {children}
    </span>
  )
}
