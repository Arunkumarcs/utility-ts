/**
 * Recurring Date Pattern Utilities
 * Functions for parsing cron-like patterns and generating recurring dates
 */

/**
 * Simple cron-like pattern parser for recurring dates
 * Supports: minute hour day month dayOfWeek
 * @param pattern - Cron pattern (e.g., "0 9 * * 1-5" for 9 AM weekdays)
 * @param startDate - Start date for pattern matching
 * @param count - Number of dates to generate (default: 10)
 * @returns Array of matching dates
 * @example
 * const dates = parseRecurringPattern("0 9 * * 1-5", new Date(), 5) // 9 AM weekdays
 */
export function parseRecurringPattern(
  pattern: string,
  startDate: Date = new Date(),
  count: number = 10
): Date[] {
  const parts = pattern.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(
      "Cron pattern must have 5 parts: minute hour day month dayOfWeek"
    );
  }

  const [minute, hour, day, month, dayOfWeek] = parts;
  const results: Date[] = [];
  const current = new Date(startDate);
  current.setSeconds(0, 0);

  function matches(value: number, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern.includes(",")) {
      return pattern.split(",").some((p) => matches(value, p.trim()));
    }
    if (pattern.includes("-")) {
      const [start, end] = pattern.split("-").map(Number);
      return value >= start && value <= end;
    }
    if (pattern.includes("/")) {
      const [base, step] = pattern.split("/").map(Number);
      return value % step === base % step;
    }
    return Number(pattern) === value;
  }

  let attempts = 0;
  const maxAttempts = 365 * 24 * 60; // Prevent infinite loops

  while (results.length < count && attempts < maxAttempts) {
    const currentMinute = current.getMinutes();
    const currentHour = current.getHours();
    const currentDay = current.getDate();
    const currentMonth = current.getMonth() + 1; // 1-12
    const currentDayOfWeek = current.getDay(); // 0-6, Sunday = 0

    if (
      matches(currentMinute, minute) &&
      matches(currentHour, hour) &&
      matches(currentDay, day) &&
      matches(currentMonth, month) &&
      matches(currentDayOfWeek, dayOfWeek)
    ) {
      results.push(new Date(current));
    }

    current.setMinutes(current.getMinutes() + 1);
    attempts++;
  }

  return results;
}
