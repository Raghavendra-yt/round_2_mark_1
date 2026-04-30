import { useState, useEffect } from 'react';

/**
 * Persists state to localStorage under `key`.
 * Falls back gracefully if localStorage is unavailable.
 *
 * @param {string} key - The localStorage key.
 * @param {*} initialValue - Default value if key is absent.
 * @returns {[*, Function]} Stateful value and setter.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Quota exceeded or private mode — ignore
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
