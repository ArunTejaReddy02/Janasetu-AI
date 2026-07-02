import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

/**
 * Generic helper functions.
 */

/** Paginate an array in-memory */
export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/** Generate a secure random token */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/** Mask email for privacy */
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

/** Mask phone for privacy */
export function maskPhone(phone: string): string {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

/** Format date to readable string */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(date).format(format);
}

/** Deep omit keys from an object */
export function omitKeys<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as keyof T)),
  ) as Partial<T>;
}

/** Sleep for N milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Chunk an array into smaller arrays */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
