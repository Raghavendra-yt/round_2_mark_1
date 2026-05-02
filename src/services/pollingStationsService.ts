import { POLL_OFFSETS } from '@/constants';
import { haversineKm, estimateDriveMinutes, estimateWalkMinutes } from '../utils/geo';

interface UserPosition {
  lat: number;
  lng: number;
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

/**
 * Builds mock polling station data relative to the user's position.
 * Stations are sorted nearest-first.
 *
 * @param {UserPosition} userPosition
 * @returns {PollingStation[]} Sorted station list.
 */
export function buildPollingStations(userPosition: UserPosition): PollingStation[] {
  const { lat, lng } = userPosition;

  return POLL_OFFSETS.map((offset) => {
    const stationLat = lat + offset.delta[0];
    const stationLng = lng + offset.delta[1];
    const distanceKm = haversineKm(lat, lng, stationLat, stationLng);

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
