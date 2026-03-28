/**
 * Array Zip Utilities
 * Functions for zipping and unzipping arrays
 */

/**
 * Zips two arrays together
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of tuples
 * @example
 * const zipped = zip([1, 2, 3], ['a', 'b', 'c']) // [[1, 'a'], [2, 'b'], [3, 'c']]
 */
export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
  const length = Math.min(array1.length, array2.length);
  const result: [T, U][] = [];
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]]);
  }
  return result;
}

/**
 * Unzips an array of tuples
 * @param array - Array of tuples
 * @returns Tuple of two arrays
 * @example
 * const [arr1, arr2] = unzip([[1, 'a'], [2, 'b'], [3, 'c']])
 */
export function unzip<T, U>(array: [T, U][]): [T[], U[]] {
  const arr1: T[] = [];
  const arr2: U[] = [];
  for (const [item1, item2] of array) {
    arr1.push(item1);
    arr2.push(item2);
  }
  return [arr1, arr2];
}
