/**
 * Timers Utilities
 * Utilities for Node.js timers module
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

/**
 * Executes a function with a timeout
 * @param fn - Function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @param errorMessage - Optional error message
 * @returns Promise that resolves with function result or rejects on timeout
 * @example
 * const result = await withTimeout(() => fetchData(), 5000)
 */
export async function withTimeout<T>(
  fn: () => T | Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<T> {
  return Promise.race([
    Promise.resolve(fn()),
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              errorMessage || `Operation timed out after ${timeoutMs}ms`
            )
          ),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Creates a retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param initialDelayMs - Initial delay in milliseconds
 * @param backoffMultiplier - Backoff multiplier (default: 2)
 * @returns Promise that resolves with function result
 * @example
 * const result = await retryWithBackoff(() => fetchData(), 3, 1000)
 */
export async function retryWithBackoff<T>(
  fn: () => T | Promise<T>,
  maxRetries: number,
  initialDelayMs: number,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error | null = null;
  let delayMs = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await delay(delayMs);
        delayMs *= backoffMultiplier;
      }
    }
  }

  throw lastError || new Error("Retry failed");
}

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

/**
 * Creates a rate limiter
 * @param maxCalls - Maximum number of calls
 * @param windowMs - Time window in milliseconds
 * @returns Rate limiter function
 * @example
 * const limiter = createRateLimiter(10, 1000) // 10 calls per second
 * if (limiter()) { execute() }
 */
export function createRateLimiter(
  maxCalls: number,
  windowMs: number
): () => boolean {
  const calls: number[] = [];

  return () => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove old calls outside the window
    while (calls.length > 0 && calls[0] < windowStart) {
      calls.shift();
    }

    if (calls.length < maxCalls) {
      calls.push(now);
      return true;
    }

    return false;
  };
}

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
