/**
 * Array Transformation Utilities
 * Functions for transforming array structure
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
 * Removes falsy values from array
 * @param array - Array to compact
 * @returns Array without falsy values
 * @example
 * const compacted = compact([0, 1, false, 2, '', 3, null, undefined]) // [1, 2, 3]
 */
export function compact<T>(array: (T | null | undefined | false | 0 | "")[]): T[] {
  return array.filter((item): item is T => Boolean(item));
}

/**
 * Chunks array by condition function
 * @param array - Array to chunk
 * @param condition - Function that returns true when a new chunk should start
 * @returns Array of chunks
 * @example
 * const chunks = chunkBy([1, 2, 3, 4, 5, 6], (item, index) => item % 3 === 0)
 * // [[1, 2], [3, 4], [5], [6]]
 */
export function chunkBy<T>(
  array: T[],
  condition: (item: T, index: number, currentChunk: T[]) => boolean
): T[][] {
  if (array.length === 0) return [];
  
  const chunks: T[][] = [];
  let currentChunk: T[] = [];
  
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    
    if (condition(item, i, currentChunk) && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [item];
    } else {
      currentChunk.push(item);
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Computes cartesian product of arrays
 * @param arrays - Arrays to compute cartesian product of
 * @returns Array of tuples representing cartesian product
 * @example
 * const product = cartesianProduct([1, 2], ['a', 'b'])
 * // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 */
export function cartesianProduct<T>(...arrays: T[][]): T[][] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0].map((item) => [item]);
  
  const [first, ...rest] = arrays;
  const restProduct = cartesianProduct(...rest);
  
  const result: T[][] = [];
  for (const item of first) {
    for (const product of restProduct) {
      result.push([item, ...product]);
    }
  }
  
  return result;
}
