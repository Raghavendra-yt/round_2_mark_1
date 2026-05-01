import { formatDistance } from '@/utils/geo';
import { TripCardProps } from '../types';

/** Shows travel times and distance for the selected station. */
export const TripCard = ({ station }: TripCardProps) => {
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
