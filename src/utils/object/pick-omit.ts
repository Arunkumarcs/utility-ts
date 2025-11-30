/**
 * Object Pick/Omit Utilities
 * Functions for picking and omitting object properties
 */

/**
 * Picks specified keys from object
 * @param obj - Object
 * @param keys - Keys to pick
 * @returns Object with picked keys
 * @example
 * const picked = pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omits specified keys from object
 * @param obj - Object
 * @param keys - Keys to omit
 * @returns Object without omitted keys
 * @example
 * const omitted = omit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Picks object properties by predicate
 * @param obj - Object
 * @param predicate - Predicate function
 * @returns Object with properties matching predicate
 * @example
 * const picked = pickBy({ a: 1, b: 2, c: 3 }, (value) => value > 1) // { b: 2, c: 3 }
 */
export function pickBy<T extends Record<string, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omits object properties by predicate
 * @param obj - Object
 * @param predicate - Predicate function
 * @returns Object without properties matching predicate
 * @example
 * const omitted = omitBy({ a: 1, b: 2, c: 3 }, (value) => value > 1) // { a: 1 }
 */
export function omitBy<T extends Record<string, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (!predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
