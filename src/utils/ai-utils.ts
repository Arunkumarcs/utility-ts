/**
 * AI Utilities
 * Utilities for AI/ML operations
 */

/**
 * Calculates cosine similarity between two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Cosine similarity (0-1)
 * @example
 * const similarity = cosineSimilarity([1, 2, 3], [1, 2, 3])
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Calculates Euclidean distance between two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Euclidean distance
 * @example
 * const distance = euclideanDistance([1, 2], [4, 6])
 */
export function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }

  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.pow(vec1[i] - vec2[i], 2);
  }
  return Math.sqrt(sum);
}

/**
 * Normalizes a vector
 * @param vec - Vector to normalize
 * @returns Normalized vector
 * @example
 * const normalized = normalizeVector([3, 4])
 */
export function normalizeVector(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) {
    return vec;
  }
  return vec.map((val) => val / magnitude);
}

/**
 * Calculates dot product of two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Dot product
 * @example
 * const dot = dotProduct([1, 2, 3], [4, 5, 6])
 */
export function dotProduct(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }
  return vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
}

/**
 * Calculates Manhattan distance between two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Manhattan distance
 * @example
 * const distance = manhattanDistance([1, 2], [4, 6])
 */
export function manhattanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }
  return vec1.reduce((sum, val, i) => sum + Math.abs(val - vec2[i]), 0);
}

/**
 * Calculates vector magnitude (length)
 * @param vec - Vector
 * @returns Magnitude
 * @example
 * const magnitude = vectorMagnitude([3, 4]) // 5
 */
export function vectorMagnitude(vec: number[]): number {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Adds two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Sum vector
 * @example
 * const sum = addVectors([1, 2], [3, 4]) // [4, 6]
 */
export function addVectors(vec1: number[], vec2: number[]): number[] {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }
  return vec1.map((val, i) => val + vec2[i]);
}

/**
 * Subtracts two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Difference vector
 * @example
 * const diff = subtractVectors([4, 6], [1, 2]) // [3, 4]
 */
export function subtractVectors(vec1: number[], vec2: number[]): number[] {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }
  return vec1.map((val, i) => val - vec2[i]);
}

/**
 * Multiplies vector by scalar
 * @param vec - Vector
 * @param scalar - Scalar value
 * @returns Scaled vector
 * @example
 * const scaled = scaleVector([1, 2], 3) // [3, 6]
 */
export function scaleVector(vec: number[], scalar: number): number[] {
  return vec.map((val) => val * scalar);
}
