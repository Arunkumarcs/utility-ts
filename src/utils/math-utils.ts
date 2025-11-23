/**
 * Math Utilities
 * Utilities for mathematical operations
 */

/**
 * Clamps a number between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 * @example
 * const clamped = clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 * @example
 * const value = lerp(0, 100, 0.5) // 50
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Maps a value from one range to another
 * @param value - Value to map
 * @param fromMin - Source range minimum
 * @param fromMax - Source range maximum
 * @param toMin - Target range minimum
 * @param toMax - Target range maximum
 * @returns Mapped value
 * @example
 * const mapped = mapRange(5, 0, 10, 0, 100) // 50
 */
export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}

/**
 * Rounds a number to specified decimal places
 * @param value - Value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 * @example
 * const rounded = round(3.14159, 2) // 3.14
 */
export function round(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Generates a random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 * @example
 * const random = randomBetween(1, 10)
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 * @example
 * const random = randomIntBetween(1, 10)
 */
export function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculates percentage
 * @param value - Value
 * @param total - Total value
 * @returns Percentage
 * @example
 * const percent = percentage(25, 100) // 25
 */
export function percentage(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100;
}

/**
 * Calculates value from percentage
 * @param percent - Percentage
 * @param total - Total value
 * @returns Value
 * @example
 * const value = fromPercentage(25, 100) // 25
 */
export function fromPercentage(percent: number, total: number): number {
  return (percent / 100) * total;
}

/**
 * Checks if number is even
 * @param value - Number to check
 * @returns True if even
 * @example
 * const isEven = isEven(4) // true
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * Checks if number is odd
 * @param value - Number to check
 * @returns True if odd
 * @example
 * const isOdd = isOdd(3) // true
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * Calculates factorial
 * @param n - Number
 * @returns Factorial
 * @example
 * const fact = factorial(5) // 120
 */
export function factorial(n: number): number {
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers");
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calculates greatest common divisor
 * @param a - First number
 * @param b - Second number
 * @returns GCD
 * @example
 * const gcd = greatestCommonDivisor(48, 18) // 6
 */
export function greatestCommonDivisor(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

/**
 * Calculates least common multiple
 * @param a - First number
 * @param b - Second number
 * @returns LCM
 * @example
 * const lcm = leastCommonMultiple(4, 6) // 12
 */
export function leastCommonMultiple(a: number, b: number): number {
  return Math.abs(a * b) / greatestCommonDivisor(a, b);
}

/**
 * Converts degrees to radians
 * @param degrees - Degrees
 * @returns Radians
 * @example
 * const radians = degreesToRadians(180) // Math.PI
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 * @param radians - Radians
 * @returns Degrees
 * @example
 * const degrees = radiansToDegrees(Math.PI) // 180
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
