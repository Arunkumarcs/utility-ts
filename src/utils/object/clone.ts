/**
 * Object Clone Utilities
 * Functions for cloning objects
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
