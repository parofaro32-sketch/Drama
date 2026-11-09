import { useState, useCallback, useEffect } from 'react';
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

  const searchFn = useCallback(
    ({ q, page }: { q: string; page: number }) => dailymotionService.search({ q, page }),
    []
  );

  const { results, loading, error, search, clear } = useSearch(searchFn);

  useEffect(() => {
    const decodedQuery = urlQuery ? decodeURIComponent(urlQuery) : '';
    setInputValue(decodedQuery);
    if (decodedQuery) search(decodedQuery);
    else clear();
  }, [urlQuery, search, clear]);

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

        {!hasSearched && !error && (
          <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/10 via-white/[0.03] to-transparent px-6 py-16 text-center shadow-2xl shadow-black/20 sm:px-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/20">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 10 4.5-2.5v9L15 14" />
                <rect width="10" height="12" x="3" y="6" rx="2" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">Find your next drama</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400">
              Search Dailymotion for movies, series, and memorable scenes in one focused place.
            </p>
            <p className="mt-8 text-sm font-medium text-slate-500">Try searching for a title, actor, or genre</p>
          </section>
        )}

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
