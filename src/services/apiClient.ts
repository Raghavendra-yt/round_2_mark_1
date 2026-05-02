import toast from 'react-hot-toast';

/**
 * Global API Client providing standardized fetch wrappers with 
 * integrated error handling, Zod validation support, and toast notifications.
 */
export const apiClient = {
  /**
   * Performs a standard GET request.
   * 
   * @async
   * @template T
   * @param {string} url - The endpoint URL.
   * @param {RequestInit} [options={}] - Standard fetch options.
   * @returns {Promise<T>} - The parsed JSON response.
   * @throws {Error} - Throws on non-OK responses or network failures.
   */
  get: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    try {
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

      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error && error.message.includes('API Error')) {
        throw error; // Already handled
      }
      const msg = 'Network connection failed. Please check your internet.';
      toast.error(msg, { id: 'network-error' });
      throw new Error(msg);
    }
  },

  /**
   * Fetches data and validates it against a Zod schema.
   * 
   * @async
   * @template T
   * @param {string} url - The endpoint URL.
   * @param {{ parse: (data: any) => T }} schema - Zod-like schema object.
   * @param {RequestInit} [options={}] - Standard fetch options.
   * @returns {Promise<T>} - The validated and parsed data.
   */
  validatedGet: async <T>(url: string, schema: { parse: (data: any) => T }, options: RequestInit = {}): Promise<T> => {
    try {
      const data = await apiClient.get<any>(url, options);
      return schema.parse(data);
    } catch (error) {
      // Re-throw to allow component-level handling
      throw error;
    }
  },

  /**
   * Helper to append search params to a URL string.
   * 
   * @param {string} baseUrl - The base URL string.
   * @param {Record<string, string | number | boolean>} params - Key-value pairs for search params.
   * @returns {string} - The URL string with appended parameters.
   */
  buildUrl: (baseUrl: string, params: Record<string, string | number | boolean>): string => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
    return url.href;
  }
};
