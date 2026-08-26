import type { PredictionsResponse, SensorReading, WhatIfRequest } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://youverse-stag-3.up.railway.app'

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
  const url = `${BASE_URL.replace(/\/$/, '')}${path}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 9000)

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new ApiError(`API error ${res.status}: ${errText || res.statusText}`, res.status)
    }

    return (await res.json()) as T
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out while connecting to Youverse API', 408)
    }
    const message = err instanceof Error ? err.message : String(err)
    throw new ApiError(`Network error: ${message}`)
  }
}

export const api = {
  // Check backend health
  getHealth: () => request<{ status: string }>('/api/health'),

  // Get latest predictions for user
  getLatestPredictions: (userId: string) =>
    request<PredictionsResponse>(`/api/predictions/${encodeURIComponent(userId)}`),

  // Trigger recalculation from sensor window
  calculatePredictions: (userId: string, lookbackMinutes = 30) =>
    request<PredictionsResponse>('/api/predictions/calculate', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, lookback_minutes: lookbackMinutes }),
    }),

  // Run What-If simulation with feature override
  runWhatIf: (payload: WhatIfRequest) =>
    request<PredictionsResponse>('/api/what-if', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Fetch most recent raw hardware sensor reading
  getLatestSensorReading: (deviceId?: string) => {
    const q = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : ''
    return request<{ status: string; data: SensorReading | null; message: string }>(`/api/sensors/latest${q}`)
  },

  // Ingest sensor reading from hardware or web simulator
  ingestSensorReading: (reading: Partial<SensorReading>) =>
    request<{ status: string; message: string; data: SensorReading | null }>('/api/sensors/ingest', {
      method: 'POST',
      body: JSON.stringify({
        device_id: reading.device_id || 'youverse-esp32-node',
        light: reading.light ?? 1200,
        temperature: reading.temperature ?? 22.5,
        humidity: reading.humidity ?? 48.0,
        motion: reading.motion ?? 1,
        noise: reading.noise ?? 450,
        timestamp: reading.timestamp || new Date().toISOString(),
      }),
    }),
}
