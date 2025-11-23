/**
 * Object Utilities
 * Utilities for working with objects
 */

/**
 * Deeply clones an object
 * @param obj - Object to clone
 * @returns Cloned object
 * @example
 * const cloned = deepClone({ a: { b: 1 } })
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }
  if (typeof obj === "object") {
    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone((obj as any)[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Merges objects deeply
 * @param target - Target object
 * @param sources - Source objects
 * @returns Merged object
 * @example
 * const merged = deepMerge({ a: 1 }, { b: 2 }, { a: 3 })
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key] || typeof target[key] !== "object") {
          (target as any)[key] = {};
        }
        deepMerge(
          target[key] as Record<string, any>,
          source[key] as Record<string, any>
        );
      } else {
        (target as any)[key] = source[key];
      }
    }
  }
  return deepMerge(target, ...sources);
}

/**
 * Checks if value is an object
 * @param value - Value to check
 * @returns True if object
 */
function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

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
 * Gets nested value from object by path
 * @param obj - Object
 * @param path - Path (e.g., 'user.name' or ['user', 'name'])
 * @param defaultValue - Default value if not found
 * @returns Value at path or default
 * @example
 * const name = get({ user: { name: 'John' } }, 'user.name')
 */
export function get<T = any>(
  obj: Record<string, any>,
  path: string | string[],
  defaultValue?: T
): T | undefined {
  const keys = Array.isArray(path) ? path : path.split(".");
  let result: any = obj;
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
}

/**
 * Sets nested value in object by path
 * @param obj - Object
 * @param path - Path (e.g., 'user.name' or ['user', 'name'])
 * @param value - Value to set
 * @returns Object with set value
 * @example
 * const updated = set({}, 'user.name', 'John')
 */
export function set(
  obj: Record<string, any>,
  path: string | string[],
  value: any
): Record<string, any> {
  const keys = Array.isArray(path) ? path : path.split(".");
  const result = { ...obj };
  let current: any = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (
      !(key in current) ||
      typeof current[key] !== "object" ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

/**
 * Checks if object has nested path
 * @param obj - Object
 * @param path - Path to check
 * @returns True if path exists
 * @example
 * const has = hasPath({ user: { name: 'John' } }, 'user.name')
 */
export function hasPath(
  obj: Record<string, any>,
  path: string | string[]
): boolean {
  const keys = Array.isArray(path) ? path : path.split(".");
  let current: any = obj;
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  return true;
}

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

/**
 * Checks if object is empty
 * @param obj - Object to check
 * @returns True if empty
 * @example
 * const isEmpty = isEmptyObject({}) // true
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Compares two objects deeply
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if equal
 * @example
 * const equal = deepEqual({ a: 1 }, { a: 1 }) // true
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }
  if (obj1 == null || obj2 == null) {
    return false;
  }
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
