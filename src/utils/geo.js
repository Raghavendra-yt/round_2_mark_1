/**
 * Compute the Haversine distance (km) between two lat/lng coordinates.
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const EARTH_RADIUS_KM = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const deltaLat = toRad(lat2 - lat1);
  const deltaLon = toRad(lon2 - lon1);
  const sinHalfLat = Math.sin(deltaLat / 2);
  const sinHalfLon = Math.sin(deltaLon / 2);
  const a =
    sinHalfLat * sinHalfLat +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sinHalfLon * sinHalfLon;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Estimate drive time in minutes given distance (km).
 * Assumes ~27 km/h average urban speed.
 */
export function estimateDriveMinutes(distanceKm) {
  const AVG_DRIVE_SPEED_KMH = 27;
  return Math.max(3, Math.round((distanceKm / AVG_DRIVE_SPEED_KMH) * 60));
}

/**
 * Estimate walk time in minutes given distance (km).
 * Assumes ~5 km/h walking pace.
 */
export function estimateWalkMinutes(distanceKm) {
  const AVG_WALK_SPEED_KMH = 5;
  return Math.max(1, Math.round((distanceKm / AVG_WALK_SPEED_KMH) * 60));
}

/**
 * Format a floating-point distance to one decimal place.
 */
export function formatDistance(km) {
  return `${km.toFixed(1)} km`;
}

/**
 * Clamp a numeric value between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
