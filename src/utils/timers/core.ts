/**
 * Timer Core Utilities
 * Basic timer functions
 */

export interface TimerOptions {
  immediate?: boolean;
  unref?: boolean;
}

/**
 * Creates a timeout that can be cleared
 * @param fn - Function to execute
 * @param delayMs - Delay in milliseconds
 * @param options - Timer options
 * @returns Timeout ID
 * @example
 * const timeout = setTimeout(() => console.log('Hello'), 1000)
 */
export function setTimeout(
  fn: () => void,
  delayMs: number,
  options?: TimerOptions
): NodeJS.Timeout {
  const timer = global.setTimeout(fn, delayMs);
  if (options?.unref) {
    timer.unref();
  }
  return timer;
}

/**
 * Creates an interval that can be cleared
 * @param fn - Function to execute
 * @param intervalMs - Interval in milliseconds
 * @param options - Timer options
 * @returns Interval ID
 * @example
 * const interval = setInterval(() => console.log('Tick'), 1000)
 */
export function setInterval(
  fn: () => void,
  intervalMs: number,
  options?: TimerOptions
): NodeJS.Timeout {
  const timer = global.setInterval(fn, intervalMs);
  if (options?.unref) {
    timer.unref();
  }
  return timer;
}

/**
 * Creates an immediate timer
 * @param fn - Function to execute
 * @param options - Timer options
 * @returns Immediate ID
 * @example
 * const immediate = setImmediate(() => console.log('Hello'))
 */
export function setImmediate(
  fn: () => void,
  options?: TimerOptions
): NodeJS.Immediate {
  const immediate = global.setImmediate(fn);
  if (options?.unref) {
    immediate.unref();
  }
  return immediate;
}

/**
 * Clears a timeout
 * @param timeoutId - Timeout ID
 * @example
 * clearTimeout(timeoutId)
 */
export function clearTimeout(timeoutId: NodeJS.Timeout): void {
  global.clearTimeout(timeoutId);
}

/**
 * Clears an interval
 * @param intervalId - Interval ID
 * @example
 * clearInterval(intervalId)
 */
export function clearInterval(intervalId: NodeJS.Timeout): void {
  global.clearInterval(intervalId);
}

/**
 * Clears an immediate
 * @param immediateId - Immediate ID
 * @example
 * clearImmediate(immediateId)
 */
export function clearImmediate(immediateId: NodeJS.Immediate): void {
  global.clearImmediate(immediateId);
}

/**
 * Promisified setTimeout
 * @param delayMs - Delay in milliseconds
 * @param value - Optional value to resolve with
 * @returns Promise that resolves after delay
 * @example
 * await delay(1000)
 */
export function delay<T = void>(delayMs: number, value?: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value as T), delayMs);
  });
}
