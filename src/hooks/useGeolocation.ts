import { useState } from 'react';

export type GeolocationPhase = 'idle' | 'locating' | 'ready' | 'denied' | 'error';

export interface GeolocationResult {
  phase: GeolocationPhase;
  userPosition: { lat: number; lng: number } | null;
  locate: () => void;
}

/**
 * Custom hook to safely request and manage user geolocation.
 *
 * @returns {GeolocationResult} An object containing userPosition, phase, and locate function.
 */
export function useGeolocation(): GeolocationResult {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [phase, setPhase] = useState<GeolocationPhase>('idle');

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setPhase('error');
      return;
    }

    setPhase('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setPhase('ready');
      },
      (error) => {
        setUserPosition(null);
        setPhase(error.code === error.PERMISSION_DENIED ? 'denied' : 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return { phase, userPosition, locate };
}
