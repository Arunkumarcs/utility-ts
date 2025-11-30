/**
 * Timestamp Utilities
 * Functions for getting timestamps
 */

/**
 * Gets current timestamp in milliseconds
 * @returns Timestamp
 * @example
 * const timestamp = getTimestamp()
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * Gets current timestamp in seconds
 * @returns Timestamp in seconds
 * @example
 * const timestamp = getTimestampSeconds()
 */
export function getTimestampSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
