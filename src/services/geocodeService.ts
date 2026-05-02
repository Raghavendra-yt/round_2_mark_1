import { GEOCODE_API_BASE } from '@/constants';
import { apiClient } from './apiClient';

const CACHE_KEY = 'elected_geocode_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CachedGeocode {
  timestamp: number;
  name: string;
}

/**
 * Reverse-geocodes coordinates to a human-readable city/town name.
 * Implements persistent caching based on coordinate clustering (3 decimal places).
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const latKey = latitude.toFixed(3);
  const lonKey = longitude.toFixed(3);
  const cacheKey = `${CACHE_KEY}_${latKey}_${lonKey}`;

  // Check cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { timestamp, name }: CachedGeocode = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return name;
      }
    }
  } catch (err) {
    // Ignore cache errors
  }

  const url = apiClient.buildUrl(GEOCODE_API_BASE, {
    lat: latitude,
    lon: longitude,
    format: 'json'
  });

  try {
    const data = await apiClient.get<any>(url, {
      headers: { 
        'Accept-Language': 'en',
        'User-Agent': 'CivicGuide-App/1.0'
      },
    });

    const { address } = data;
    const locationName = address.city ?? address.town ?? address.village ?? address.county ?? 'Your Area';

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
