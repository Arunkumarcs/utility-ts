/**
 * Date Utilities
 * Utilities for working with dates and times
 */

/**
 * Formats a date to ISO string
 * @param date - Date to format (default: now)
 * @returns ISO string
 * @example
 * const iso = formatISO() // '2024-01-01T00:00:00.000Z'
 */
export function formatISO(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Formats a date to a custom string
 * @param date - Date to format
 * @param format - Format string (YYYY, MM, DD, HH, mm, ss)
 * @returns Formatted string
 * @example
 * const formatted = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

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

/**
 * Formats date to relative time string (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 * @example
 * const relative = formatRelativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    return formatDate(date, "YYYY-MM-DD");
  }
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
