/**
 * Object Transform Utilities
 * Functions for transforming object structure
 */

/**
 * Inverts object keys and values
 * @param obj - Object to invert
 * @returns Inverted object
 * @example
 * const inverted = invert({ a: 1, b: 2 }) // { 1: 'a', 2: 'b' }
 */
export function invert<T extends Record<string, string | number>>(
  obj: T
): Record<string | number, keyof T> {
  const result: any = {};
  for (const key in obj) {
    result[obj[key]] = key;
  }
  return result;
}

/**
 * Maps object values
 * @param obj - Object
 * @param fn - Mapping function
 * @returns Object with mapped values
 * @example
 * const mapped = mapValues({ a: 1, b: 2 }, v => v * 2) // { a: 2, b: 4 }
 */
export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  for (const key in obj) {
    result[key] = fn(obj[key], key);
  }
  return result;
}

/**
 * Maps object keys
 * @param obj - Object
 * @param fn - Mapping function
 * @returns Object with mapped keys
 * @example
 * const mapped = mapKeys({ a: 1, b: 2 }, k => k.toUpperCase()) // { A: 1, B: 2 }
 */
export function mapKeys<T>(
  obj: Record<string, T>,
  fn: (key: string, value: T) => string
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key in obj) {
    result[fn(key, obj[key])] = obj[key];
  }
  return result;
}

/**
 * Inverts object with value transformation
 * @param obj - Object to invert
 * @param valueTransform - Function to transform values
 * @returns Inverted object with transformed values
 * @example
 * const inverted = invertBy({ a: 1, b: 2 }, (value) => `val_${value}`) // { 1: ['a'], 2: ['b'] }
 */
export function invertBy<T extends Record<string, any>>(
  obj: T,
  valueTransform?: (value: T[keyof T], key: keyof T) => any
): Record<string, any[]> {
  const result: Record<string, any[]> = {};
  for (const key in obj) {
    const value = valueTransform ? valueTransform(obj[key], key) : obj[key];
    const valueKey = String(value);
    if (!result[valueKey]) {
      result[valueKey] = [];
    }
    result[valueKey].push(key);
  }
  return result;
}

/**
 * Creates object keyed by function result
 * @param array - Array of items
 * @param keyFn - Function to generate key from item
 * @returns Object keyed by function result
 * @example
 * const keyed = keyBy([{ id: 1, name: 'a' }, { id: 2, name: 'b' }], item => item.id) // { 1: { id: 1, name: 'a' }, 2: { id: 2, name: 'b' } }
 */
export function keyBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T> {
  const result: any = {};
  for (const item of array) {
    const key = keyFn(item);
    result[key] = item;
  }
  return result;
}

/**
 * Partitions object by predicate
 * @param obj - Object to partition
 * @param predicate - Predicate function
 * @returns Tuple with [matching, non-matching] objects
 * @example
 * const [truthy, falsy] = partitionBy({ a: 1, b: 0, c: 2 }, (value) => value > 0) // [{ a: 1, c: 2 }, { b: 0 }]
 */
export function partitionBy<T extends Record<string, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): [Partial<T>, Partial<T>] {
  const truthy: Partial<T> = {};
  const falsy: Partial<T> = {};
  for (const key in obj) {
    if (predicate(obj[key], key)) {
      truthy[key] = obj[key];
    } else {
      falsy[key] = obj[key];
    }
  }
  return [truthy, falsy];
}
