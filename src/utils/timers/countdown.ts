/**
 * Countdown Timer Utilities
 * Functions for creating countdown timers
 */

import { setInterval, clearInterval } from "./core";

/**
 * Creates a countdown timer
 * @param durationMs - Countdown duration
 * @param onTick - Callback for each tick
 * @param onComplete - Callback when complete
 * @returns Countdown timer object
 * @example
 * const countdown = createCountdown(10000, (remaining) => console.log(remaining), () => console.log('Done'))
 * countdown.start()
 */
export function createCountdown(
  durationMs: number,
  onTick: (remainingMs: number) => void,
  onComplete: () => void
): {
  start: () => void;
  stop: () => void;
  reset: () => void;
  getRemaining: () => number;
} {
  let startTime: number | null = null;
  let remaining = durationMs;
  let intervalId: NodeJS.Timeout | null = null;

  return {
    start: () => {
      if (intervalId) {
        return;
      }
      startTime = Date.now();
      intervalId = setInterval(() => {
        if (startTime) {
          const elapsed = Date.now() - startTime;
          remaining = Math.max(0, durationMs - elapsed);
          onTick(remaining);
          if (remaining === 0) {
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
            onComplete();
          }
        }
      }, 100);
    },
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (startTime) {
        const elapsed = Date.now() - startTime;
        remaining = Math.max(0, remaining - elapsed);
        startTime = null;
      }
    },
    reset: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      remaining = durationMs;
      startTime = null;
    },
    getRemaining: () => remaining,
  };
}
