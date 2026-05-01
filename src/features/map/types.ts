export interface WeatherData {
  temperature: number;
  weathercode: number;
  windspeed: number;
}

export interface PollingStation {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  distanceKm: number;
  driveMinutes: number;
  walkMinutes: number;
}

export interface WeatherCardProps {
  weather: WeatherData | null;
  locationName: string;
}

export interface StationItemProps {
  station: PollingStation;
  isSelected: boolean;
  onSelect: (station: PollingStation) => void;
}

export interface StationListProps {
  stations: PollingStation[];
  selectedId: string | null;
  onSelect: (station: PollingStation) => void;
}

export interface TripCardProps {
  station: PollingStation;
}

export interface MapPlaceholderProps {
  userPosition: { lat: number; lng: number } | null;
}
