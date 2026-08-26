export function formatPercent(val: number): string {
  return `${Math.round(val)}%`
}

export function formatTimeAgo(isoString: string): string {
  try {
    const d = new Date(isoString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diffSec < 10) return 'Just now'
    if (diffSec < 60) return `${diffSec}s ago`
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    return `${Math.floor(diffSec / 3600)}h ago`
  } catch {
    return 'Recent'
  }
}
