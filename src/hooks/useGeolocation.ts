import { useState } from 'react';

export interface UserPosition {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  userPosition: UserPosition | null;
  error: string | null;
  loading: boolean;
  phase: 'idle' | 'locating' | 'ready' | 'denied' | 'error';
  locate: () => void;
}

/**
 * Custom hook to safely request and manage user geolocation.
 *
 * @returns {GeolocationState} An object containing userPosition, phase, and locate function.
 */
export const useGeolocation = (): GeolocationState => {
  const [data, setData] = useState<{
    userPosition: UserPosition | null;
    error: string | null;
    loading: boolean;
  }>({
    userPosition: null,
    error: null,
    loading: false,
  });

  const [phase, setPhase] = useState<GeolocationState['phase']>('idle');

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setData((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      setPhase('error');
      return;
    }

    setPhase('locating');
    setData((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setData({
          userPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
        setPhase('ready');
      },
      (error) => {
        setData({
          userPosition: null,
          error: error.message,
          loading: false,
        });
        setPhase(error.code === error.PERMISSION_DENIED ? 'denied' : 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return { ...data, phase, locate };
};
