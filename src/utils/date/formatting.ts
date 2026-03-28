/**
 * Date Formatting Utilities
 * Functions for formatting dates in various ways
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
 * Formats a date with locale support
 * @param date - Date to format
 * @param locale - Locale string (e.g., 'en-US', 'fr-FR', 'de-DE')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * @example
 * const formatted = formatDateLocale(new Date(), 'en-US', { dateStyle: 'full' })
 */
export function formatDateLocale(
  date: Date,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats a date with custom locale and preset style
 * @param date - Date to format
 * @param locale - Locale string
 * @param style - Preset style ('full', 'long', 'medium', 'short')
 * @returns Formatted date string
 * @example
 * const formatted = formatDateWithStyle(new Date(), 'en-US', 'full')
 */
export function formatDateWithStyle(
  date: Date,
  locale: string = "en-US",
  style: "full" | "long" | "medium" | "short" = "medium"
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: style,
  }).format(date);
}

/**
 * Formats a date and time with locale support
 * @param date - Date to format
 * @param locale - Locale string
 * @param options - Format options
 * @returns Formatted date and time string
 * @example
 * const formatted = formatDateTimeLocale(new Date(), 'en-US')
 */
export function formatDateTimeLocale(
  date: Date,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
    ...options,
  }).format(date);
}
