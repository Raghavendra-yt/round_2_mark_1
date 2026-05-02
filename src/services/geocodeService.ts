import { GEOCODE_API_BASE } from '@/constants';
import { apiClient } from './apiClient';

const CACHE_KEY: string = 'elected_geocode_cache';
const CACHE_TTL: number = 24 * 60 * 60 * 1000; // 24 hours

interface CachedGeocode {
  timestamp: number;
  name: string;
}

interface NominatimResponse {
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    [key: string]: string | undefined;
  };
  display_name: string;
  [key: string]: any;
}

/**
 * Reverse-geocodes coordinates to a human-readable city/town name.
 * Implements persistent caching based on coordinate clustering (3 decimal places).
 * 
 * @param {number} latitude - User's latitude.
 * @param {number} longitude - User's longitude.
 * @returns {Promise<string>} - Human-readable location name.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const latKey: string = latitude.toFixed(3);
  const lonKey: string = longitude.toFixed(3);
  const cacheKey: string = `${CACHE_KEY}_${latKey}_${lonKey}`;

  // Check cache
  try {
    const cached: string | null = localStorage.getItem(cacheKey);
    if (cached) {
      const { timestamp, name }: CachedGeocode = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return name;
      }
    }
  } catch (err) {
    // Ignore cache errors
  }

  const url: string = apiClient.buildUrl(GEOCODE_API_BASE, {
    lat: String(latitude),
    lon: String(longitude),
    format: 'json'
  });

  try {
    const data: NominatimResponse = await apiClient.get<NominatimResponse>(url, {
      headers: { 
        'Accept-Language': 'en',
        'User-Agent': 'CivicGuide-App/1.0'
      },
    });

    const { address } = data;
    const locationName: string = address.city ?? address.town ?? address.village ?? address.county ?? 'Your Area';

    // Update cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        name: locationName,
      }));
    } catch (e) {
      // Ignore quota errors
    }

    return locationName;
  } catch (err) {
    console.error('Geocoding error:', err);
    return 'Your Location';
  }
}
