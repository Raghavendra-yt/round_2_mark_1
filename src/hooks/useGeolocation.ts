import { useState, useEffect } from 'react';

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom hook to safely request and manage user geolocation.
 *
 * @returns {GeolocationState} An object containing lat, lng, error message, and loading state.
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      return;
    }
  return { phase, userPosition, locate };
}
