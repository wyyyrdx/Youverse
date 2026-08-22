import { useState } from 'react';

interface WhatIfButtonProps {
  onClick: () => void | Promise<void>;
  isLoading?: boolean;
  label?: string;
  loadingLabel?: string;
  variant?: 'primary' | 'secondary';
}

const WhatIfButton = ({
  onClick,
  isLoading = false,
  label = '✨ What If I Change?',
  loadingLabel = '🌀 Shifting universe...',
  variant = 'primary',
}: WhatIfButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-quantum-purple to-quantum-pink
      hover:shadow-lg hover:shadow-quantum-purple/30
      text-white
    `,
    secondary: `
      bg-white/5 border border-white/10
      hover:bg-white/10 hover:border-white/20
      text-white/80
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        px-8 py-3 rounded-full font-semibold transition-all duration-300
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${!isLoading && variant === 'primary' ? 'hover:scale-105' : ''}
        ${!isLoading && variant === 'secondary' ? 'hover:scale-102' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2
      `}
    >
      <span className={isLoading ? 'animate-spin' : ''}>
        {isLoading ? '🌀' : '✨'}
      </span>
      <span>{isLoading ? loadingLabel : label}</span>
      {!isLoading && variant === 'primary' && (
        <span className={`
          inline-block transition-all duration-300
          ${isHovered ? 'translate-x-1' : ''}
        `}>
          →
        </span>
      )}
    </button>
  );
};

export default WhatIfButton;