/**
 * Array Utilities
 * Utilities for working with arrays
 */

/**
 * Chunks an array into smaller arrays
 * @param array - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 * @example
 * const chunks = chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

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
 * Flattens a nested array
 * @param array - Nested array
 * @param depth - Flattening depth (default: 1)
 * @returns Flattened array
 * @example
 * const flat = flatten([1, [2, 3], [4, [5]]]) // [1, 2, 3, 4, [5]]
 */
export function flatten<T>(array: (T | T[])[], depth: number = 1): T[] {
  return array.flat(depth) as T[];
}

/**
 * Deeply flattens an array
 * @param array - Nested array
 * @returns Completely flattened array
 * @example
 * const flat = flattenDeep([1, [2, [3, [4]]]]) // [1, 2, 3, 4]
 */
export function flattenDeep<T>(array: (T | T[])[]): T[] {
  const result: T[] = [];
  for (const item of array) {
    if (Array.isArray(item)) {
      result.push(...flattenDeep(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

/**
 * Groups array items by a key
 * @param array - Array to group
 * @param keyFn - Function to get grouping key
 * @returns Grouped object
 * @example
 * const grouped = groupBy([{ type: 'a' }, { type: 'b' }, { type: 'a' }], item => item.type)
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

/**
 * Partitions array into two arrays based on predicate
 * @param array - Array to partition
 * @param predicate - Partition function
 * @returns Tuple of [true items, false items]
 * @example
 * const [evens, odds] = partition([1, 2, 3, 4], n => n % 2 === 0)
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  return [truthy, falsy];
}

/**
 * Shuffles an array (Fisher-Yates)
 * @param array - Array to shuffle
 * @returns New shuffled array
 * @example
 * const shuffled = shuffle([1, 2, 3, 4, 5])
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Gets random item from array
 * @param array - Array
 * @returns Random item
 * @example
 * const random = randomItem([1, 2, 3, 4, 5])
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gets random items from array
 * @param array - Array
 * @param count - Number of items to get
 * @returns Array of random items
 * @example
 * const random = randomItems([1, 2, 3, 4, 5], 3)
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

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
