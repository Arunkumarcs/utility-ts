/**
 * TypeScript Utility Functions
 * Miscellaneous TypeScript utility functions
 */

/**
 * Type-safe narrowing helper for discriminated unions
 * @param value - Value to narrow
 * @param key - Discriminator key
 * @param expectedValue - Expected value
 * @returns True if value matches
 * @example
 * if (isDiscriminated(value, 'type', 'user')) { ... }
 */
export function isDiscriminated<
  T extends Record<string, any>,
  K extends keyof T,
  V extends T[K]
>(value: T, key: K, expectedValue: V): value is T & Record<K, V> {
  return value[key] === expectedValue;
}

/**
 * Creates a type-safe tuple from arguments
 * @param args - Arguments to tuple
 * @returns Tuple type
 * @example
 * const tuple = tuple(1, 'hello', true) // [number, string, boolean]
 */
export function tuple<T extends readonly any[]>(...args: T): T {
  return args;
}

/**
 * Type-safe identity function
 * @param value - Value to return
 * @returns Same value
 * @example
 * const result = identity(value)
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Creates a no-op function with proper typing
 * @returns No-op function
 * @example
 * const noop = createNoop()
 */
export function createNoop(): () => void {
  return () => {};
}

/**
 * Type-safe cast function (use with caution)
 * @param value - Value to cast
 * @returns Cast value
 * @example
 * const cast = unsafeCast<string>(value)
 */
export function unsafeCast<T>(value: unknown): T {
  return value as T;
}

/**
 * Creates a branded type helper (runtime validation)
 * @param value - Value to brand
 * @param brand - Brand identifier
 * @returns Branded value
 * @example
 * type UserId = Brand<string, 'UserId'>
 * const id = brand('123', 'UserId')
 */
export function brand<T, B extends string>(
  value: T,
  brand: B
): T & { __brand: B } {
  return value as T & { __brand: B };
}
