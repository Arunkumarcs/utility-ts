/**
 * TypeScript Type Guards
 * Type guard functions for runtime type checking
 */

/**
 * Type guard to check if value is not null or undefined
 * @param value - Value to check
 * @returns True if value is not null or undefined
 * @example
 * const value: string | null = getValue()
 * if (isNotNull(value)) {
 *   // value is string here
 * }
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is null or undefined
 * @param value - Value to check
 * @returns True if value is null or undefined
 * @example
 * if (isNull(value)) { ... }
 */
export function isNull<T>(
  value: T | null | undefined
): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Type guard to check if value is a string
 * @param value - Value to check
 * @returns True if value is a string
 * @example
 * if (isString(value)) { ... }
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Type guard to check if value is a number
 * @param value - Value to check
 * @returns True if value is a number
 * @example
 * if (isNumber(value)) { ... }
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Type guard to check if value is a boolean
 * @param value - Value to check
 * @returns True if value is a boolean
 * @example
 * if (isBoolean(value)) { ... }
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Type guard to check if value is an object (not null, not array)
 * @param value - Value to check
 * @returns True if value is an object
 * @example
 * if (isObject(value)) { ... }
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if value is an array
 * @param value - Value to check
 * @returns True if value is an array
 * @example
 * if (isArray(value)) { ... }
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if value is a function
 * @param value - Value to check
 * @returns True if value is a function
 * @example
 * if (isFunction(value)) { ... }
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function";
}

/**
 * Type guard to check if value is a Promise
 * @param value - Value to check
 * @returns True if value is a Promise
 * @example
 * if (isPromise(value)) { ... }
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    value !== null &&
    typeof value === "object" &&
    "then" in value &&
    typeof (value as any).then === "function"
  );
}

/**
 * Type guard to check if value is a Date
 * @param value - Value to check
 * @returns True if value is a Date
 * @example
 * if (isDate(value)) { ... }
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Type guard to check if value is an Error
 * @param value - Value to check
 * @returns True if value is an Error
 * @example
 * if (isError(value)) { ... }
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard to check if value is a plain object (not a class instance)
 * @param value - Value to check
 * @returns True if value is a plain object
 * @example
 * if (isPlainObject(value)) { ... }
 */
export function isPlainObject(value: unknown): value is Record<string, any> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}
