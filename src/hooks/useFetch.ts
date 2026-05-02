import { useState, useCallback } from 'react';

/**
 * Interface representing the return value of the useFetch hook.
 */
interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
}

/**
 * Manages async fetch state: loading, data, and error.
 * Caches results in sessionStorage by URL to avoid redundant requests.
 * 
 * @template T - The type of data expected from the fetch request.
 * @returns {UseFetchReturn<T>} Hook API including current state and fetch function.
 */
export const useFetch = <T>(): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Performs the fetch request and manages state transitions.
   */
  const fetchData = useCallback(async (url: string, options: RequestInit = {}): Promise<void> => {
    if (!url) return;

    const cacheKey: string = `fetch_cache_${url}`;
    const cached: string | null = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setData(JSON.parse(cached));
        return;
      } catch {
        // Cache miss — continue to fetch
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response: Response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const json: T = await response.json();
      setData(json);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(json));
      } catch {
        // SessionStorage quota exceeded — ignore
      }
    } catch (fetchError: unknown) {
      setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
