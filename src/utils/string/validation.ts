/**
 * String Validation Utilities
 * Functions for validating strings
 */

/**
 * Checks if string starts with substring
 * @param str - String to check
 * @param prefix - Prefix to check
 * @returns True if starts with prefix
 * @example
 * const starts = startsWith('hello', 'he') // true
 */
export function startsWith(str: string, prefix: string): boolean {
  return str.startsWith(prefix);
}

/**
 * Checks if string ends with substring
 * @param str - String to check
 * @param suffix - Suffix to check
 * @returns True if ends with suffix
 * @example
 * const ends = endsWith('hello', 'lo') // true
 */
export function endsWith(str: string, suffix: string): boolean {
  return str.endsWith(suffix);
}

/**
 * Checks if string is empty or whitespace
 * @param str - String to check
 * @returns True if empty or whitespace
 * @example
 * const isEmpty = isEmptyString('   ') // true
 */
export function isEmptyString(str: string): boolean {
  return str.trim().length === 0;
}
