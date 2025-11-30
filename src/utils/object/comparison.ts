/**
 * Object Comparison Utilities
 * Functions for comparing objects
 */

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
