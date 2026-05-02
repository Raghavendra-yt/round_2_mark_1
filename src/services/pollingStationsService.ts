import { POLL_OFFSETS } from '@/constants';
import { haversineKm, estimateDriveMinutes, estimateWalkMinutes } from '../utils/geo';

/**
 * Interface representing a user's geographical position.
 */
interface UserPosition {
  lat: number;
  lng: number;
}

/**
 * Interface representing a polling station and its related metrics.
 */
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

/**
 * Builds mock polling station data relative to the user's position.
 * Stations are sorted nearest-first based on Haversine distance.
 *
 * @param {UserPosition} userPosition - The current position of the user.
 * @returns {PollingStation[]} Sorted list of nearby polling stations.
 */
export function buildPollingStations(userPosition: UserPosition): PollingStation[] {
  const { lat, lng } = userPosition;

  return POLL_OFFSETS.map((offset) => {
    const stationLat: number = lat + offset.delta[0];
    const stationLng: number = lng + offset.delta[1];
    const distanceKm: number = haversineKm(lat, lng, stationLat, stationLng);

    return {
      id: offset.id,
      name: offset.name,
      type: offset.type,
      lat: stationLat,
      lng: stationLng,
      distanceKm,
      driveMinutes: estimateDriveMinutes(distanceKm),
      walkMinutes: estimateWalkMinutes(distanceKm),
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}
