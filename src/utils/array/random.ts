/**
 * Array Random Utilities
 * Functions for random array operations
 */

import { shuffle } from "./transformation";

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
 * Selects a random item from array based on weights
 * @param array - Array of items
 * @param weights - Array of weights (must match array length)
 * @returns Random item selected based on weights
 * @example
 * const item = weightedRandom(['a', 'b', 'c'], [0.5, 0.3, 0.2])
 */
export function weightedRandom<T>(array: T[], weights: number[]): T {
  if (array.length !== weights.length) {
    throw new Error("Array and weights must have the same length");
  }
  
  if (array.length === 0) {
    throw new Error("Array cannot be empty");
  }
  
  // Normalize weights to sum to 1
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map((w) => w / totalWeight);
  
  // Calculate cumulative weights
  const cumulative: number[] = [];
  let sum = 0;
  for (const weight of normalizedWeights) {
    sum += weight;
    cumulative.push(sum);
  }
  
  // Select random value
  const random = Math.random();
  
  // Find index where random value falls
  for (let i = 0; i < cumulative.length; i++) {
    if (random <= cumulative[i]) {
      return array[i];
    }
  }
  
  // Fallback to last item (shouldn't happen due to normalization)
  return array[array.length - 1];
}
