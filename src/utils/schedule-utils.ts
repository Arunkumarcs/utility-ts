/**
 * Schedule Utilities
 * Utilities for scheduling tasks
 */

/**
 * Schedules a function to run after delay
 * @param fn - Function to execute
 * @param delayMs - Delay in milliseconds
 * @returns Timeout ID
 * @example
 * const id = schedule(() => console.log('Hello'), 1000)
 */
export function schedule(fn: () => void, delayMs: number): NodeJS.Timeout {
  return setTimeout(fn, delayMs);
}

/**
 * Schedules a function to run repeatedly
 * @param fn - Function to execute
 * @param intervalMs - Interval in milliseconds
 * @returns Interval ID
 * @example
 * const id = scheduleInterval(() => console.log('Tick'), 1000)
 */
export function scheduleInterval(
  fn: () => void,
  intervalMs: number
): NodeJS.Timeout {
  return setInterval(fn, intervalMs);
}

/**
 * Cancels a scheduled task
 * @param id - Timeout/Interval ID
 * @example
 * cancelSchedule(id)
 */
export function cancelSchedule(id: NodeJS.Timeout): void {
  clearTimeout(id);
  clearInterval(id);
}

/**
 * Creates a debounced function
 * @param fn - Function to debounce
 * @param delayMs - Debounce delay
 * @returns Debounced function
 * @example
 * const debounced = debounce(() => console.log('Hello'), 300)
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Creates a throttled function
 * @param fn - Function to throttle
 * @param delayMs - Throttle delay
 * @returns Throttled function
 * @example
 * const throttled = throttle(() => console.log('Hello'), 300)
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      fn(...args);
    }
  };
}
