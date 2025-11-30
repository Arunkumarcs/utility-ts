/**
 * Promise Utilities
 * Utilities for working with promises
 */

/**
 * Creates a delay/pause
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 * @example
 * await delay(1000) // Wait 1 second
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a timeout promise that rejects after specified time
 * @param ms - Milliseconds before timeout
 * @param message - Error message
 * @returns Promise that rejects after timeout
 * @example
 * await timeout(5000, 'Operation timed out')
 */
export function timeout(
  ms: number,
  message: string = "Operation timed out"
): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

/**
 * Adds timeout to a promise
 * @param promise - Promise to add timeout to
 * @param ms - Timeout in milliseconds
 * @param message - Error message
 * @returns Promise with timeout
 * @example
 * const result = await withTimeout(fetchData(), 5000, 'Request timed out')
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string = "Operation timed out"
): Promise<T> {
  return Promise.race([promise, timeout(ms, message)]);
}

/**
 * Retries a promise-returning function
 * @param fn - Function that returns a promise
 * @param retries - Number of retries
 * @param delayMs - Delay between retries in milliseconds
 * @returns Promise that resolves with result or rejects after all retries
 * @example
 * const result = await retry(() => fetchData(), 3, 1000)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (i < retries) {
        await delay(delayMs);
      }
    }
  }

  throw lastError!;
}

/**
 * Executes promises in parallel with concurrency limit
 * @param tasks - Array of promise-returning functions
 * @param concurrency - Maximum concurrent executions
 * @returns Promise that resolves with array of results
 * @example
 * const results = await parallelLimit([
 *   () => fetchData1(),
 *   () => fetchData2(),
 *   () => fetchData3()
 * ], 2)
 */
