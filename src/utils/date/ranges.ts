/**
 * Date Range Utilities
 * Functions for generating date ranges
 */

/**
 * Generates a range of dates
 * @param start - Start date
 * @param end - End date
 * @param step - Step size in days (default: 1)
 * @returns Array of dates
 * @example
 * const range = generateDateRange(new Date('2024-01-01'), new Date('2024-01-10'), 1)
 */
export function generateDateRange(
  start: Date,
  end: Date,
  step: number = 1
): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  const endDate = new Date(end);

  // Normalize to start of day
  current.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + step);
  }

  return dates;
}
