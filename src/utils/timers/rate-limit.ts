/**
 * Rate Limiter Utilities
 * Functions for rate limiting
 */

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
