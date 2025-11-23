/**
 * TypeScript Utilities
 * TypeScript-specific utility functions and type helpers
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

/**
 * Asserts that value is not null or undefined, throws if it is
 * @param value - Value to assert
 * @param message - Error message
 * @returns Value (non-null)
 * @throws Error if value is null or undefined
 * @example
 * const value = assertNotNull(getValue(), 'Value is required')
 */
export function assertNotNull<T>(
  value: T | null | undefined,
  message: string = "Value is null or undefined"
): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}

/**
 * Asserts that value is of a specific type
 * @param value - Value to assert
 * @param guard - Type guard function
 * @param message - Error message
 * @returns Value (typed)
 * @throws Error if guard returns false
 * @example
 * const str = assertType(value, isString, 'Value must be a string')
 */
export function assertType<T>(
  value: unknown,
  guard: (val: unknown) => val is T,
  message: string = "Type assertion failed"
): T {
  if (!guard(value)) {
    throw new Error(message);
  }
  return value;
}

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
 * Creates a type-safe pick function
 * @param obj - Object to pick from
 * @param keys - Keys to pick
 * @returns New object with picked keys
 * @example
 * const picked = pick({ a: 1, b: 2, c: 3 }, ['a', 'b']) // { a: 1, b: 2 }
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Creates a type-safe omit function
 * @param obj - Object to omit from
 * @param keys - Keys to omit
 * @returns New object without omitted keys
 * @example
 * const omitted = omit({ a: 1, b: 2, c: 3 }, ['c']) // { a: 1, b: 2 }
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

/**
 * Creates a deep readonly type helper (runtime check)
 * @param obj - Object to make readonly
 * @returns Readonly version (shallow)
 * @example
 * const readonly = makeReadonly({ a: 1, b: { c: 2 } })
 */
export function makeReadonly<T>(obj: T): Readonly<T> {
  return Object.freeze({ ...obj });
}

/**
 * Creates a type-safe record from an array
 * @param array - Array of items
 * @param keyFn - Function to extract key
 * @returns Record with keys from keyFn
 * @example
 * const record = arrayToRecord([{ id: 1, name: 'A' }], item => item.id)
 */
export function arrayToRecord<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T> {
  const result = {} as Record<K, T>;
  array.forEach((item) => {
    result[keyFn(item)] = item;
  });
  return result;
}

/**
 * Creates a type-safe map from an array
 * @param array - Array of items
 * @param keyFn - Function to extract key
 * @returns Map with keys from keyFn
 * @example
 * const map = arrayToMap([{ id: 1, name: 'A' }], item => item.id)
 */
export function arrayToMap<T, K>(array: T[], keyFn: (item: T) => K): Map<K, T> {
  const map = new Map<K, T>();
  array.forEach((item) => {
    map.set(keyFn(item), item);
  });
  return map;
}

/**
 * Type-safe partial that makes all properties optional recursively
 * @param obj - Object to make partial
 * @returns Partial object (shallow)
 * @example
 * const partial = makePartial({ a: 1, b: { c: 2 } })
 */
export function makePartial<T>(obj: T): Partial<T> {
  return { ...obj };
}

/**
 * Type-safe required that makes all properties required
 * @param obj - Object to make required
 * @returns Required object (shallow)
 * @example
 * const required = makeRequired(partial)
 */
export function makeRequired<T>(obj: Partial<T>): Required<T> {
  return obj as Required<T>;
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

/**
 * Type-safe narrowing helper for discriminated unions
 * @param value - Value to narrow
 * @param key - Discriminator key
 * @param expectedValue - Expected value
 * @returns True if value matches
 * @example
 * if (isDiscriminated(value, 'type', 'user')) { ... }
 */
export function isDiscriminated<
  T extends Record<string, any>,
  K extends keyof T,
  V extends T[K]
>(value: T, key: K, expectedValue: V): value is T & Record<K, V> {
  return value[key] === expectedValue;
}

/**
 * Creates a type-safe tuple from arguments
 * @param args - Arguments to tuple
 * @returns Tuple type
 * @example
 * const tuple = tuple(1, 'hello', true) // [number, string, boolean]
 */
export function tuple<T extends readonly any[]>(...args: T): T {
  return args;
}

/**
 * Type-safe identity function
 * @param value - Value to return
 * @returns Same value
 * @example
 * const result = identity(value)
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Creates a no-op function with proper typing
 * @returns No-op function
 * @example
 * const noop = createNoop()
 */
export function createNoop(): () => void {
  return () => {};
}

/**
 * Type-safe cast function (use with caution)
 * @param value - Value to cast
 * @returns Cast value
 * @example
 * const cast = unsafeCast<string>(value)
 */
export function unsafeCast<T>(value: unknown): T {
  return value as T;
}

/**
 * Creates a branded type helper (runtime validation)
 * @param value - Value to brand
 * @param brand - Brand identifier
 * @returns Branded value
 * @example
 * type UserId = Brand<string, 'UserId'>
 * const id = brand('123', 'UserId')
 */
export function brand<T, B extends string>(
  value: T,
  brand: B
): T & { __brand: B } {
  return value as T & { __brand: B };
}

/**
 * Type-safe key remapping
 * @param obj - Object to remap
 * @param keyMap - Map of old keys to new keys
 * @returns Remapped object
 * @example
 * const remapped = remapKeys({ a: 1, b: 2 }, { a: 'x', b: 'y' }) // { x: 1, y: 2 }
 */
export function remapKeys<
  T extends Record<string, any>,
  M extends Record<keyof T, string>
>(obj: T, keyMap: M): Record<M[keyof T], T[keyof T]> {
  const result = {} as Record<M[keyof T], T[keyof T]>;
  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    result[keyMap[key] as M[keyof T]] = obj[key];
  });
  return result;
}
