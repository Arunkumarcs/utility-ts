/**
 * Debounce and Throttle Utilities
 * Functions for debouncing and throttling function calls
 */

import { setTimeout, clearTimeout } from "./core";

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
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
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
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delayMs) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, delayMs - timeSinceLastCall);
    }
  };
}
