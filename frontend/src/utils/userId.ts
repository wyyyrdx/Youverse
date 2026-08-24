// There's no auth/user system in the product plan yet, and the backend's
// endpoints are keyed on user_id. Until real accounts exist, generate a stable
// per-browser id and reuse it, so a returning visitor keeps seeing "their" data.
const STORAGE_KEY = 'youverse_demo_user_id'

export function getUserId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const fresh =
      'demo-' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))
    localStorage.setItem(STORAGE_KEY, fresh)
    return fresh
  } catch {
    // localStorage unavailable (private mode, SSR, etc.) - fall back to a session-only id
    return 'demo-session'
  }
}
