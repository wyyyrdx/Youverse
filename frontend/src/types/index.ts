export interface FutureSelf {
  id: string
  name: string
  score: number // 0-100 modeled likelihood
  color: string // hex accent
  glow: string // rgba glow string
  orbitRadius: number // orbital distance
  orbitDuration: number // seconds for full orbit revolution
  orbitOffset: number // starting angle in degrees
  description: string
  characteristics: string[]
  signals: string[]
  reflectionPrompts: string[]
  nudges: string[]
}

export interface SensorReading {
  id?: string
  device_id: string
  light: number // 0 - 4095
  temperature: number // Celsius
  humidity: number // %
  motion: number // 0 or 1
  noise: number // 0 - 4095
  timestamp: string // ISO 8601
  is_simulated?: boolean
}

export interface PredictionEntry {
  future_state: string
  score: number // 0-100
}

export interface PredictionsResponse {
  status: string
  data: PredictionEntry[]
  is_simulated: boolean
}

export interface WhatIfChange {
  changed_feature: string
  new_value: number
}

export interface WhatIfRequest {
  user_id: string
  changed_feature: string
  new_value: number
}

export interface WhatIfResponse {
  status: string
  data: PredictionEntry[]
}

export interface WhatIfResult {
  narrative: string
  updated: { id: string; score: number }[]
  featureChanges: WhatIfChange[]
  source: 'live' | 'local'
}

export interface Discovery {
  id: string
  name: string
  category: 'NAVIGATION' | 'SIMULATION' | 'TELEMETRY' | 'REFLECTION'
  description: string
  unlocked: boolean
  color: string
  iconName: string
}

export type ConnectionState = 'loading' | 'live' | 'offline'
