import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { SensorReading } from '../types'

const MOCK_READING: SensorReading = {
  device_id: 'youverse-esp32-node',
  light: 1420,
  temperature: 22.8,
  humidity: 49.5,
  motion: 1,
  noise: 380,
  timestamp: new Date().toISOString(),
  is_simulated: true,
}

export function useSensors() {
  const [latestReading, setLatestReading] = useState<SensorReading>(MOCK_READING)
  const [isStreaming, setIsStreaming] = useState(false)
  const [status, setStatus] = useState<'idle' | 'fetching' | 'ingesting'>('idle')

  const fetchLatest = useCallback(async () => {
    setStatus('fetching')
    try {
      const res = await api.getLatestSensorReading()
      if (res && res.data) {
        setLatestReading(res.data)
        setIsStreaming(true)
      } else {
        setLatestReading((prev) => ({
          ...prev,
          light: Math.round(Math.max(200, Math.min(3900, prev.light + (Math.random() * 80 - 40)))),
          temperature: parseFloat((prev.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1)),
          humidity: parseFloat((prev.humidity + (Math.random() * 0.6 - 0.3)).toFixed(1)),
          noise: Math.round(Math.max(100, Math.min(3000, prev.noise + (Math.random() * 60 - 30)))),
          timestamp: new Date().toISOString(),
        }))
      }
    } catch (err) {
      console.warn('Sensor fetch failed, using local simulated drift:', err)
      setLatestReading((prev) => ({
        ...prev,
        light: Math.round(Math.max(200, Math.min(3900, prev.light + (Math.random() * 60 - 30)))),
        temperature: parseFloat((prev.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        noise: Math.round(Math.max(100, Math.min(3000, prev.noise + (Math.random() * 40 - 20)))),
        timestamp: new Date().toISOString(),
      }))
    } finally {
      setStatus('idle')
    }
  }, [])

  const ingestCustomReading = useCallback(async (reading: Partial<SensorReading>) => {
    setStatus('ingesting')
    try {
      await api.ingestSensorReading(reading)
      setLatestReading((prev) => ({
        ...prev,
        ...reading,
        timestamp: new Date().toISOString(),
      }))
    } catch (err) {
      console.warn('Sensor ingest failed, applying optimistic local update:', err)
      setLatestReading((prev) => ({
        ...prev,
        ...reading,
        timestamp: new Date().toISOString(),
      }))
    } finally {
      setStatus('idle')
    }
  }, [])

  useEffect(() => {
    fetchLatest()
    const interval = setInterval(fetchLatest, 5000)
    return () => clearInterval(interval)
  }, [fetchLatest])

  return {
    latestReading,
    isStreaming,
    status,
    refresh: fetchLatest,
    ingestCustomReading,
  }
}
