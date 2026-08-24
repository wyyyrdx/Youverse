// Talks to the FastAPI backend. Update VITE_API_BASE_URL in .env once a
// permanent deployment replaces the staging Railway URL.
//
// Contract:
//   GET  /api/predictions/{user_id}     -> { status, data: [{future_state, score}], is_simulated }
//   POST /api/predictions/calculate     -> same shape
//   POST /api/what-if                   -> same shape (request body not fully confirmed)
//
// `score` is 0-100.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://youverse-stag-3.up.railway.app'

export interface PredictionEntry {
  future_state: string
  score: number // 0-100
}

export interface PredictionsResponse {
  status: string
  data: PredictionEntry[]
  is_simulated: boolean
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (err) {
    throw new ApiError(`Could not reach Youverse API: ${(err as Error).message}`)
  }
  if (!res.ok) {
    throw new ApiError(`Youverse API error ${res.status}: ${await res.text()}`, res.status)
  }
  return res.json() as Promise<T>
}

export const api = {
  getLatestPredictions: (userId: string) =>
    request<PredictionsResponse>(`/api/predictions/${encodeURIComponent(userId)}`),

  calculatePredictions: (userId: string) =>
    request<PredictionsResponse>('/api/predictions/calculate', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),

  // NOTE: request-body shape for /api/what-if not fully confirmed by backend.
  // Currently sends { user_id, text }.
  runWhatIf: (userId: string, text: string) =>
    request<PredictionsResponse>('/api/what-if', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, text }),
    }),
}
