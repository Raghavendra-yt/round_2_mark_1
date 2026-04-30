import { useState, useEffect, useCallback } from 'react';

/**
 * Exposes the user's geolocation.
 *
 * @returns {{ phase, userPosition, locate }}
 *   - phase: 'idle' | 'locating' | 'ready' | 'denied' | 'error'
 *   - userPosition: { lat: number, lng: number } | null
 *   - locate: () => void  — triggers the geolocation request
 */
export function useGeolocation() {
  const [phase, setPhase] = useState('idle');
  const [userPosition, setUserPosition] = useState(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setPhase('error');
      return;
    }
    setPhase('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });
        setPhase('ready');
      },
      () => setPhase('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    return () => {
      setPhase('idle');
      setUserPosition(null);
    };
  }, []);

  return { phase, userPosition, locate };
}
