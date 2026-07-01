/**
 * geocoding.js — Location resolution utilities for SetuAI
 * Resolves free-text and device-based locations to coordinates and admin units.
 * Per PRD FR-4: uses device GPS when available, else geocodes text, else falls back to centroid.
 */

// Mock admin unit centroids
const adminUnitCentroids = {
  'AU-VZG-WARD-03': { lat: 17.7100, lng: 83.2300, name: 'Ward 3 — Central Park Area' },
  'AU-VZG-WARD-05': { lat: 17.6950, lng: 83.2400, name: 'Ward 5 — School District' },
  'AU-VZG-WARD-07': { lat: 17.6868, lng: 83.2185, name: 'Ward 7 — Anganwadi Area' },
  'AU-VZG-WARD-09': { lat: 17.7050, lng: 83.2150, name: 'Ward 9 — Station Road Area' },
  'AU-VZG-WARD-12': { lat: 17.7231, lng: 83.2016, name: 'Ward 12 — Model Town' },
};

// Mock location text → coordinate mappings
const knownLocations = {
  'sector 47': { lat: 17.6868, lng: 83.2185, admin_unit_id: 'AU-VZG-WARD-07', confidence: 0.85 },
  'model town': { lat: 17.7231, lng: 83.2016, admin_unit_id: 'AU-VZG-WARD-12', confidence: 0.90 },
  'central park': { lat: 17.7100, lng: 83.2300, admin_unit_id: 'AU-VZG-WARD-03', confidence: 0.82 },
  'station road': { lat: 17.7050, lng: 83.2150, admin_unit_id: 'AU-VZG-WARD-09', confidence: 0.88 },
  'anganwadi': { lat: 17.6868, lng: 83.2185, admin_unit_id: 'AU-VZG-WARD-07', confidence: 0.72 },
};

/**
 * Resolve a location text string to coordinates + admin unit.
 * Falls back to admin unit centroid if geocoding confidence is low.
 */
export async function geocodeLocationText(locationText) {
  // TODO: Replace with real Nominatim / GeoPy API call
  const normalized = locationText.toLowerCase().trim();

  for (const [key, data] of Object.entries(knownLocations)) {
    if (normalized.includes(key)) {
      return {
        source: 'geocoded_from_text',
        ...data,
      };
    }
  }

  // Fallback — return default constituency centroid
  return {
    source: 'fallback_centroid',
    lat: 17.6868,
    lng: 83.2185,
    admin_unit_id: 'AU-VZG-WARD-07',
    confidence: 0.3,
  };
}

/**
 * Resolve an admin unit ID to its centroid and metadata.
 */
export function getAdminUnitCentroid(adminUnitId) {
  return adminUnitCentroids[adminUnitId] || null;
}

/**
 * Get all known admin units.
 */
export function getAllAdminUnits() {
  return Object.entries(adminUnitCentroids).map(([id, data]) => ({
    id,
    ...data,
  }));
}

export default {
  geocodeLocationText,
  getAdminUnitCentroid,
  getAllAdminUnits,
};
