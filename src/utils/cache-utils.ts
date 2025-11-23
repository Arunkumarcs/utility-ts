/**
 * Cache Utilities
 * Utilities for caching data
 */

/**
 * Simple in-memory cache
 */
export class Cache<T> {
  private cache: Map<string, { value: T; expires?: number }> = new Map();

  /**
   * Sets a value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds
   * @example
   * cache.set('key', 'value', 60000) // Expires in 1 minute
   */
  set(key: string, value: T, ttl?: number): void {
    const expires = ttl ? Date.now() + ttl : undefined;
    this.cache.set(key, { value, expires });
  }

  /**
   * Gets a value from cache
   * @param key - Cache key
   * @returns Cached value or undefined
   * @example
   * const value = cache.get('key')
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }
    return item.value;
  }

  /**
   * Checks if key exists in cache
   * @param key - Cache key
   * @returns True if exists and not expired
   * @example
   * const exists = cache.has('key')
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Deletes a key from cache
   * @param key - Cache key
   * @returns True if deleted
   * @example
   * cache.delete('key')
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all cache
   * @example
   * cache.clear()
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Gets cache size
   * @returns Number of items in cache
   * @example
   * const size = cache.size()
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Creates a new cache instance
 * @returns Cache instance
 * @example
 * const cache = createCache<string>()
 */
export function createCache<T>(): Cache<T> {
  return new Cache<T>();
}

/**
 * Creates a memoized function
 * @param fn - Function to memoize
 * @param ttl - Cache TTL in milliseconds
 * @returns Memoized function
 * @example
 * const memoized = memoize((n) => n * 2, 60000)
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  ttl?: number
): T {
  const cache = createCache<ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const result = fn(...args);
    cache.set(key, result, ttl);
    return result;
  }) as T;
}
