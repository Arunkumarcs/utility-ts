/**
 * Date Comparison Utilities
 * Functions for comparing dates
 */

/**
 * Checks if date is in the past
 * @param date - Date to check
 * @returns True if in past
 * @example
 * const isPast = isPastDate(date)
 */
export function isPastDate(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Checks if date is in the future
 * @param date - Date to check
 * @returns True if in future
 * @example
 * const isFuture = isFutureDate(date)
 */
export function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Checks if date is today
 * @param date - Date to check
 * @returns True if today
 * @example
 * const isToday = isToday(date)
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if date is between two dates
 * @param date - Date to check
 * @param start - Start date
 * @param end - End date
 * @returns True if date is between start and end
 * @example
 * const isBetween = isDateBetween(date, startDate, endDate)
 */
export function isDateBetween(date: Date, start: Date, end: Date): boolean {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}
