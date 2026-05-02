import { WEATHER_API_BASE } from '@/constants';
import { apiClient } from './apiClient';

/**
 * Interface representing the current weather structure returned by the API.
 */
export interface CurrentWeather {
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  time: string;
}

const CACHE_KEY: string = 'elected_weather_cache';
const CACHE_TTL: number = 10 * 60 * 1000; // 10 minutes

interface CachedWeather {
  timestamp: number;
  data: CurrentWeather;
}

interface OpenMeteoResponse {
  current_weather: CurrentWeather;
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
}

/**
 * Fetches current weather data from the Open-Meteo free API.
 * Implements client-side caching to reduce redundant API calls.
 * 
 * @param {number} latitude - User's latitude.
 * @param {number} longitude - User's longitude.
 * @returns {Promise<CurrentWeather>} - Current weather data.
 */
export async function fetchWeather(latitude: number, longitude: number): Promise<CurrentWeather> {
  const cacheKey: string = `${CACHE_KEY}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
  
  // Check cache
  try {
    const cached: string | null = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { timestamp, data }: CachedWeather = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
  } catch (err) {
    // Silently continue if cache fails
  }

  const url: string = apiClient.buildUrl(WEATHER_API_BASE, {
    latitude: String(latitude),
    longitude: String(longitude),
    current_weather: 'true',
    timezone: 'auto'
  });

  try {
    const json: OpenMeteoResponse = await apiClient.get<OpenMeteoResponse>(url);
    const weatherData: CurrentWeather = json.current_weather;

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
