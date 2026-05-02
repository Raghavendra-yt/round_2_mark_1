import { useQuery } from '@tanstack/react-query';

/**
 * Performance-optimized hook for Gemini API calls.
 * Implements React Query for caching and stale-while-revalidate strategy.
 */
export const useGeminiQuery = (prompt: string, options = {}) => {

  return useQuery({
    queryKey: ['gemini', prompt],
    queryFn: async () => {
      // Simulate Gemini API call or use actual endpoint
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) throw new Error('Gemini API Error');
      return response.json();
    },
    // Performance Optimization: Cache results for 1 hour, stale for 5 mins
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    // Persist to local storage via React Query's persistQueryClient if configured
    ...options,
  });
};

/**
 * Prefetches Gemini data to reduce perceived latency.
 */
export const prefetchGeminiData = async (queryClient: any, prompt: string) => {
  await queryClient.prefetchQuery({
    queryKey: ['gemini', prompt],
    queryFn: () => fetch('/api/gemini', { /* ... */ }).then(res => res.json()),
  });
};