export async function parallelLimit<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const promise = task().then((result) => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Executes promises sequentially
 * @param tasks - Array of promise-returning functions
 * @returns Promise that resolves with array of results
 * @example
 * const results = await sequential([
 *   () => step1(),
 *   () => step2(),
 *   () => step3()
 * ])
 */
export async function sequential<T>(
  tasks: Array<() => Promise<T>>
): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

/**
 * Creates a promise that resolves or rejects based on condition
 * @param condition - Condition to check
 * @param resolveValue - Value to resolve with if condition is true
 * @param rejectError - Error to reject with if condition is false
 * @returns Promise
 * @example
 * await conditionalPromise(isValid, data, new Error('Invalid'))
 */
export function conditionalPromise<T>(
  condition: boolean,
  resolveValue: T,
  rejectError: Error
): Promise<T> {
  return condition
    ? Promise.resolve(resolveValue)
    : Promise.reject(rejectError);
}

/**
 * Wraps a callback-based function to return a promise
 * @param fn - Function with callback
 * @returns Promise-returning function
 * @example
 * const promiseFn = promisify(fs.readFile)
 * const data = await promiseFn('file.txt', 'utf8')
 */
export function promisify<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Promise<any> {
  return (...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      fn(...args, (error: Error | null, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

/**
 * Creates a debounced function
 * @param fn - Function to debounce
 * @param ms - Debounce delay in milliseconds
 * @returns Debounced function
 * @example
 * const debounced = debounce((value) => console.log(value), 300)
 * debounced('hello') // Only logs after 300ms of no calls
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Creates a throttled function
 * @param fn - Function to throttle
 * @param ms - Throttle delay in milliseconds
 * @returns Throttled function
 * @example
 * const throttled = throttle((value) => console.log(value), 300)
 * throttled('hello') // Executes immediately, then ignores calls for 300ms
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Creates a promise that can be resolved/rejected externally
 * @returns Promise with resolve and reject methods
 * @example
 * const { promise, resolve, reject } = createDeferred()
 * setTimeout(() => resolve('done'), 1000)
 * const result = await promise
 */
export function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Executes promises and returns all results (including errors)
 * @param promises - Array of promises
 * @returns Promise that resolves with array of results or errors
 * @example
 * const results = await allSettled([promise1, promise2, promise3])
 */
export async function allSettled<T>(
  promises: Promise<T>[]
): Promise<
  Array<{ status: "fulfilled" | "rejected"; value?: T; reason?: Error }>
> {
  return Promise.allSettled(promises).then((results) =>
    results.map((result) => {
      if (result.status === "fulfilled") {
        return { status: "fulfilled" as const, value: result.value };
      } else {
        return { status: "rejected" as const, reason: result.reason as Error };
      }
    })
  );
}

/**
 * Executes all promises and returns results
 * @param promises - Array of promises
 * @returns Promise that resolves with array of results
 * @example
 * const results = await all([promise1, promise2, promise3])
 */
export async function all<T>(promises: Promise<T>[]): Promise<T[]> {
  return Promise.all(promises);
}

/**
 * Executes promises and returns first resolved result
 * @param promises - Array of promises
 * @returns Promise that resolves with first result
 * @example
 * const result = await race([promise1, promise2, promise3])
 */
export async function race<T>(promises: Promise<T>[]): Promise<T> {
  return Promise.race(promises);
}

/**
 * Executes promises and returns first fulfilled result (ignores rejections)
 * @param promises - Array of promises
 * @returns Promise that resolves with first fulfilled result or rejects if all fail
 * @example
 * const result = await any([promise1, promise2, promise3])
 */
export async function any<T>(promises: Promise<T>[]): Promise<T> {
  if (promises.length === 0) {
    throw new Error("At least one promise is required");
  }

  const errors: Error[] = [];
  let completed = 0;

  return new Promise<T>((resolve, reject) => {
    for (const promise of promises) {
      promise
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          errors.push(error);
          completed++;
          if (completed === promises.length) {
            const aggregateError = new Error("All promises were rejected");
            (aggregateError as any).errors = errors;
            reject(aggregateError);
          }
        });
    }
  });
}

/**
 * Maps over an array with a promise-returning function in parallel
 * @param array - Array to map over
 * @param fn - Promise-returning function to apply to each element
 * @param concurrency - Optional concurrency limit (default: unlimited)
 * @returns Promise that resolves with mapped array
 * @example
 * const results = await pMap([1, 2, 3], async (n) => n * 2)
 * // results: [2, 4, 6]
 */
export async function pMap<T, R>(
  array: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency?: number
): Promise<R[]> {
  if (concurrency === undefined || concurrency <= 0) {
    return Promise.all(array.map((item, index) => fn(item, index)));
  }

  const results: R[] = Array.from({ length: array.length });
  const executing: Promise<void>[] = [];
  let index = 0;

  const executeNext = async (): Promise<void> => {
    if (index >= array.length) {
      return;
    }

    const currentIndex = index++;
    const item = array[currentIndex];
    const promise = fn(item, currentIndex)
      .then((result) => {
        results[currentIndex] = result;
      })
      .finally(() => {
        executing.splice(executing.indexOf(promise), 1);
        if (index < array.length) {
          executing.push(executeNext());
        }
      });

    executing.push(promise);

    if (executing.length < concurrency && index < array.length) {
      await executeNext();
    }
  };

  // Start initial batch
  const initialBatch = Math.min(concurrency, array.length);
  for (let i = 0; i < initialBatch; i++) {
    executing.push(executeNext());
  }

  await Promise.all(executing);
  return results;
}

/**
 * Filters an array with a promise-returning predicate in parallel
 * @param array - Array to filter
 * @param fn - Promise-returning predicate function
 * @param concurrency - Optional concurrency limit (default: unlimited)
 * @returns Promise that resolves with filtered array
 * @example
 * const results = await pFilter([1, 2, 3, 4], async (n) => n % 2 === 0)
 * // results: [2, 4]
 */
export async function pFilter<T>(
  array: T[],
  fn: (item: T, index: number) => Promise<boolean>,
  concurrency?: number
): Promise<T[]> {
  const results: boolean[] = await pMap(
    array,
    (item, index) => fn(item, index),
    concurrency
  );

  return array.filter((_, index) => results[index]);
}

/**
 * Reduces an array with a promise-returning reducer function
 * @param array - Array to reduce
 * @param fn - Promise-returning reducer function
 * @param initialValue - Initial accumulator value
 * @returns Promise that resolves with reduced value
 * @example
 * const sum = await pReduce([1, 2, 3], async (acc, n) => acc + n, 0)
 * // sum: 6
 */
export async function pReduce<T, R>(
  array: T[],
  fn: (accumulator: R, item: T, index: number) => Promise<R>,
  initialValue: R
): Promise<R> {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    accumulator = await fn(accumulator, array[i], i);
  }

  return accumulator;
}

/**
 * Executes a promise-returning function for each element in parallel
 * @param array - Array to iterate over
 * @param fn - Promise-returning function to execute
 * @param concurrency - Optional concurrency limit (default: unlimited)
 * @returns Promise that resolves when all executions complete
 * @example
 * await pEach([1, 2, 3], async (n) => console.log(n))
 */
export async function pEach<T>(
  array: T[],
  fn: (item: T, index: number) => Promise<void>,
  concurrency?: number
): Promise<void> {
  await pMap(array, fn, concurrency);
}

/**
 * Executes a promise-returning function N times in parallel
 * @param count - Number of times to execute
 * @param fn - Promise-returning function to execute
 * @param concurrency - Optional concurrency limit (default: unlimited)
 * @returns Promise that resolves with array of results
 * @example
 * const results = await pTimes(5, async (index) => fetchData(index))
 */
export async function pTimes<T>(
  count: number,
  fn: (index: number) => Promise<T>,
  concurrency?: number
): Promise<T[]> {
  const array = Array.from({ length: count }, (_, i) => i);
  return pMap(array, (index) => fn(index), concurrency);
}
