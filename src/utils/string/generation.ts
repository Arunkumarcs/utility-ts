/**
 * String Generation Utilities
 * Functions for generating strings
 */

/**
 * Generates a random string
 * @param length - String length
 * @param charset - Character set (default: alphanumeric)
 * @returns Random string
 * @example
 * const random = randomString(10)
 */
export function randomString(
  length: number,
  charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Repeats string N times
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 * @example
 * const repeated = repeat('hello', 3) // 'hellohellohello'
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}
