/**
 * Object Path Utilities
 * Functions for accessing nested object properties by path
 */

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
