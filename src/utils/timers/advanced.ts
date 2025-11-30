/**
 * Advanced Timer Utilities
 * Advanced timer functions with timeout and retry capabilities
 */

import { delay } from "./core";

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
