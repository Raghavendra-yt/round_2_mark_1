import toast from 'react-hot-toast';



/**
 * Global Systems Integrator Wrapper for API calls.
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
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || `API Error: ${response.status} ${response.statusText}`;
      
      // Global Error Propagation: Notify the user immediately
      toast.error(message, { id: 'api-error' });
      throw new Error(message);
    }

    return response.json() as Promise<T>;
  },

  /**
   * Fetches data and validates it against a Zod schema.
   */
  validatedGet: async <T>(url: string, schema: { parse: (data: any) => T }, options: RequestInit = {}): Promise<T> => {
    const data = await apiClient.get<any>(url, options);
    return schema.parse(data);
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
