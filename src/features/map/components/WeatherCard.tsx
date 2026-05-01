import { memo } from 'react';
import { WEATHER_CODE_MAP } from '@/constants';
import { WeatherCardProps } from '../types';

const getWeatherInfo = (weatherCode: number) => {
  // Use type assertion to allow indexing by number
  const map = WEATHER_CODE_MAP as Record<number, { label: string; icon: string }>;
  return map[weatherCode] ?? { label: 'Unknown', icon: '🌡️' };
};

/** Displays current weather conditions at the user's location. */
const WeatherCardComponent = ({ weather, locationName }: WeatherCardProps) => {
  if (!weather) {
    return <div className="wx-loading" aria-label="Fetching weather data">Fetching weather…</div>;
  }

  const { label, icon } = getWeatherInfo(weather.weathercode);

  return (
    <div className="wx-card" aria-label={`Weather at ${locationName}: ${label}, ${Math.round(weather.temperature)}°C`}>
      <div className="wx-top">
        <div className="wx-icon" aria-hidden="true">{icon}</div>
        <div>
          <div className="wx-temp">{Math.round(weather.temperature)}°C</div>
          <div className="wx-label">{label}</div>
        </div>
      </div>
      <div className="wx-location">📍 {locationName || 'Your Location'}</div>
      <div className="wx-details">
        <div className="wx-detail">
          <span className="wx-detail-icon" aria-hidden="true">💨</span>
          <span>{Math.round(weather.windspeed)} km/h wind</span>
        </div>
        <div className="wx-detail">
          <span className="wx-detail-icon" aria-hidden="true">🌡️</span>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

export const WeatherCard = memo(WeatherCardComponent);
