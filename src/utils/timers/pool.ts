/**
 * Timer Pool Utilities
 * Functions for managing multiple timers
 */

import { setTimeout, setInterval, clearTimeout, clearInterval } from "./core";

/**
 * Creates a timer pool for managing multiple timers
 * @returns Timer pool object
 * @example
 * const pool = createTimerPool()
 * pool.add('timer1', () => console.log('Tick'), 1000)
 * pool.clear('timer1')
 */
export function createTimerPool(): {
  add: (id: string, fn: () => void, delayMs: number) => void;
  addInterval: (id: string, fn: () => void, intervalMs: number) => void;
  clear: (id: string) => void;
  clearAll: () => void;
  has: (id: string) => boolean;
} {
  const timers = new Map<string, NodeJS.Timeout>();

  return {
    add: (id: string, fn: () => void, delayMs: number) => {
      if (timers.has(id)) {
        clearTimeout(timers.get(id)!);
      }
      timers.set(id, setTimeout(fn, delayMs));
    },
    addInterval: (id: string, fn: () => void, intervalMs: number) => {
      if (timers.has(id)) {
        clearInterval(timers.get(id)!);
      }
      timers.set(id, setInterval(fn, intervalMs));
    },
    clear: (id: string) => {
      const timer = timers.get(id);
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
        timers.delete(id);
      }
    },
    clearAll: () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      timers.clear();
    },
    has: (id: string) => timers.has(id),
  };
}
