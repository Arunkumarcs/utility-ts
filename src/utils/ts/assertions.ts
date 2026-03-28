/**
 * TypeScript Assertions
 * Type assertion functions
 */

/**
 * Asserts that value is not null or undefined, throws if it is
 * @param value - Value to assert
 * @param message - Error message
 * @returns Value (non-null)
 * @throws Error if value is null or undefined
 * @example
 * const value = assertNotNull(getValue(), 'Value is required')
 */
export function assertNotNull<T>(
  value: T | null | undefined,
  message: string = "Value is null or undefined"
): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}

/**
 * Asserts that value is of a specific type
 * @param value - Value to assert
 * @param guard - Type guard function
 * @param message - Error message
 * @returns Value (typed)
 * @throws Error if guard returns false
 * @example
 * const str = assertType(value, isString, 'Value must be a string')
 */
export function assertType<T>(
  value: unknown,
  guard: (val: unknown) => val is T,
  message: string = "Type assertion failed"
): T {
  if (!guard(value)) {
    throw new Error(message);
  }
  return value;
}
