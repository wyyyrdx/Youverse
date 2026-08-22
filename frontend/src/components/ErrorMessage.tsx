interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

const ErrorMessage = ({ message, onRetry, title = '🚀 Something went wrong' }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-4 animate-bounce">🌌</div>
      <h3 className="text-xl font-semibold text-red-300 mb-2">{title}</h3>
      <p className="text-white/60 text-sm max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-quantum-purple/20 border border-quantum-purple/30 rounded-lg text-quantum-purple hover:bg-quantum-purple/30 transition-colors"
        >
          🔄 Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;