/**
 * Minimal API client wrapper for standardized fetch calls.
 * Handles common headers, error normalization, and potential timeouts.
 */
export const apiClient = {
  get: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  },

  /**
   * Helper to append search params to a URL string.
   */
  buildUrl: (baseUrl: string, params: Record<string, string | number | boolean>): string => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
    return url.href;
  }
};
