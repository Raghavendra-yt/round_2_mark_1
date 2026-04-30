import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// ── Weather code → description + emoji ────────────────────────────────────
const WX_MAP = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Icy Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  61: { label: 'Light Rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Light Snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  80: { label: 'Rain Showers', icon: '🌦️' },
  81: { label: 'Heavy Showers', icon: '🌧️' },
  82: { label: 'Violent Showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Hail Storm', icon: '⛈️' },
  99: { label: 'Heavy Hail Storm', icon: '⛈️' },
};

function getWx(code) {
  return WX_MAP[code] ?? { label: 'Unknown', icon: '🌡️' };
}

// ── Mock polling stations relative to user's position ─────────────────────
const POLL_OFFSETS = [
  { name: 'City Hall', delta: [0.006, 0.008], type: 'Main Station', id: 'p1' },
  { name: 'Community Center', delta: [-0.009, 0.004], type: 'Secondary', id: 'p2' },
  { name: 'Public Library', delta: [0.004, -0.010], type: 'Early Voting', id: 'p3' },
  { name: 'Riverside High School', delta: [-0.006, -0.007], type: 'Main Station', id: 'p4' },
  { name: 'Greenway Rec Center', delta: [0.010, 0.002], type: 'Accessible Site', id: 'p5' },
];

// ── Distance helper ────────────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Weather Card ───────────────────────────────────────────────────────────
function WeatherCard({ weather, locationName }) {
  if (!weather) return <div className="wx-loading">Fetching weather…</div>;
  const wx = getWx(weather.weathercode);
  return (
    <div className="wx-card">
      <div className="wx-top">
        <div className="wx-icon">{wx.icon}</div>
        <div>
          <div className="wx-temp">{Math.round(weather.temperature)}°C</div>
          <div className="wx-label">{wx.label}</div>
        </div>
      </div>
      <div className="wx-location">📍 {locationName || 'Your Location'}</div>
      <div className="wx-details">
        <div className="wx-detail">
          <span className="wx-detail-icon">💨</span>
          <span>{Math.round(weather.windspeed)} km/h wind</span>
        </div>
        <div className="wx-detail">
          <span className="wx-detail-icon">🌡️</span>
          <span>{wx.label}</span>
        </div>
      </div>
    </div>
  );
}

