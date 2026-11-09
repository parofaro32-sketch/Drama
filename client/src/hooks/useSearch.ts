import { useState, useCallback, useRef, useEffect } from 'react';
import type { DailymotionVideo, SearchResponse } from '@/types';

export function useSearch(
  searchFn: (params: { q: string; page: number }) => Promise<SearchResponse>
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DailymotionVideo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageTotal, setPageTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);

  const search = useCallback(
    async (q: string, p = 1, append = false) => {
      if (!q.trim()) return;
      cancelledRef.current = false;
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setError(null);
      setLoading(true);

      let aborted = false;
      try {
        const data = await searchFn({ q: q.trim(), page: p });
        if (cancelledRef.current || abortRef.current?.signal.aborted) {
          aborted = true;
          return;
        }
        setResults((currentResults) =>
          append ? [...currentResults, ...data.videos] : data.videos
        );
        setTotal(data.total ?? 0);
        setPage(p);
        setPageTotal(data.page_total ?? 0);
        setHasMore(Boolean(data.has_more));
      } catch (err) {
        if (aborted) return;
        const message =
          err instanceof Error ? err.message : 'Search failed.';
        if (message.includes('canceled')) return;
        setError(message);
      } finally {
        if (!aborted && !cancelledRef.current) {
          setLoading(false);
        }
      }
    },
    [searchFn]
  );

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    search(query, page + 1, true);
  }, [loading, hasMore, query, page, search]);

  const clear = useCallback(() => {
    cancelledRef.current = true;
    setQuery('');
    setResults([]);
    setTotal(0);
    setPage(1);
    setPageTotal(0);
    setHasMore(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    total,
    page,
    pageTotal,
    hasMore,
    loading,
    error,
    search,
    loadMore,
    clear,
  };
}
