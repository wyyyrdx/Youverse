import { useState } from 'react';
import { useFutureStates } from '../hooks/useFutureStates';
import { WhatIfInput } from '../types';
import FutureStateCard from '../components/FutureStateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WhatIfButton from '../components/WhatIfButton';

const Superposition = () => {
  const {
    futureStates,
    loading,
    error,
    whatIfMessage,
    executeWhatIf,
    refresh,
    clearWhatIfMessage,
  } = useFutureStates();

  const [isWhatIfLoading, setIsWhatIfLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleWhatIf = async () => {
    setIsWhatIfLoading(true);
    clearWhatIfMessage();

    const input: WhatIfInput = {
      baseScenarioId: 'current',
      changedFeature: 'study_hours',
      newValue: Math.floor(Math.random() * 8) + 1,
    };

    try {
      await executeWhatIf(input);
    } catch (err) {
      // error handled in hook
    } finally {
      setIsWhatIfLoading(false);
    }
  };

  if (loading === 'loading' && futureStates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading your future states..." size="lg" />
      </div>
    );
  }

  if (loading === 'error' && futureStates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage 
          message={error || 'Unable to load future states'} 
          onRetry={refresh}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-cosmic-purple to-cosmic-blue">
      <div className="container mx-auto px-4 py-8">
        
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-3 animate-float">
            🌌 Superposition
          </h1>
          <p className="text-xl text-white/60">
            You are here. <span className="text-quantum-purple">Multiple futures</span> await.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {futureStates.map((state, index) => (
            <FutureStateCard
              key={index}
              state={state}
              isActive={selectedIndex === index}
              onClick={() => setSelectedIndex(index === selectedIndex ? null : index)}
            />
          ))}
        </div>

        {whatIfMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-quantum-purple/10 border border-quantum-purple/20 rounded-xl backdrop-blur-sm animate-pulse-slow">
            <p className="text-center text-quantum-purple font-medium">
              {whatIfMessage}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <WhatIfButton
            onClick={handleWhatIf}
            isLoading={isWhatIfLoading}
            label="✨ What If I Change?"
            loadingLabel="🌀 Shifting universe..."
          />
          
          <button
            onClick={refresh}
            disabled={loading === 'loading'}
            className="px-6 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-white/30">
          {futureStates.length} possible futures • Click a card to explore
        </div>
      </div>
    </div>
  );
};

export default Superposition;
import { getLatestPredictions, runWhatIf } from '../utils/api';
