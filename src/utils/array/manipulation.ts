/**
 * Array Manipulation Utilities
 * Functions for manipulating array elements
 */

/**
 * Sorts array by a key function
 * @param array - Array to sort
 * @param keyFn - Function to get sort key
 * @param order - Sort order (default: 'asc')
 * @returns Sorted array
 * @example
 * const sorted = sortBy([{ age: 30 }, { age: 20 }], item => item.age)
 */
export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => number | string,
  order: "asc" | "desc" = "asc"
): T[] {
  const result = [...array];
  result.sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);
    if (keyA < keyB) {
      return order === "asc" ? -1 : 1;
    }
    if (keyA > keyB) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
  return result;
}

/**
 * Gets first N items from array
 * @param array - Array
 * @param n - Number of items
 * @returns First N items
 * @example
 * const first = take([1, 2, 3, 4, 5], 3) // [1, 2, 3]
 */
export function take<T>(array: T[], n: number): T[] {
  return array.slice(0, n);
}

/**
 * Gets last N items from array
 * @param array - Array
 * @param n - Number of items
 * @returns Last N items
 * @example
 * const last = takeRight([1, 2, 3, 4, 5], 3) // [3, 4, 5]
 */
export function takeRight<T>(array: T[], n: number): T[] {
  return array.slice(-n);
}

/**
 * Removes first N items from array
 * @param array - Array
 * @param n - Number of items to remove
 * @returns Array without first N items
 * @example
 * const rest = drop([1, 2, 3, 4, 5], 2) // [3, 4, 5]
 */
export function drop<T>(array: T[], n: number): T[] {
  return array.slice(n);
}

/**
 * Removes last N items from array
 * @param array - Array
 * @param n - Number of items to remove
 * @returns Array without last N items
 * @example
 * const rest = dropRight([1, 2, 3, 4, 5], 2) // [1, 2, 3]
 */
export function dropRight<T>(array: T[], n: number): T[] {
  return array.slice(0, -n);
}

/**
 * Finds index of first element matching predicate
 * @param array - Array to search
 * @param predicate - Predicate function
 * @returns Index of first matching element, or -1 if not found
 * @example
 * const index = findIndex([1, 2, 3, 4, 5], n => n > 3) // 3
 */
export function findIndex<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): number {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      return i;
    }
  }
  return -1;
}

/**
 * Finds last element matching predicate
 * @param array - Array to search
 * @param predicate - Predicate function
 * @returns Last matching element, or undefined if not found
 * @example
 * const last = findLast([1, 2, 3, 4, 5], n => n > 3) // 5
 */
export function findLast<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i)) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Finds index of last element matching predicate
 * @param array - Array to search
 * @param predicate - Predicate function
 * @returns Index of last matching element, or -1 if not found
 * @example
 * const index = findLastIndex([1, 2, 3, 4, 5], n => n > 3) // 4
 */
export function findLastIndex<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i)) {
      return i;
    }
  }
  return -1;
}
