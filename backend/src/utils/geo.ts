/**
 * Geospatial utility functions for JanaSetu-AI.
 */

/**
 * Calculate Haversine distance between two GPS coordinates.
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Check if a point is within a given radius of a center point.
 */
export function isWithinRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusMeters: number,
): boolean {
  return haversineDistance(centerLat, centerLon, pointLat, pointLon) <= radiusMeters;
}

/**
 * Calculate the geographic centroid of a set of points.
 */
export function calculateCentroid(
  points: Array<{ latitude: number; longitude: number }>,
): { latitude: number; longitude: number } | null {
  if (!points.length) return null;
  const lat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
  const lon = points.reduce((sum, p) => sum + p.longitude, 0) / points.length;
  return { latitude: lat, longitude: lon };
}

/**
 * Generate a bounding box around a center point.
 */
export function getBoundingBox(
  lat: number,
  lon: number,
  radiusMeters: number,
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  const latDelta = radiusMeters / 111320;
  const lonDelta = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}
