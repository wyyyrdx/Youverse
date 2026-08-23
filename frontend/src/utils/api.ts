const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface SensorData {
  device_id: string;
  light: number;
  temperature: number;
  humidity: number;
  noise: number;
  motion: 0 | 1;
  timestamp?: string;
}

export interface SensorResponse {
  status: string;
  message: string;
  data: Record<string, unknown> | null;
}

export interface PredictionState {
  state_name: string;
  score: number;
  color?: string;
}

export interface PredictionsResponse {
  user_id: string;
  timestamp: string;
  states: PredictionState[];
  total_score: number;
}

export interface WhatIfRequest {
  user_id: string;
  changed_feature: string;
  new_value: number;
}

export interface FutureState {
  name: string;
  score: number;
  emoji?: string;
  color?: string;
  description?: string;
}

export interface WhatIfInput {
  baseScenarioId: string;
  changedFeature: string;
  newValue: number;
}

export const getMockFutureStates = (): FutureState[] => {
  return [
    { name: 'Focused You', score: 73, emoji: '🎯', color: '#8B5CF6', description: 'Deep concentration mode' },
    { name: 'Creative You', score: 18, emoji: '🧠', color: '#60A5FA', description: 'Ideas flowing freely' },
    { name: 'Active You', score: 9, emoji: '⚡', color: '#F472B6', description: 'Full of energy' },
  ];
};

export const fetchFutureStates = async (): Promise<FutureState[]> => {
  try {
    const response = await getLatestPredictions('default-user');
    const states = (response as any)?.states || [];
    return states.map((state: any) => ({
      name: state.state_name,
      score: state.score,
      color: state.color,
      emoji: getEmojiForState(state.state_name),
    }));
  } catch (error) {
    console.error('Error in fetchFutureStates (fallback):', error);
    return getMockFutureStates();
  }
};

export const sendWhatIf = async (input: WhatIfInput): Promise<{ scenarios: FutureState[]; message?: string }> => {
  try {
    const response = await runWhatIf(
      input.baseScenarioId || 'default-user',
      input.changedFeature,
      input.newValue
    );
    const states = (response as any)?.states || [];
    return {
      scenarios: states.map((state: any) => ({
        name: state.state_name,
        score: state.score,
        color: state.color,
        emoji: getEmojiForState(state.state_name),
      })),
      message: (response as any)?.message || '✨ Universe shifted!',
    };
  } catch (error) {
    console.error('Error in sendWhatIf (fallback):', error);
    return {
      scenarios: getMockFutureStates(),
      message: '⚠️ Using mock data (API unavailable)',
    };
  }
};

function getEmojiForState(stateName: string): string {
  const emojiMap: Record<string, string> = {
    'Focused You': '🎯',
    'Creative You': '🧠',
    'Active You': '⚡',
    'Burned-Out You': '🔥',
    'Consistent You': '📊',
  };
  return emojiMap[stateName] || '✨';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const detail =
      (body as { detail?: string; message?: string })?.detail ||
      (body as { detail?: string; message?: string })?.message ||
      res.statusText;
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  return body as T;
}

export function getHealth(): Promise<{ status: string }> {
  return request("/api/health");
}

export function ingestSensorData(data: SensorData): Promise<SensorResponse> {
  return request("/api/sensors/ingest", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getLatestSensorReading(deviceId?: string): Promise<SensorResponse> {
  const query = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : "";
  return request(`/api/sensors/latest${query}`);
}

export function calculatePredictions(
  userId: string,
  lookbackMinutes = 30
): Promise<Record<string, unknown>> {
  return request("/api/predictions/calculate", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, lookback_minutes: lookbackMinutes }),
  });
}

export function getLatestPredictions(userId: string): Promise<PredictionsResponse> {
  return request(`/api/predictions/${encodeURIComponent(userId)}`);
}

export function runWhatIf(
  userId: string,
  changedFeature: string,
  newValue: number
): Promise<Record<string, unknown>> {
  const payload: WhatIfRequest = {
    user_id: userId,
    changed_feature: changedFeature,
    new_value: newValue,
  };
  return request("/api/what-if", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export default {
  getHealth,
  ingestSensorData,
  getLatestSensorReading,
  calculatePredictions,
  getLatestPredictions,
  runWhatIf,
};