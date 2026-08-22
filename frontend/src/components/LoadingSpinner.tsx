interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = 'Loading cosmic data...', size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`
        ${sizeClasses[size]} 
        border-quantum-purple/30 border-t-quantum-purple rounded-full animate-spin
      `} />
      <p className="text-white/60 text-sm animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;