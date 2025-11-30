/**
 * Object Merge Utilities
 * Functions for merging objects
 */

/**
 * Checks if value is an object
 * @param value - Value to check
 * @returns True if object
 */
function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
 * Assigns default values to object (shallow merge)
 * Only assigns properties that are undefined in target
 * @param target - Target object
 * @param defaults - Default values object
 * @returns Object with defaults assigned
 * @example
 * const result = defaults({ a: 1 }, { a: 2, b: 3 }) // { a: 1, b: 3 }
 */
export function defaults<T extends Record<string, any>>(
  target: T,
  ...defaults: Partial<T>[]
): T {
  const result = { ...target };
  for (const defaultObj of defaults) {
    if (isObject(defaultObj)) {
      for (const key in defaultObj) {
        if (result[key] === undefined) {
          result[key] = defaultObj[key] as T[Extract<keyof T, string>];
        }
      }
    }
  }
  return result;
}
