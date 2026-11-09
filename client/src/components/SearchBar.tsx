import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  placeholder?: string;
}

export function SearchBar({ value, onChange, onSearch, loading, placeholder = 'Search dramas…' }: SearchBarProps) {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          className={cn(
            'input-search pl-11',
            loading && 'opacity-80'
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoFocus
          autoComplete="off"
        />
        <button
          onClick={onSearch}
          disabled={loading || !value.trim()}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
            !value.trim() || loading
              ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50'
          )}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
      <nav className="max-w-2xl mx-auto mt-6 flex items-center gap-3 text-xs text-slate-500">
        <ArrowLeft size={14} className="opacity-50 hover:opacity-75 cursor-pointer" onClick={() => navigate(-1)} />
        <span className="cursor-default">Back</span>
      </nav>
    </div>
  );
}
