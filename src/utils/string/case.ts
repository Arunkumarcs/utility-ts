/**
 * String Case Utilities
 * Functions for converting string case
 */

/**
 * Capitalizes first letter of string
 * @param str - String to capitalize
 * @returns Capitalized string
 * @example
 * const capitalized = capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts string to camelCase
 * @param str - String to convert
 * @returns CamelCase string
 * @example
 * const camel = toCamelCase('hello world') // 'helloWorld'
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

/**
 * Converts string to kebab-case
 * @param str - String to convert
 * @returns Kebab-case string
 * @example
 * const kebab = toKebabCase('Hello World') // 'hello-world'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Converts string to snake_case
 * @param str - String to convert
 * @returns Snake_case string
 * @example
 * const snake = toSnakeCase('Hello World') // 'hello_world'
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Converts string to PascalCase
 * @param str - String to convert
 * @returns PascalCase string
 * @example
 * const pascal = toPascalCase('hello world') // 'HelloWorld'
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, "");
}

/**
 * Converts string to title case
 * @param str - String to convert
 * @returns Title case string
 * @example
 * const title = toTitleCase('hello world') // 'Hello World'
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Converts string to sentence case (first letter capitalized, rest lowercase)
 * @param str - String to convert
 * @returns Sentence case string
 * @example
 * const sentence = toSentenceCase('HELLO WORLD') // 'Hello world'
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
