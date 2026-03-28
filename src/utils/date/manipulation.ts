/**
 * Date Manipulation Utilities
 * Functions for adding, subtracting, and calculating differences between dates
 */

/**
 * Adds time to a date
 * @param date - Base date
 * @param amount - Amount to add
 * @param unit - Unit (ms, s, m, h, d, w, M, y)
 * @returns New date
 * @example
 * const future = addTime(new Date(), 1, 'd') // Add 1 day
 */
export function addTime(
  date: Date,
  amount: number,
  unit: "ms" | "s" | "m" | "h" | "d" | "w" | "M" | "y"
): Date {
  const newDate = new Date(date);
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  };

  newDate.setTime(newDate.getTime() + amount * multipliers[unit]);
  return newDate;
}

/**
 * Subtracts time from a date
 * @param date - Base date
 * @param amount - Amount to subtract
 * @param unit - Unit (ms, s, m, h, d, w, M, y)
 * @returns New date
 * @example
 * const past = subtractTime(new Date(), 1, 'd') // Subtract 1 day
 */
export function subtractTime(
  date: Date,
  amount: number,
  unit: "ms" | "s" | "m" | "h" | "d" | "w" | "M" | "y"
): Date {
  return addTime(date, -amount, unit);
}

/**
 * Gets difference between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Unit for difference (ms, s, m, h, d)
 * @returns Difference in specified unit
 * @example
 * const diff = getDifference(date1, date2, 'd') // Difference in days
 */
export function getDifference(
  date1: Date,
  date2: Date,
  unit: "ms" | "s" | "m" | "h" | "d" = "ms"
): number {
  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return diffMs / multipliers[unit];
}
