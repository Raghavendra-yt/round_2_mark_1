import { WEATHER_API_BASE } from '@/constants';
import { apiClient } from './apiClient';

export interface CurrentWeather {
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  time: string;
}

const CACHE_KEY = 'elected_weather_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

interface CachedWeather {
  timestamp: number;
  data: CurrentWeather;
}

/**
 * Fetches current weather data from the Open-Meteo free API.
 * Implements client-side caching to reduce redundant API calls.
 */
export async function fetchWeather(latitude: number, longitude: number): Promise<CurrentWeather> {
  const cacheKey = `${CACHE_KEY}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
  
  // Check cache
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { timestamp, data }: CachedWeather = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
  } catch (err) {
    // Silently continue if cache fails
  }

  const url = apiClient.buildUrl(WEATHER_API_BASE, {
    latitude,
    longitude,
    current_weather: 'true',
    timezone: 'auto'
  });

  try {
    const json = await apiClient.get<any>(url);
    const weatherData = json.current_weather as CurrentWeather;

    // Update cache
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: weatherData,
      }));
    } catch (e) {
      // Ignore quota errors
    }

    return weatherData;
  } catch (err) {
    console.error('Weather fetch error:', err);
    throw err;
  }
}
