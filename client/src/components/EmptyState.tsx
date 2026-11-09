import { Search } from 'lucide-react';

interface EmptyStateProps {
  query: string;
  onReset: () => void;
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-slate-500">
        <Search size={24} />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-6">
        We couldn&apos;t find any Dailymotion videos matching &ldquo;{query}&rdquo;. Try a different drama name.
      </p>
      <button
        onClick={onReset}
        className="text-brand-400 hover:text-brand-300 text-sm font-medium underline underline-offset-4"
      >
        Search again
      </button>
    </div>
  );
}
