/**
 * Business Day Utilities
 * Functions for working with business days (Monday-Friday)
 */

/**
 * Checks if a date is a business day (Monday-Friday)
 * @param date - Date to check
 * @returns True if business day
 * @example
 * const isBusiness = isBusinessDay(new Date())
 */
export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
}

/**
 * Gets the next business day
 * @param date - Starting date
 * @returns Next business day
 * @example
 * const next = getNextBusinessDay(new Date())
 */
export function getNextBusinessDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  while (!isBusinessDay(next)) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

/**
 * Gets the previous business day
 * @param date - Starting date
 * @returns Previous business day
 * @example
 * const prev = getPreviousBusinessDay(new Date())
 */
export function getPreviousBusinessDay(date: Date): Date {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  while (!isBusinessDay(prev)) {
    prev.setDate(prev.getDate() - 1);
  }
  return prev;
}

/**
 * Adds business days to a date
 * @param date - Starting date
 * @param days - Number of business days to add
 * @returns New date
 * @example
 * const future = addBusinessDays(new Date(), 5)
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let remaining = days;
  const direction = days > 0 ? 1 : -1;

  while (remaining !== 0) {
    result.setDate(result.getDate() + direction);
    if (isBusinessDay(result)) {
      remaining -= direction;
    }
  }

  return result;
}

/**
 * Gets the number of business days between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Number of business days
 * @example
 * const days = getBusinessDaysBetween(startDate, endDate)
 */
export function getBusinessDaysBetween(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  const endDate = new Date(end);

  // Normalize to start of day
  current.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    if (isBusinessDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}
