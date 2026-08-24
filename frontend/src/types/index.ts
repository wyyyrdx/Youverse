export interface FutureSelf {
  id: string
  name: string
  score: number // 0-100, modeled likelihood, not a real probability
  color: string // hex, used for glow + orbit accent
  glow: string // rgba for box-shadow
  orbitRadius: number // px, distance from center on desktop
  orbitDuration: number // seconds for one full revolution
  orbitOffset: number // deg, starting angle
  description: string
  signals: string[] // which observable signals feed this future self
}

export interface WhatIfResult {
  narrative: string
  updated: { id: string; score: number }[]
}

export type SensorSignal = 'light' | 'temperature' | 'humidity' | 'motion' | 'noise'
