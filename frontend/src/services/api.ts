// Talks to the FastAPI backend. Update VITE_API_BASE_URL in .env once a
// permanent deployment replaces the staging Railway URL.
//
// Contract confirmed by the backend team (see team updates):
//   GET  /api/predictions/{user_id}     -> { status, data: [{future_state, score}], is_simulated }
//   POST /api/predictions/calculate     -> same shape as above, triggers a fresh calculation
//   POST /api/what-if                   -> same shape as above (request body NOT yet confirmed
//                                          by the backend team — see runWhatIf below)
//   POST /api/sensors/ingest            -> hardware only, not used by this frontend
//
// `score` is 0-100 per the backend's latest update (they moved off 0-1 in the DB layer).
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
    // network failure, CORS block, backend asleep, etc.
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

  // NOTE: the exact request-body shape for /api/what-if has not been confirmed by the
  // backend team in the updates we have — only the response shape is. This sends
  // { user_id, text } as a reasonable guess (a free-text "what if" description, matching
  // the product brief's textarea). Confirm the real field name(s) with backend before
  // relying on this in production; adjust the body below if they expect something
  // structured instead (e.g. specific behavioral_features deltas).
  runWhatIf: (userId: string, text: string) =>
    request<PredictionsResponse>('/api/what-if', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, text }),
    }),
}
