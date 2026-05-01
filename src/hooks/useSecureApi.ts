import { useState, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Secure middleware hook for external API interactions.
 * Automatically injects authorization tokens, sanitizes responses, 
 * and standardizes error handling.
 */
export const useSecureApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSecure = useCallback(async <T>(url: string, options: FetchOptions = {}): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1. JWT Injection (Middleware)
      const headers = new Headers(options.headers);
      if (options.requireAuth) {
        // In a real app, retrieve token from secure HttpOnly cookie or Firebase Auth instance
        const token = window.sessionStorage.getItem('auth_token'); 
        if (token) {
          headers.append('Authorization', `Bearer ${token}`);
        }
      }

      // 2. Enforce strict content types
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const response = await fetch(url, {
        ...options,
        headers,
        // Ensure no credentials are leaked cross-origin unless explicitly requested
        credentials: options.credentials || 'same-origin', 
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json();

      // 3. XSS Sanitization (Deep traverse and sanitize string fields if needed)
      // For demonstration, stringifying and sanitizing the whole payload, then parsing.
      const sanitizedString = DOMPurify.sanitize(JSON.stringify(rawData));
      const safeData = JSON.parse(sanitizedString) as T;

      return safeData;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown network error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchSecure, loading, error };
};
