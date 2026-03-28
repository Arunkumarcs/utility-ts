/**
 * Timezone Utilities
 * Functions for timezone conversions and offset calculations
 */

/**
 * Converts a date to a different timezone
 * @param date - Date to convert
 * @param timezone - Target timezone (IANA timezone identifier, e.g., 'America/New_York')
 * @returns Date string in target timezone
 * @example
 * const nyTime = convertToTimezone(new Date(), 'America/New_York')
 */
export function convertToTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Gets the timezone offset in minutes for a given timezone
 * @param timezone - IANA timezone identifier
 * @param date - Date to check offset for (default: now)
 * @returns Offset in minutes
 * @example
 * const offset = getTimezoneOffset('America/New_York')
 */
export function getTimezoneOffset(
  timezone: string,
  date: Date = new Date()
): number {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
}

/**
 * Converts a date from one timezone to another
 * @param date - Date to convert
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns New Date object in target timezone
 * @example
 * const converted = convertBetweenTimezones(new Date(), 'UTC', 'America/New_York')
 */
export function convertBetweenTimezones(
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date {
  const fromOffset = getTimezoneOffset(fromTimezone, date);
  const toOffset = getTimezoneOffset(toTimezone, date);
  const offsetDiff = (toOffset - fromOffset) * 60 * 1000;
  return new Date(date.getTime() + offsetDiff);
}
