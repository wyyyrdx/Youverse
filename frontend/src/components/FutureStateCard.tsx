import { FutureState } from '../types';

interface FutureStateCardProps {
  state: FutureState;
  onClick?: () => void;
  isActive?: boolean;
}

const FutureStateCard = ({ state, onClick, isActive = false }: FutureStateCardProps) => {
  const { name, score, emoji, color = '#8B5CF6', description } = state;
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'from-quantum-purple to-quantum-pink';
    if (score >= 40) return 'from-quantum-blue to-quantum-purple';
    return 'from-quantum-cyan to-quantum-blue';
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'border-quantum-purple/50 shadow-lg shadow-quantum-purple/20 scale-105' 
          : 'border-white/10 hover:border-white/20 hover:bg-white/10 hover:scale-105'
        }
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <h3 className="text-lg font-semibold text-white">{name}</h3>
      </div>
      
      <p className="text-4xl font-bold mb-1" style={{ color }}>
        {score}%
      </p>
      
      {description && (
        <p className="text-sm text-white/50 mb-3">{description}</p>
      )}
      
      <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default FutureStateCard;