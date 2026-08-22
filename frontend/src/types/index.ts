export interface FutureState {
  name: string;
  score: number;
  emoji?: string;
  color?: string;
  description?: string;
}

export interface SensorData {
  deviceId: string;
  timestamp: string;
  light: number;
  temperature: number;
  humidity: number;
  motion: number;
  noise: number;
}

export interface WhatIfInput {
  baseScenarioId: string;
  changedFeature: string;
  newValue: number;
}

export interface WhatIfResponse {
  scenarios: FutureState[];
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';