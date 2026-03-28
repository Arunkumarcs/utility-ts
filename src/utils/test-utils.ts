/**
 * Test Utilities
 * Utilities for testing
 */

/**
 * Creates a mock function
 * @param returnValue - Value to return
 * @returns Mock function
 * @example
 * const mockFn = createMock(() => 'result')
 */
export function createMock<T extends (...args: any[]) => any>(
  returnValue?: T | ReturnType<T>
): (...args: Parameters<T>) => ReturnType<T> {
  const mock = (...args: Parameters<T>): ReturnType<T> => {
    if (typeof returnValue === "function") {
      return (returnValue as T)(...args);
    }
    return returnValue as ReturnType<T>;
  };
  return mock;
}

/**
 * Waits for a condition to be true
 * @param condition - Condition function
 * @param timeout - Timeout in milliseconds
 * @param interval - Check interval in milliseconds
 * @returns Promise that resolves when condition is true
 * @example
 * await waitFor(() => element.isVisible(), 5000, 100)
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("Condition not met within timeout");
}

/**
 * Creates a test data generator
 * @param generator - Generator function
 * @returns Generator function
 * @example
 * const gen = createGenerator(() => ({ id: Math.random(), name: 'Test' }))
 */
export function createGenerator<T>(generator: () => T): () => T {
  return generator;
}

/**
 * Creates a spy function that tracks calls
 * @param fn - Function to spy on (optional)
 * @returns Spy function with call tracking
 * @example
 * const spy = createSpy()
 * spy('arg1', 'arg2')
 * console.log(spy.calls) // [['arg1', 'arg2']]
 */
export function createSpy<T extends (...args: any[]) => any>(
  fn?: T
): T & { calls: any[][]; callCount: number; reset: () => void } {
  const calls: any[][] = [];
  const spyFn = ((...args: any[]) => {
    calls.push(args);
    if (fn) {
      return fn(...args);
    }
  }) as any;

  spyFn.calls = calls;
  spyFn.callCount = 0;
  Object.defineProperty(spyFn, "callCount", {
    get: () => calls.length,
  });
  spyFn.reset = () => {
    calls.length = 0;
  };

  return spyFn;
}

/**
 * Creates a mock timer
 * @returns Timer control object
 * @example
 * const timer = createMockTimer()
 * timer.advance(1000) // Advance time by 1 second
 */
export function createMockTimer(): {
  now: number;
  advance: (ms: number) => void;
  reset: () => void;
} {
  let now = Date.now();
  return {
    get now() {
      return now;
    },
    advance(ms: number) {
      now += ms;
    },
    reset() {
      now = Date.now();
    },
  };
}

/**
 * Creates test data with faker-like helpers
 * @returns Test data generator
 * @example
 * const data = createTestData()
 * const name = data.string(10) // Random string of length 10
 */
export function createTestData(): {
  string: (length?: number) => string;
  number: (min?: number, max?: number) => number;
  boolean: () => boolean;
  email: () => string;
  uuid: () => string;
} {
  return {
    string: (length: number = 10) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    },
    number: (min: number = 0, max: number = 100) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    boolean: () => Math.random() >= 0.5,
    email: () => {
      const domains = ["example.com", "test.com", "demo.org"];
      return `${createTestData().string(8)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    },
    uuid: () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
  };
}
