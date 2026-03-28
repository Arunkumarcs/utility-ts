/**
 * Date Parsing Utilities
 * Functions for parsing date strings
 */

/**
 * Parses a date string
 * @param dateString - Date string to parse
 * @returns Date object
 * @example
 * const date = parseDate('2024-01-01')
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}
