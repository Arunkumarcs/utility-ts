/**
 * Object Access Utilities
 * Functions for accessing object properties
 */

/**
 * Gets object keys as array
 * @param obj - Object
 * @returns Array of keys
 * @example
 * const keys = keys({ a: 1, b: 2 }) // ['a', 'b']
 */
export function keys<T extends Record<string, any>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Gets object values as array
 * @param obj - Object
 * @returns Array of values
 * @example
 * const values = values({ a: 1, b: 2 }) // [1, 2]
 */
export function values<T extends Record<string, any>>(obj: T): T[keyof T][] {
  return Object.values(obj);
}

/**
 * Gets object entries as array
 * @param obj - Object
 * @returns Array of [key, value] tuples
 * @example
 * const entries = entries({ a: 1, b: 2 }) // [['a', 1], ['b', 2]]
 */
export function entries<T extends Record<string, any>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Creates object from entries
 * @param entries - Array of [key, value] tuples
 * @returns Object
 * @example
 * const obj = fromEntries([['a', 1], ['b', 2]]) // { a: 1, b: 2 }
 */
export function fromEntries<K extends string, V>(
  entries: Array<[K, V]>
): Record<K, V> {
  const result = {} as Record<K, V>;
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}
