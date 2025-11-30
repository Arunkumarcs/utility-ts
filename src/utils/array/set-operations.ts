/**
 * Array Set Operations Utilities
 * Functions for set-like operations on arrays
 */

/**
 * Removes duplicate values from array
 * @param array - Array to deduplicate
 * @returns Array with unique values
 * @example
 * const unique = unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Intersection of two arrays
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of common items
 * @example
 * const common = intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((item) => set2.has(item));
}

/**
 * Difference of two arrays (items in array1 but not in array2)
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of different items
 * @example
 * const diff = difference([1, 2, 3], [2, 3, 4]) // [1]
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((item) => !set2.has(item));
}

/**
 * Union of two arrays
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of all unique items
 * @example
 * const union = union([1, 2, 3], [2, 3, 4]) // [1, 2, 3, 4]
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

/**
 * Gets unique values by a key function
 * @param array - Array to get unique values from
 * @param keyFn - Function to get unique key
 * @returns Array with unique values (first occurrence kept)
 * @example
 * const unique = uniqBy([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }], item => item.id)
 * // [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 */
export function uniqBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  const result: T[] = [];
  
  for (const item of array) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  
  return result;
}
