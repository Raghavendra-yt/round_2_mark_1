import { MapPlaceholderProps } from '../types';

/** Shown when the Maps API key is not configured. */
export const MapPlaceholder = ({ userPosition }: MapPlaceholderProps) => {
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
