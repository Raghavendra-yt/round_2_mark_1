import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@googlemaps/js-api-loader';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchWeather } from '../services/weatherService';
import { reverseGeocode } from '../services/geocodeService';
import { buildPollingStations } from '../services/pollingStationsService';
import { MAPS_API_KEY, MAPS_CONFIGURED, MAP_STYLES, WEATHER_CODE_MAP } from '../constants';
import { formatDistance } from '../utils/geo';

// ── Weather helpers ───────────────────────────────────────────────────────────

function getWeatherInfo(weatherCode) {
  return WEATHER_CODE_MAP[weatherCode] ?? { label: 'Unknown', icon: '🌡️' };
}

// ── WeatherCard ───────────────────────────────────────────────────────────────

/** Displays current weather conditions at the user's location. */
const WeatherCard = function WeatherCard({ weather, locationName }) {
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

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    temperature:  PropTypes.number,
    weathercode:  PropTypes.number,
    windspeed:    PropTypes.number,
  }),
  locationName: PropTypes.string,
};

WeatherCard.defaultProps = {
  weather:      null,
  locationName: '',
};

// ── StationItem ───────────────────────────────────────────────────────────────

/** Single polling station row in the station list. */
const StationItem = function StationItem({ station, isSelected, onSelect }) {
  return (
    <button
      className={`station-item${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(station)}
      aria-label={`${station.name} — ${station.type} — ${formatDistance(station.distanceKm)} away — ${station.driveMinutes} min drive`}
      aria-pressed={isSelected}
    >
      <div className="station-item-left">
        <div className="station-dot" aria-hidden="true" />
        <div>
          <div className="station-name">{station.name}</div>
          <div className="station-type">{station.type}</div>
        </div>
      </div>
      <div className="station-times">
        <div className="station-time">🚗 {station.driveMinutes} min</div>
        <div className="station-time station-walk">🚶 {station.walkMinutes} min</div>
        <div className="station-dist">{formatDistance(station.distanceKm)}</div>
      </div>
    </button>
  );
};

StationItem.propTypes = {
  station: PropTypes.shape({
    id:           PropTypes.string.isRequired,
    name:         PropTypes.string.isRequired,
    type:         PropTypes.string.isRequired,
    distanceKm:   PropTypes.number.isRequired,
    driveMinutes: PropTypes.number.isRequired,
    walkMinutes:  PropTypes.number.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect:   PropTypes.func.isRequired,
};

// ── StationList ───────────────────────────────────────────────────────────────

/** List of nearby polling stations. */
const StationList = function StationList({ stations, selectedId, onSelect }) {
  return (
    <div className="station-list" aria-label="Nearby polling stations">
      <div className="station-list-title">🗳️ Nearby Polling Stations</div>
      {stations.map((station) => (
        <StationItem
          key={station.id}
          station={station}
          isSelected={selectedId === station.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

StationList.propTypes = {
  stations:   PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  selectedId: PropTypes.string,
  onSelect:   PropTypes.func.isRequired,
};

StationList.defaultProps = { selectedId: null };

// ── TripCard ──────────────────────────────────────────────────────────────────

/** Shows travel times and distance for the selected station. */
const TripCard = function TripCard({ station }) {
  return (
    <div className="trip-card" aria-label={`Travel details for ${station.name}`}>
      <div className="trip-card-title">📌 Selected Station</div>
      <div className="trip-name">{station.name}</div>
      <div className="trip-type">{station.type}</div>
      <div className="trip-modes">
        <div className="trip-mode">
          <span className="trip-mode-icon" aria-hidden="true">🚗</span>
          <div>
            <div className="trip-mode-time">{station.driveMinutes} min</div>
            <div className="trip-mode-label">Driving</div>
          </div>
        </div>
        <div className="trip-divider" aria-hidden="true" />
        <div className="trip-mode">
          <span className="trip-mode-icon" aria-hidden="true">🚶</span>
          <div>
            <div className="trip-mode-time">{station.walkMinutes} min</div>
            <div className="trip-mode-label">Walking</div>
          </div>
        </div>
        <div className="trip-divider" aria-hidden="true" />
        <div className="trip-mode">
          <span className="trip-mode-icon" aria-hidden="true">📏</span>
          <div>
            <div className="trip-mode-time">{formatDistance(station.distanceKm)}</div>
            <div className="trip-mode-label">Distance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

TripCard.propTypes = {
  station: PropTypes.shape({
    name:         PropTypes.string.isRequired,
    type:         PropTypes.string.isRequired,
    driveMinutes: PropTypes.number.isRequired,
    walkMinutes:  PropTypes.number.isRequired,
    distanceKm:   PropTypes.number.isRequired,
  }).isRequired,
};

// ── MapPlaceholder ────────────────────────────────────────────────────────────

/** Shown when the Maps API key is not configured. */
const MapPlaceholder = function MapPlaceholder({ userPosition }) {
  return (
    <div className="pollmap-map-placeholder">
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">🗺️</div>
      <strong>Google Maps Not Configured</strong>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Add your <code>VITE_GOOGLE_MAPS_API_KEY</code> to the <code>.env</code> file to enable
        interactive maps.
      </p>
      {userPosition && (
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Your location: {userPosition.lat.toFixed(4)}°, {userPosition.lng.toFixed(4)}°
        </p>
      )}
    </div>
  );
};

MapPlaceholder.propTypes = {
  userPosition: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
};

MapPlaceholder.defaultProps = { userPosition: null };

// ── PollMap ───────────────────────────────────────────────────────────────────

/** Interactive section: locates user, shows weather, and renders nearby polling stations. */
function PollMap() {
  const { phase, userPosition, locate } = useGeolocation();

  const mapRef                 = useRef(null);
  const googleMapRef           = useRef(null);
  const markersRef             = useRef([]);
  const directionsRendererRef  = useRef(null);

  const [weather, setWeather]               = useState(null);
  const [locationName, setLocationName]     = useState('');
  const [stations, setStations]             = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // ── Fetch weather + build stations when position is available ──────────────
  useEffect(() => {
    if (!userPosition) return;

    fetchWeather(userPosition.lat, userPosition.lng)
      .then(setWeather)
      .catch(() => {}); // Silently degrade — weather is enhancement only

    reverseGeocode(userPosition.lat, userPosition.lng)
      .then(setLocationName)
      .catch(() => setLocationName('Your Location'));

    const built = buildPollingStations(userPosition);
    setStations(built);
    setSelectedStation(built[0] ?? null);
  }, [userPosition]);

  // ── Initialise/update Google Map ──────────────────────────────────────────
  useEffect(() => {
    if (!userPosition || !mapRef.current || !MAPS_CONFIGURED) return;

    const loader = new Loader({
      apiKey:    MAPS_API_KEY,
      version:   'weekly',
      libraries: ['places', 'directions'],
    });

    loader.load().then((google) => {
      if (!googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center:             userPosition,
          zoom:               13,
          mapTypeId:          'roadmap',
          styles:             MAP_STYLES,
          streetViewControl:  false,
          mapTypeControl:     false,
          fullscreenControl:  true,
        });

        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#b8892a', strokeWeight: 4, strokeOpacity: 0.8 },
        });
        directionsRendererRef.current.setMap(googleMapRef.current);
      }

      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // User location
      const userMarker = new google.maps.Marker({
        position: userPosition,
        map:      googleMapRef.current,
        title:    'Your Location',
        icon: {
          path:        google.maps.SymbolPath.CIRCLE,
          scale:       10,
          fillColor:   '#b8892a',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 3,
        },
        zIndex: 999,
      });
      markersRef.current.push(userMarker);

      // Station markers
      stations.forEach((station, index) => {
        const marker = new google.maps.Marker({
          position: { lat: station.lat, lng: station.lng },
          map:      googleMapRef.current,
          title:    station.name,
          icon: {
            path:        google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale:       7,
            fillColor:   index === 0 ? '#1a7a3f' : '#2563eb',
            fillOpacity: 0.9,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
          label: { text: String(index + 1), color: '#fff', fontSize: '10px', fontWeight: '700' },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="font-family:'Inter',sans-serif;padding:4px 0">
            <strong style="color:#1a1611">${station.name}</strong><br>
            <span style="color:#6b6252;font-size:12px">${station.type}</span><br>
            <span style="color:#b8892a;font-size:12px">
              🚗 ${station.driveMinutes} min · 🚶 ${station.walkMinutes} min · ${formatDistance(station.distanceKm)}
            </span></div>`,
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
          setSelectedStation(station);
        });

        markersRef.current.push(marker);
      });
    });
  }, [userPosition, stations]);

  // ── Show directions to selected station ────────────────────────────────────
  useEffect(() => {
    if (!selectedStation || !googleMapRef.current || !MAPS_CONFIGURED || !userPosition) return;

    const loader = new Loader({ apiKey: MAPS_API_KEY, version: 'weekly' });
    loader.load().then((google) => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin:      userPosition,
          destination: { lat: selectedStation.lat, lng: selectedStation.lng },
          travelMode:  google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRendererRef.current?.setDirections(result);
          }
        }
      );
    });
  }, [selectedStation, userPosition]);

  // ── Station select handler ─────────────────────────────────────────────────
  const handleSelectStation = useCallback((station) => {
    setSelectedStation(station);
    if (googleMapRef.current) {
      googleMapRef.current.panTo({ lat: station.lat, lng: station.lng });
      googleMapRef.current.setZoom(14);
    }
  }, []);

  // Memoise sorted stations label
  const stationCountLabel = useMemo(
    () => `${stations.length} polling station${stations.length !== 1 ? 's' : ''} found nearby`,
    [stations.length]
  );

  return (
    <section id="pollmap" aria-labelledby="pollmap-heading">
      <div className="section-inner">
        <p className="section-label reveal">Live Civic Tools</p>
        <h2 className="section-title reveal" id="pollmap-heading">
          Find Your <em>Polling Station</em>
        </h2>
        <p className="section-desc reveal">
          Get real-time weather at your location and find the nearest polling stations with
          estimated travel times — powered by Google Maps.
        </p>

        {/* ── Idle ─────────────────────────────────────────────────────────── */}
        {phase === 'idle' && (
          <div className="pollmap-cta reveal">
            <div className="pollmap-cta-icon" aria-hidden="true">🗺️</div>
            <h3>Locate Polling Stations Near You</h3>
            <p>
              We'll use your device location to find polling stations and show live weather
              conditions. Your location is never stored or shared.
            </p>
            <button
              id="locate-btn"
              className="btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={locate}
            >
              📍 Find My Polling Station
            </button>
            {!MAPS_CONFIGURED && (
              <div className="pollmap-notice" role="note">
                ⚠️ Google Maps API key not configured — add{' '}
                <code>VITE_GOOGLE_MAPS_API_KEY</code> to your <code>.env</code> file.
              </div>
            )}
          </div>
        )}

        {/* ── Locating ─────────────────────────────────────────────────────── */}
        {phase === 'locating' && (
          <div className="pollmap-cta reveal" aria-live="polite" aria-busy="true">
            <div className="pollmap-spinner" aria-hidden="true" />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              Detecting your location…
            </p>
          </div>
        )}

        {/* ── Denied ───────────────────────────────────────────────────────── */}
        {phase === 'denied' && (
          <div className="pollmap-cta reveal" role="alert">
            <div className="pollmap-cta-icon" aria-hidden="true">🚫</div>
            <h3>Location Access Denied</h3>
            <p>Please allow location access in your browser settings, then try again.</p>
            <button className="btn-outline" style={{ marginTop: '1.5rem' }} onClick={locate}>
              Try Again
            </button>
          </div>
        )}

        {/* ── Geolocation not supported ─────────────────────────────────────── */}
        {phase === 'error' && (
          <div className="pollmap-cta reveal" role="alert">
            <div className="pollmap-cta-icon" aria-hidden="true">⚠️</div>
            <h3>Geolocation Not Supported</h3>
            <p>Your browser doesn't support location services.</p>
          </div>
        )}

        {/* ── Ready ────────────────────────────────────────────────────────── */}
        {phase === 'ready' && (
          <div className="pollmap-grid reveal">
            <div className="pollmap-sidebar">
              <WeatherCard weather={weather} locationName={locationName} />
              {stations.length > 0 && (
                <>
                  <p className="sr-only" aria-live="polite">{stationCountLabel}</p>
                  <StationList
                    stations={stations}
                    selectedId={selectedStation?.id}
                    onSelect={handleSelectStation}
                  />
                </>
              )}
              {selectedStation && <TripCard station={selectedStation} />}
            </div>

            <div className="pollmap-map-wrap">
              {MAPS_CONFIGURED ? (
                <div
                  ref={mapRef}
                  className="pollmap-map"
                  aria-label="Google Map showing nearby polling stations"
                  role="application"
                />
              ) : (
                <MapPlaceholder userPosition={userPosition} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export { PollMap };
