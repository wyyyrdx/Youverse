import { useState, useEffect, useCallback } from 'react';
import { FutureState, LoadingState, WhatIfInput } from '../types';
import { fetchFutureStates, sendWhatIf, getMockFutureStates } from '../utils/api';

export const useFutureStates = () => {
  const [futureStates, setFutureStates] = useState<FutureState[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [whatIfMessage, setWhatIfMessage] = useState<string | null>(null);

  const loadFutureStates = useCallback(async () => {
    setLoading('loading');
    setError(null);
    
    try {
      const data = await fetchFutureStates();
      setFutureStates(data);
      setLoading('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading('error');
      setFutureStates(getMockFutureStates());
    }
  }, []);

  const executeWhatIf = useCallback(async (input: WhatIfInput) => {
    setLoading('loading');
    setWhatIfMessage(null);
    
    try {
      const response = await sendWhatIf(input);
      setFutureStates(response.scenarios);
      setWhatIfMessage(response.message || '✨ Quantum shift complete!');
      setLoading('success');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'What-If failed';
      setError(errorMessage);
      setLoading('error');
      throw err;
    }
  }, []);

  const refresh = useCallback(() => {
    loadFutureStates();
  }, [loadFutureStates]);

  const clearWhatIfMessage = useCallback(() => {
    setWhatIfMessage(null);
  }, []);

  useEffect(() => {
    loadFutureStates();
  }, [loadFutureStates]);

  return {
    futureStates,
    loading,
    error,
    whatIfMessage,
    loadFutureStates,
    executeWhatIf,
    refresh,
    clearWhatIfMessage,
  };
};