/**
 * Compute the Haversine distance (km) between two lat/lng coordinates.
 * @param {number} lat1 - Latitude of first point.
 * @param {number} lon1 - Longitude of first point.
 * @param {number} lat2 - Latitude of second point.
 * @param {number} lon2 - Longitude of second point.
 * @returns {number} Distance in kilometers.
 */
export const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const EARTH_RADIUS_KM = 6371;
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const deltaLat = toRad(lat2 - lat1);
  const deltaLon = toRad(lon2 - lon1);
  const sinHalfLat = Math.sin(deltaLat / 2);
  const sinHalfLon = Math.sin(deltaLon / 2);
  const a =
    sinHalfLat * sinHalfLat +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sinHalfLon * sinHalfLon;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Estimate drive time in minutes given distance (km).
 * Assumes ~27 km/h average urban speed.
 * @param {number} distanceKm - Distance in kilometers.
 * @returns {number} Estimated drive time in minutes.
 */
export const estimateDriveMinutes = (distanceKm: number): number => {
  const AVG_DRIVE_SPEED_KMH = 27;
  return Math.max(3, Math.round((distanceKm / AVG_DRIVE_SPEED_KMH) * 60));
};

/**
 * Estimate walk time in minutes given distance (km).
 * Assumes ~5 km/h walking pace.
 * @param {number} distanceKm - Distance in kilometers.
 * @returns {number} Estimated walking time in minutes.
 */
export const estimateWalkMinutes = (distanceKm: number): number => {
  const AVG_WALK_SPEED_KMH = 5;
  return Math.max(1, Math.round((distanceKm / AVG_WALK_SPEED_KMH) * 60));
};

/**
 * Format a floating-point distance to one decimal place.
 * @param {number} km - Distance in kilometers.
 * @returns {string} Formatted distance string.
 */
export const formatDistance = (km: number): string => {
  return `${km.toFixed(1)} km`;
};

/**
 * Clamp a numeric value between min and max.
 * @param {number} value - Value to clamp.
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Clamped value.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
