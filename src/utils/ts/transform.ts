/**
 * TypeScript Transform Utilities
 * Type-safe object transformation functions
 */

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
