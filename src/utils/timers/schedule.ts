/**
 * Schedule Utilities
 * Functions for scheduling functions at specific times
 */

import { setTimeout } from "./core";

/**
 * Schedules a function to run at a specific time
 * @param fn - Function to execute
 * @param targetTime - Target time (Date or timestamp)
 * @returns Timeout ID
 * @example
 * const timeout = scheduleAt(() => console.log('Hello'), new Date(Date.now() + 5000))
 */
export function scheduleAt(
  fn: () => void,
  targetTime: Date | number
): NodeJS.Timeout {
  const target =
    typeof targetTime === "number" ? targetTime : targetTime.getTime();
  const now = Date.now();
  const delay = Math.max(0, target - now);
  return setTimeout(fn, delay);
}