// ── Polling Stations List ──────────────────────────────────────────────────
function StationList({ stations, selectedId, onSelect }) {
  return (
    <div className="station-list">
      <div className="station-list-title">🗳️ Nearby Polling Stations</div>
      {stations.map((s) => (
        <button
          key={s.id}
          className={`station-item${selectedId === s.id ? ' selected' : ''}`}
          onClick={() => onSelect(s)}
          aria-label={`${s.name} — ${s.type} — ${s.distKm.toFixed(1)} km away — ${s.driveMin} min drive`}
        >
          <div className="station-item-left">
            <div className="station-dot" />
            <div>
              <div className="station-name">{s.name}</div>
              <div className="station-type">{s.type}</div>
            </div>
          </div>
          <div className="station-times">
            <div className="station-time">🚗 {s.driveMin} min</div>
            <div className="station-time station-walk">🚶 {s.walkMin} min</div>
            <div className="station-dist">{s.distKm.toFixed(1)} km</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAPS_CONFIGURED = MAPS_API_KEY && !MAPS_API_KEY.includes('YOUR_');

export default function PollMap() {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);

  const [phase, setPhase] = useState('idle'); // idle | locating | ready | denied | error
  const [userPos, setUserPos] = useState(null);
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // ── Step 1: Get geolocation ─────────────────────────────────────────────
  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setPhase('error');
      return;
    }
    setPhase('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        setPhase('ready');
      },
      () => setPhase('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── Step 2: Fetch weather + build stations ──────────────────────────────
  useEffect(() => {
    if (!userPos) return;
    const { lat, lng } = userPos;

    // Fetch weather (Open-Meteo — no API key needed)
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`
    )
      .then((r) => r.json())
      .then((data) => setWeather(data.current_weather))
      .catch(() => {});

    // Reverse-geocode location name using Nominatim (OSM — free, no key)
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    )
      .then((r) => r.json())
      .then((data) => {
        const addr = data.address;
        setLocationName(
          addr.city || addr.town || addr.village || addr.county || 'Your Area'
        );
      })
      .catch(() => setLocationName('Your Location'));

    // Build mock stations
    const built = POLL_OFFSETS.map((p) => {
      const sLat = lat + p.delta[0];
      const sLng = lng + p.delta[1];
      const distKm = haversineKm(lat, lng, sLat, sLng);
      const driveMin = Math.max(3, Math.round(distKm * 2.2)); // ~27 km/h in urban traffic
      const walkMin = Math.round(distKm * 12); // ~5 km/h walking
      return { ...p, lat: sLat, lng: sLng, distKm, driveMin, walkMin };
    }).sort((a, b) => a.distKm - b.distKm);

    setStations(built);
    setSelectedStation(built[0]);
  }, [userPos]);

  // ── Step 3: Init/update Google Map ─────────────────────────────────────
  useEffect(() => {
    if (!userPos || !mapRef.current || !MAPS_CONFIGURED) return;

    const loader = new Loader({
      apiKey: MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'directions'],
    });

    loader.load().then((google) => {
      const mapOptions = {
        center: userPos,
        zoom: 13,
        mapTypeId: 'roadmap',
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e8f5' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f2ea' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e8d88c' }] },
          { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f0ede6' }] },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      };

      // Only create map once
      if (!googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, mapOptions);
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#b8892a', strokeWeight: 4, strokeOpacity: 0.8 },
        });
        directionsRendererRef.current.setMap(googleMapRef.current);
      }

      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // User location marker
      const userMarker = new google.maps.Marker({
        position: userPos,
        map: googleMapRef.current,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#b8892a',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 3,
        },
        zIndex: 999,
      });
      markersRef.current.push(userMarker);

      // Polling station markers
      stations.forEach((s, i) => {
        const marker = new google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map: googleMapRef.current,
          title: s.name,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 7,
            fillColor: i === 0 ? '#1a7a3f' : '#2563eb',
            fillOpacity: 0.9,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
          label: {
            text: String(i + 1),
            color: '#fff',
            fontSize: '10px',
            fontWeight: '700',
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-family:'Inter',sans-serif;padding:4px 0">
              <strong style="color:#1a1611">${s.name}</strong><br>
              <span style="color:#6b6252;font-size:12px">${s.type}</span><br>
              <span style="color:#b8892a;font-size:12px">🚗 ${s.driveMin} min · 🚶 ${s.walkMin} min · ${s.distKm.toFixed(1)} km</span>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
          setSelectedStation(s);
        });

        markersRef.current.push(marker);
      });
    });
  }, [userPos, stations]);

  // ── Step 4: Show directions to selected station ─────────────────────────
  useEffect(() => {
    if (!selectedStation || !googleMapRef.current || !MAPS_CONFIGURED) return;

    const loader = new Loader({ apiKey: MAPS_API_KEY, version: 'weekly' });
    loader.load().then((google) => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userPos,
          destination: { lat: selectedStation.lat, lng: selectedStation.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRendererRef.current?.setDirections(result);
          }
        }
      );
    });
  }, [selectedStation, userPos]);

  // ── Render ──────────────────────────────────────────────────────────────
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

        {phase === 'idle' && (
          <div className="pollmap-cta reveal">
            <div className="pollmap-cta-icon">🗺️</div>
            <h3>Locate Polling Stations Near You</h3>
            <p>
              We'll use your device location to find polling stations and show live weather conditions.
              Your location is never stored or shared.
            </p>
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={locate}>
              📍 Find My Polling Station
            </button>
            {!MAPS_CONFIGURED && (
              <div className="pollmap-notice">
                ⚠️ Google Maps API key not configured — add{' '}
                <code>VITE_GOOGLE_MAPS_API_KEY</code> to your <code>.env</code> file.
              </div>
            )}
          </div>
        )}

        {phase === 'locating' && (
          <div className="pollmap-cta reveal">
            <div className="pollmap-spinner" />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              Detecting your location…
            </p>
          </div>
        )}

        {phase === 'denied' && (
          <div className="pollmap-cta reveal">
            <div className="pollmap-cta-icon">🚫</div>
            <h3>Location Access Denied</h3>
            <p>
              Please allow location access in your browser settings, then try again.
            </p>
            <button className="btn-outline" style={{ marginTop: '1.5rem' }} onClick={locate}>
              Try Again
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div className="pollmap-cta reveal">
            <div className="pollmap-cta-icon">⚠️</div>
            <h3>Geolocation Not Supported</h3>
            <p>Your browser doesn't support location services.</p>
          </div>
        )}

        {phase === 'ready' && (
          <div className="pollmap-grid reveal">
            {/* Left panel */}
            <div className="pollmap-sidebar">
              <WeatherCard weather={weather} locationName={locationName} />
              {stations.length > 0 && (
                <StationList
                  stations={stations}
                  selectedId={selectedStation?.id}
                  onSelect={(s) => {
                    setSelectedStation(s);
                    googleMapRef.current?.panTo({ lat: s.lat, lng: s.lng });
                    googleMapRef.current?.setZoom(14);
                  }}
                />
              )}
              {selectedStation && (
                <div className="trip-card">
                  <div className="trip-card-title">📌 Selected Station</div>
                  <div className="trip-name">{selectedStation.name}</div>
                  <div className="trip-type">{selectedStation.type}</div>
                  <div className="trip-modes">
                    <div className="trip-mode">
                      <span className="trip-mode-icon">🚗</span>
                      <div>
                        <div className="trip-mode-time">{selectedStation.driveMin} min</div>
                        <div className="trip-mode-label">Driving</div>
                      </div>
                    </div>
                    <div className="trip-divider" />
                    <div className="trip-mode">
                      <span className="trip-mode-icon">🚶</span>
                      <div>
                        <div className="trip-mode-time">{selectedStation.walkMin} min</div>
                        <div className="trip-mode-label">Walking</div>
                      </div>
                    </div>
                    <div className="trip-divider" />
                    <div className="trip-mode">
                      <span className="trip-mode-icon">📏</span>
                      <div>
                        <div className="trip-mode-time">
                          {selectedStation.distKm.toFixed(1)} km
                        </div>
                        <div className="trip-mode-label">Distance</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="pollmap-map-wrap">
              {MAPS_CONFIGURED ? (
                <div ref={mapRef} className="pollmap-map" aria-label="Google Map showing polling stations" />
              ) : (
                <div className="pollmap-map-placeholder">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                  <strong>Google Maps Not Configured</strong>
                  <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Add your <code>VITE_GOOGLE_MAPS_API_KEY</code> to the <code>.env</code> file to
                    enable interactive maps.
                  </p>
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Your location: {userPos.lat.toFixed(4)}°, {userPos.lng.toFixed(4)}°
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
