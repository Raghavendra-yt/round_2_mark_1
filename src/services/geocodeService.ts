import { GEOCODE_API_BASE } from '../constants';

/**
 * Reverse-geocodes coordinates to a human-readable city/town name.
 * Uses the free Nominatim (OpenStreetMap) API — no key required.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>} Location name (city, town, village, or county).
 * @throws {Error} on network errors
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  const url = new URL(GEOCODE_API_BASE);
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('format', 'json');

  const response = await fetch(url.href, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!response.ok) {
    throw new Error(`Geocode API error: ${response.status}`);
  }
  const data = await response.json();
  const { address } = data;
  return address.city ?? address.town ?? address.village ?? address.county ?? 'Your Area';
};
