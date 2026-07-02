/**
 * Custom validators for JanaSetu-AI domain.
 */

/** Validate Indian phone number (E.164 format) */
export function isValidIndianPhone(phone: string): boolean {
  return /^\+91[6-9]\d{9}$/.test(phone);
}

/** Validate GPS coordinates */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

export function isValidLongitude(lon: number): boolean {
  return lon >= -180 && lon <= 180;
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lon);
}

/** Validate if a string is a valid UUID v4 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/** Sanitize text input — remove HTML, trim whitespace */
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/&[a-z]+;/gi, '') // strip HTML entities
    .trim();
}

/** Check if a score is in valid 0–100 range */
export function isValidScore(score: number): boolean {
  return score >= 0 && score <= 100 && Number.isFinite(score);
}
