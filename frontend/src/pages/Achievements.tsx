import { useState } from 'react';

const Achievements = () => {
  const allAchievements = [
    { 
      id: 1, 
      name: 'Universe Explorer', 
      description: 'Completed your first superposition',
      emoji: '🌌',
      unlocked: true,
      rarity: 'common',
    },
    { 
      id: 2, 
      name: 'Quantum Curious', 
      description: 'Asked 5 What-If questions',
      emoji: '🧠',
      unlocked: true,
      rarity: 'uncommon',
    },
    { 
      id: 3, 
      name: 'Orbit Master', 
      description: 'Viewed 10 future states',
      emoji: '⭐',
      unlocked: true,
      rarity: 'rare',
    },
    { 
      id: 4, 
      name: 'Professional Overthinker', 
      description: 'Spent 30 minutes in superposition',
      emoji: '🤔',
      unlocked: false,
      rarity: 'epic',
    },
    { 
      id: 5, 
      name: 'Brain in Superposition', 
      description: 'Had 5 future states active simultaneously',
      emoji: '🧬',
      unlocked: false,
      rarity: 'legendary',
    },
    { 
      id: 6, 
      name: 'Escape Velocity', 
      description: 'Changed your future 10 times',
      emoji: '🚀',
      unlocked: false,
      rarity: 'mythic',
    },
  ];

  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  
  const displayedAchievements = showOnlyUnlocked 
    ? allAchievements.filter(a => a.unlocked)
    : allAchievements;

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  const rarityColors = {
    common: 'text-white/60',
    uncommon: 'text-quantum-blue',
    rare: 'text-quantum-purple',
    epic: 'text-quantum-pink',
    legendary: 'text-yellow-400',
    mythic: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-cosmic-purple to-[#1a0a2e]">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">🏆 Achievements</h1>
          <p className="text-white/60">
            {unlockedCount} / {totalCount} unlocked
          </p>
          <div className="max-w-xs mx-auto mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-quantum-purple to-quantum-pink rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
            className={`
              px-4 py-2 rounded-lg text-sm transition-all
              ${showOnlyUnlocked 
                ? 'bg-quantum-purple/20 text-quantum-purple border border-quantum-purple/30' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }
            `}
          >
            {showOnlyUnlocked ? '✨ Show All' : '🔒 Show Unlocked Only'}
          </button>
        </div>

        <div className="space-y-3">
          {displayedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`
                bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all
                ${achievement.unlocked 
                  ? 'border-white/10 hover:border-white/20 hover:bg-white/10' 
                  : 'border-white/5 opacity-50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{achievement.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{achievement.name}</h3>
                    <span className={`text-xs ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <p className="text-sm text-white/40">{achievement.description}</p>
                </div>
                <div>
                  {achievement.unlocked ? (
                    <span className="text-green-400 text-xl">✅</span>
                  ) : (
                    <span className="text-white/20 text-xl">🔒</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedAchievements.length === 0 && (
          <div className="text-center py-12 text-white/40">
            <p className="text-4xl mb-3">🌠</p>
            <p>No achievements yet. Keep exploring!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;