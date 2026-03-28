/**
 * TypeScript Access Utilities
 * Type-safe object access functions
 */

/**
 * Gets a value or returns a default
 * @param value - Value to check
 * @param defaultValue - Default value
 * @returns Value or default
 * @example
 * const name = getOrDefault(value, 'Unknown')
 */
export function getOrDefault<T>(
  value: T | null | undefined,
  defaultValue: T
): T {
  return value ?? defaultValue;
}

/**
 * Gets a value or throws an error
 * @param value - Value to check
 * @param message - Error message
 * @returns Value (non-null)
 * @throws Error if value is null or undefined
 * @example
 * const name = getOrThrow(value, 'Name is required')
 */
export function getOrThrow<T>(
  value: T | null | undefined,
  message: string = "Value is required"
): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}

/**
 * Type-safe keyof that works with any object
 * @param obj - Object to get keys from
 * @returns Array of keys
 * @example
 * const keys = getKeys({ a: 1, b: 2 }) // ['a', 'b']
 */
export function getKeys<T extends Record<string, any>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Type-safe Object.entries
 * @param obj - Object to get entries from
 * @returns Array of [key, value] tuples
 * @example
 * const entries = getEntries({ a: 1, b: 2 }) // [['a', 1], ['b', 2]]
 */
export function getEntries<T extends Record<string, any>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Type-safe Object.values
 * @param obj - Object to get values from
 * @returns Array of values
 * @example
 * const values = getValues({ a: 1, b: 2 }) // [1, 2]
 */
export function getValues<T extends Record<string, any>>(
  obj: T
): Array<T[keyof T]> {
  return Object.values(obj);
}

/**
 * Checks if a key exists in an object (type-safe)
 * @param obj - Object to check
 * @param key - Key to check
 * @returns True if key exists
 * @example
 * if (hasKey(obj, 'name')) { ... }
 */
export function hasKey<T extends Record<string, any>>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return key in obj;
}

/**
 * Gets a property from an object safely
 * @param obj - Object to get property from
 * @param key - Key to get
 * @param defaultValue - Default value if not found
 * @returns Property value or default
 * @example
 * const value = getProperty(obj, 'name', 'Unknown')
 */
export function getProperty<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  key: K,
  defaultValue?: T[K]
): T[K] | undefined {
  return key in obj ? obj[key] : defaultValue;
}
