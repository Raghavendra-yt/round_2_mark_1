import { WEATHER_API_BASE } from '../constants';

/**
 * Fetches current weather data from the Open-Meteo free API.
 * No API key required.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} current_weather object from Open-Meteo
 * @throws {Error} on network or API errors
 */
export async function fetchWeather(latitude, longitude) {
  const url = new URL(WEATHER_API_BASE);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url.href);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  const json = await response.json();
  return json.current_weather;
}
