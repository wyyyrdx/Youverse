import { useEffect, useState } from 'react'
import { api, ApiError } from '../services/api'
import { getUserId } from '../utils/userId'
import { mergeWithLiveScores } from '../utils/mapFutureStates'
import { futureSelves as mockFutureSelves } from '../data/futureSelves'
import type { FutureSelf } from '../types'

export type ConnectionState = 'loading' | 'live' | 'offline'

export function usePredictions() {
  const [futureSelves, setFutureSelves] = useState<FutureSelf[]>(mockFutureSelves)
  const [connection, setConnection] = useState<ConnectionState>('loading')
  const [isSimulated, setIsSimulated] = useState(true)

  useEffect(() => {
    let cancelled = false
    const userId = getUserId()

    api
      .getLatestPredictions(userId)
      .then((res) => {
        if (cancelled) return
        setFutureSelves(mergeWithLiveScores(res.data))
        setIsSimulated(res.is_simulated)
        setConnection('live')
      })
      .catch((err) => {
        if (cancelled) return
        console.warn(
          'Youverse: falling back to mock predictions -',
          err instanceof ApiError ? err.message : err,
        )
        setFutureSelves(mockFutureSelves)
        setConnection('offline')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { futureSelves, connection, isSimulated, setFutureSelves }
}
