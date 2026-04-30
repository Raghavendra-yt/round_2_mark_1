import { useState, useCallback } from 'react';

/**
 * Manages async fetch state: loading, data, and error.
 * Caches results in sessionStorage by URL to avoid redundant requests.
 *
 * @returns {{ data, loading, error, fetchData }} Hook API.
 */
export function useFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    if (!url) return;

    const cacheKey = `fetch_cache_${url}`;
    const cached = sessionStorage.getItem(cacheKey);
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
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(json));
      } catch {
        // SessionStorage quota exceeded — ignore
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}
