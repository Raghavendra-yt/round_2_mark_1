export interface WeatherData {
  temperature: number;
  weathercode: number;
  windspeed: number;
}

export interface WeatherCardProps {
  weather: WeatherData | null;
  locationName: string;
}

export interface Station {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  driveMinutes: number;
  walkMinutes: number;
  lat: number;
  lng: number;
}

export interface StationItemProps {
  station: Station;
  isSelected: boolean;
  onSelect: (station: Station) => void;
}

export interface StationListProps {
  stations: Station[];
  selectedId: string | null;
  onSelect: (station: Station) => void;
}

export interface TripCardProps {
  station: Station;
}

export interface MapPlaceholderProps {
  userPosition: { lat: number; lng: number } | null;
}
