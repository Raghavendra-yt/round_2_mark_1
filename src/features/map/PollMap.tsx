import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Loader, Library } from '@googlemaps/js-api-loader';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAnalytics } from '@/hooks/useAnalytics';
import { fetchWeather } from '@/services/weatherService';
import { reverseGeocode } from '@/services/geocodeService';
import { buildPollingStations } from '@/services/pollingStationsService';
import { MAPS_API_KEY, MAPS_CONFIGURED, MAP_STYLES } from '@/constants';
import { formatDistance } from '@/utils/geo';
import { WeatherCard } from './components/WeatherCard';
import { StationList } from './components/StationList';
import { TripCard } from './components/TripCard';
import { MapPlaceholder } from './components/MapPlaceholder';
import ErrorBoundary from '@/components/ErrorBoundary';
import { WeatherData, Station } from './types';

/**
 * Interactive section: locates user, shows weather, and renders nearby polling stations.
 * Orchestrates Google Maps Platform, OpenMeteo API, and reverse geocoding.
 * 
 * @component
 */
export const PollMap = memo(() => {
  const { phase, userPosition, locate } = useGeolocation();
  const { trackEvent } = useAnalytics();

  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);

  /**
   * Intersection Observer to defer Map loading until it's near the viewport.
   * Prevents unnecessary API calls and improves page performance.
   */
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /**
   * Fetches weather and location data whenever the user position is determined.
   */
  useEffect(() => {
    if (!userPosition) return;

    /** Fetches weather data. */
    const loadWeather = async () => {
      try {
        const data = await fetchWeather(userPosition.lat, userPosition.lng);
        setWeather(data);
      } catch (_err) {
        // Silent fail for secondary data
      }
    };

    /** Fetches human-readable location name. */
    const loadLocationName = async () => {
      try {
        const name = await reverseGeocode(userPosition.lat, userPosition.lng);
        setLocationName(name);
      } catch (_err) {
        setLocationName('Your Location');
      }
    };

    loadWeather();
    loadLocationName();

    const built = buildPollingStations(userPosition) as Station[];
    setStations(built);
    setSelectedStation(built[0] ?? null);
  }, [userPosition]);

  /**
   * Initialises Google Map (only when visible + user position ready).
   */
  useEffect(() => {
    if (!mapRef.current || !MAPS_CONFIGURED || !userPosition || !isMapVisible) return;

    const loader = new Loader({
      apiKey: MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'directions'] as Library[],
    });

    /** Loads Google Maps API and initializes map instance. */
    const initMap = async () => {
      try {
        const google = await loader.load();
        if (!googleMapRef.current && mapRef.current) {
          googleMapRef.current = new google.maps.Map(mapRef.current, {
            center: userPosition,
            zoom: 13,
            mapTypeId: 'roadmap',
            styles: MAP_STYLES,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            gestureHandling: 'cooperative',
          });

          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: { strokeColor: '#9a7322', strokeWeight: 4, strokeOpacity: 0.8 },
          });
          directionsRendererRef.current.setMap(googleMapRef.current);
        }
      } catch (_err) {
        // Handled by ErrorBoundary
      }
    };

    initMap();
  }, [isMapVisible, userPosition]);

  /**
   * Updates Map Markers whenever stations or user position change.
   */
  useEffect(() => {
    if (!googleMapRef.current || !userPosition) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const google = (window as any).google;
    if (!google) return;

    const userMarker = new google.maps.Marker({
      position: userPosition,
      map: googleMapRef.current,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#9a7322',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      },
      zIndex: 999,
    });
    markersRef.current.push(userMarker);

    stations.forEach((station, index) => {
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: googleMapRef.current,
        title: station.name,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: index === 0 ? '#1a7a3f' : '#2563eb',
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
          <span style="color:#9a7322;font-size:12px">
            🚗 ${station.driveMinutes} min · 🚶 ${station.walkMinutes} min · ${formatDistance(station.distanceKm)}
          </span></div>`,
      });

      marker.addListener('click', () => {
        if (googleMapRef.current) {
          infoWindow.open(googleMapRef.current, marker);
          setSelectedStation(station);
          trackEvent('map_marker_click', { station_name: station.name });
        }
      });

      markersRef.current.push(marker);
    });

    googleMapRef.current.panTo(userPosition);
  }, [userPosition, stations, trackEvent]);

  /**
   * Updates directions whenever the selected station changes.
   */
  useEffect(() => {
    if (!selectedStation || !googleMapRef.current || !MAPS_CONFIGURED || !userPosition) return;

    const google = (window as any).google;
    if (!google) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userPosition,
        destination: { lat: selectedStation.lat, lng: selectedStation.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result: google.maps.DirectionsResult | null, status: any) => {
        if (status === 'OK' && result) {
          directionsRendererRef.current?.setDirections(result);
        }
      }
    );
  }, [selectedStation, userPosition]);

  /**
   * Handles selection of a polling station from the list.
   * @param {Station} station - The selected station.
   */
  const handleSelectStation = useCallback((station: Station) => {
    setSelectedStation(station);
    if (googleMapRef.current) {
      googleMapRef.current.panTo({ lat: station.lat, lng: station.lng });
      googleMapRef.current.setZoom(14);
    }
  }, []);

  /** Handles the "Locate" button click. */
  const handleLocateClick = useCallback(() => {
    locate();
    trackEvent('map_locate_start');
  }, [locate, trackEvent]);

  const stationCountLabel = useMemo(
    () => `${stations.length} polling station${stations.length !== 1 ? 's' : ''} found nearby`,
    [stations.length]
  );

  return (
    <section id="pollmap" aria-labelledby="pollmap-heading" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">Live Civic Tools</p>
        <h2 className="section-title reveal" id="pollmap-heading">
          Find Your <em>Polling Station</em>
        </h2>
        <p className="section-desc reveal">
          Get real-time weather at your location and find the nearest polling stations with
          estimated travel times — powered by Google Maps.
        </p>

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
              onClick={handleLocateClick}
            >
              📍 Find My Polling Station
            </button>
            {!MAPS_CONFIGURED && (
              <div className="pollmap-notice" role="note">
                ⚠️ Google Maps API key not configured.
              </div>
            )}
          </div>
        )}

        {phase === 'locating' && (
          <div className="pollmap-cta reveal" aria-live="polite" aria-busy="true">
            <div className="pollmap-spinner" aria-hidden="true" />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Detecting your location…</p>
          </div>
        )}

        {phase === 'ready' && (
          <div className="pollmap-grid reveal">
            <div className="pollmap-sidebar">
              <WeatherCard weather={weather} locationName={locationName} />
              {stations.length > 0 && (
                <>
                  <p className="sr-only" aria-live="polite">{stationCountLabel}</p>
                  <StationList
                    stations={stations}
                    selectedId={selectedStation?.id ?? null}
                    onSelect={handleSelectStation}
                  />
                </>
              )}
              {selectedStation && <TripCard station={selectedStation} />}
            </div>

            <div className="pollmap-map-wrap">
              <ErrorBoundary 
                fallback={<div className="pollmap-map-placeholder">Map failed to load. Please refresh.</div>}
                componentName="GoogleMap"
              >
                {MAPS_CONFIGURED ? (
                  <div
                    ref={mapRef}
                    className="pollmap-map"
                    aria-label="Google Map showing nearby polling stations"
                    role="application"
                    style={{ width: '100%', height: '480px' }}
                  />
                ) : (
                  <MapPlaceholder userPosition={userPosition} />
                )}
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

PollMap.displayName = 'PollMap';
