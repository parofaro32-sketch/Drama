import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 text-red-400">
        <AlertCircle size={24} />
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">Search error</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="text-brand-400 hover:text-brand-300 text-sm font-medium underline underline-offset-4 flex items-center gap-1.5"
      >
        <RefreshCw size={16} /> Try again
      </button>
    </div>
  );
}
