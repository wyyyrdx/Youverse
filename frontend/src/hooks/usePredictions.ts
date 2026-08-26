import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import { getUserId } from '../utils/userId'
import { mergeWithLiveScores } from '../utils/mapFutureStates'
import { futureSelves as initialSelves } from '../data/futureSelves'
import type { ConnectionState, FutureSelf } from '../types'

export function usePredictions() {
  const [futureSelves, setFutureSelves] = useState<FutureSelf[]>(initialSelves)
  const [connection, setConnection] = useState<ConnectionState>('loading')
  const [isSimulated, setIsSimulated] = useState(true)
  const [lastCalculated, setLastCalculated] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchPredictions = useCallback(async () => {
    const userId = getUserId()
    try {
      const res = await api.getLatestPredictions(userId)
      if (res && res.data && res.data.length > 0) {
        setFutureSelves(mergeWithLiveScores(res.data))
        setIsSimulated(Boolean(res.is_simulated))
        setConnection('live')
        setLastCalculated(new Date().toISOString())
      } else {
        setConnection('offline')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn('Prediction fetch failed, falling back to offline baseline:', message)
      setConnection('offline')
    }
  }, [])

  const triggerCalculate = useCallback(async () => {
    setIsRefreshing(true)
    const userId = getUserId()
    try {
      const res = await api.calculatePredictions(userId, 30)
      if (res && res.data) {
        setFutureSelves(mergeWithLiveScores(res.data))
        setIsSimulated(Boolean(res.is_simulated))
        setConnection('live')
        setLastCalculated(new Date().toISOString())
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn('Prediction calculation endpoint error:', message)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPredictions()
    const interval = setInterval(fetchPredictions, 25000)
    return () => clearInterval(interval)
  }, [fetchPredictions])

  return {
    futureSelves,
    connection,
    isSimulated,
    lastCalculated,
    isRefreshing,
    triggerCalculate,
    setFutureSelves,
    refresh: fetchPredictions,
  }
}
