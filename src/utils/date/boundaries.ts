/**
 * Date Boundary Utilities
 * Functions for getting start/end of periods (day, week, month, year)
 */

/**
 * Gets start of day
 * @param date - Date
 * @returns Date at start of day
 * @example
 * const start = getStartOfDay(new Date())
 */
export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Gets end of day
 * @param date - Date
 * @returns Date at end of day
 * @example
 * const end = getEndOfDay(new Date())
 */
export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Gets start of week
 * @param date - Date
 * @param weekStartsOn - Day week starts on (0 = Sunday, 1 = Monday)
 * @returns Date at start of week
 * @example
 * const start = getStartOfWeek(new Date(), 1) // Monday
 */
export function getStartOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  newDate.setDate(newDate.getDate() - diff);
  return getStartOfDay(newDate);
}

/**
 * Gets start of month
 * @param date - Date
 * @returns Date at start of month
 * @example
 * const start = getStartOfMonth(new Date())
 */
export function getStartOfMonth(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(1);
  return getStartOfDay(newDate);
}

/**
 * Gets end of month
 * @param date - Date
 * @returns Date at end of month
 * @example
 * const end = getEndOfMonth(new Date())
 */
export function getEndOfMonth(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1, 0);
  return getEndOfDay(newDate);
}

/**
 * Gets start of year
 * @param date - Date
 * @returns Date at start of year
 * @example
 * const start = getStartOfYear(new Date())
 */
export function getStartOfYear(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMonth(0, 1);
  return getStartOfDay(newDate);
}

/**
 * Gets end of year
 * @param date - Date
 * @returns Date at end of year
 * @example
 * const end = getEndOfYear(new Date())
 */
export function getEndOfYear(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMonth(11, 31);
  return getEndOfDay(newDate);
}
