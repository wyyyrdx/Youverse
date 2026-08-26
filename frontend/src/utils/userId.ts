const STORAGE_KEY = 'youverse_user_id'

export function getUserId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing && existing.length > 3) return existing
    const fresh = 'user_' + (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10))
    localStorage.setItem(STORAGE_KEY, fresh)
    return fresh
  } catch {
    return 'default_user'
  }
}

export function setUserId(newId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, newId.trim())
  } catch (e) {
    console.error('Failed to persist user ID:', e)
  }
}
