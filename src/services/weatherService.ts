import { WEATHER_API_BASE } from '../constants';

export interface WeatherResponse {
  temperature: number;
  weathercode: number;
  windspeed: number;
  time: string;
}

/**
 * Fetches current weather data from the Open-Meteo free API.
 * No API key required.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<WeatherResponse>} current_weather object from Open-Meteo
 * @throws {Error} on network or API errors
 */
export const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherResponse> => {
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
  return json.current_weather as WeatherResponse;
};
