import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { dailymotionService } from '@/services/dailymotion';
import { SearchBar } from '@/components/SearchBar';
import { VideoGrid } from '@/components/VideoGrid';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import type { DailymotionVideo } from '@/types';

export function SearchPage() {
  const { query: urlQuery } = useParams<{ query?: string }>();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(urlQuery || '');

  const { results, loading, error, clear } = useSearch(
    async ({ q, page }) => {
      return dailymotionService.search({ q, page });
    }
  );

  const handleSearch = useCallback(() => {
    if (!inputValue.trim()) return;
    navigate(`/search/${encodeURIComponent(inputValue.trim())}`);
  }, [inputValue, navigate]);

  const handleResultClick = (video: DailymotionVideo) => {
    navigate(`/watch/${video.id}`);
  };

  const hasSearched = Boolean(urlQuery);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-dark-950/80 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Drama<span className="text-brand-400">Search</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          onSearch={handleSearch}
          loading={loading}
        />

        {error && (
          <div className="mt-6">
            <ErrorState message={error} onRetry={handleSearch} />
          </div>
        )}

        {!error && hasSearched && loading && (
          <div className="mt-8">
            <LoadingSkeleton />
          </div>
        )}

        {!error && hasSearched && !loading && results.length === 0 && (
          <div className="mt-8">
            <EmptyState query={inputValue} onReset={clear} />
          </div>
        )}

        {!error && hasSearched && !loading && results.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Results for &ldquo;{inputValue}&rdquo;
              </h2>
              <span className="text-sm text-slate-500">
                {results.length} found
              </span>
            </div>
            <VideoGrid videos={results} onVideoClick={handleResultClick} />
          </section>
        )}
      </div>
    </div>
  );
}
