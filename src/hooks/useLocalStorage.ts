import { useState } from 'react';

/**
 * Custom hook to manage state synchronized with localStorage.
 * Handles parsing errors and private mode restrictions gracefully.
 *
 * @template T
 * @param {string} key - The localStorage key.
 * @param {T} initialValue - The initial value if no data exists.
 * @returns {[T, (value: T | ((v: T) => T)) => void]} The state and setter tuple.
 */
export const useLocalStorage = <T>(key: string, initialValue: T): readonly [T, (value: T | ((_v: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((v: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
