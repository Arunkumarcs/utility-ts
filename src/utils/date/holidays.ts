/**
 * Holiday Utilities
 * Functions for working with holidays and working days
 */

import { isBusinessDay } from "./business";

/**
 * Gets the number of working days between two dates (excluding weekends and holidays)
 * @param start - Start date
 * @param end - End date
 * @param holidays - Array of holiday dates to exclude (default: [])
 * @returns Number of working days
 * @example
 * const days = getWorkingDays(startDate, endDate, [new Date('2024-12-25')])
 */
export function getWorkingDays(
  start: Date,
  end: Date,
  holidays: Date[] = []
): number {
  let count = 0;
  const current = new Date(start);
  const endDate = new Date(end);
  const holidaySet = new Set(
    holidays.map((h) => {
      const d = new Date(h);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  // Normalize to start of day
  current.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    if (isBusinessDay(current) && !holidaySet.has(current.getTime())) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Checks if a date is a holiday
 * @param date - Date to check
 * @param holidays - Array of holiday dates
 * @returns True if holiday
 * @example
 * const isHoliday = isHoliday(new Date('2024-12-25'), [new Date('2024-12-25')])
 */
export function isHoliday(date: Date, holidays: Date[]): boolean {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return holidays.some((holiday) => {
    const h = new Date(holiday);
    h.setHours(0, 0, 0, 0);
    return h.getTime() === checkDate.getTime();
  });
}

/**
 * Gets common US holidays for a given year
 * @param year - Year to get holidays for
 * @returns Array of holiday dates
 * @example
 * const holidays = getUSHolidays(2024)
 */
export function getUSHolidays(year: number): Date[] {
  const holidays: Date[] = [];

  // New Year's Day
  holidays.push(new Date(year, 0, 1));

  // Martin Luther King Jr. Day (third Monday in January)
  const mlkDay = new Date(year, 0, 1);
  while (mlkDay.getDay() !== 1) {
    mlkDay.setDate(mlkDay.getDate() + 1);
  }
  mlkDay.setDate(mlkDay.getDate() + 14); // Third Monday
  holidays.push(mlkDay);

  // Presidents' Day (third Monday in February)
  const presDay = new Date(year, 1, 1);
  while (presDay.getDay() !== 1) {
    presDay.setDate(presDay.getDate() + 1);
  }
  presDay.setDate(presDay.getDate() + 14);
  holidays.push(presDay);

  // Memorial Day (last Monday in May)
  const memDay = new Date(year, 4, 31);
  while (memDay.getDay() !== 1) {
    memDay.setDate(memDay.getDate() - 1);
  }
  holidays.push(memDay);

  // Independence Day
  holidays.push(new Date(year, 6, 4));

  // Labor Day (first Monday in September)
  const laborDay = new Date(year, 8, 1);
  while (laborDay.getDay() !== 1) {
    laborDay.setDate(laborDay.getDate() + 1);
  }
  holidays.push(laborDay);

  // Columbus Day (second Monday in October)
  const columbusDay = new Date(year, 9, 1);
  while (columbusDay.getDay() !== 1) {
    columbusDay.setDate(columbusDay.getDate() + 1);
  }
  columbusDay.setDate(columbusDay.getDate() + 7);
  holidays.push(columbusDay);

  // Veterans Day
  holidays.push(new Date(year, 10, 11));

  // Thanksgiving (fourth Thursday in November)
  const thanksgiving = new Date(year, 10, 1);
  let thursdayCount = 0;
  while (thursdayCount < 4) {
    if (thanksgiving.getDay() === 4) {
      thursdayCount++;
      if (thursdayCount < 4) {
        thanksgiving.setDate(thanksgiving.getDate() + 7);
      }
    } else {
      thanksgiving.setDate(thanksgiving.getDate() + 1);
    }
  }
  holidays.push(thanksgiving);

  // Christmas
  holidays.push(new Date(year, 11, 25));

  return holidays;
}
