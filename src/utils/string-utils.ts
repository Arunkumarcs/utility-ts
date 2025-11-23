/**
 * String Utilities
 * Utilities for working with strings
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
 * Truncates string to specified length
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated string
 * @example
 * const truncated = truncate('Hello World', 5) // 'Hello...'
 */
export function truncate(
  str: string,
  length: number,
  suffix: string = "..."
): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Removes whitespace from both ends
 * @param str - String to trim
 * @returns Trimmed string
 * @example
 * const trimmed = trim('  hello  ') // 'hello'
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Removes all whitespace
 * @param str - String
 * @returns String without whitespace
 * @example
 * const noSpace = removeWhitespace('hello world') // 'helloworld'
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, "");
}

/**
 * Reverses a string
 * @param str - String to reverse
 * @returns Reversed string
 * @example
 * const reversed = reverse('hello') // 'olleh'
 */
export function reverse(str: string): string {
  return str.split("").reverse().join("");
}

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

/**
 * Pads string to specified length
 * @param str - String to pad
 * @param length - Target length
 * @param padString - Padding string (default: ' ')
 * @param side - Side to pad ('left', 'right', 'both')
 * @returns Padded string
 * @example
 * const padded = pad('hello', 10, ' ', 'right') // 'hello     '
 */
export function pad(
  str: string,
  length: number,
  padString: string = " ",
  side: "left" | "right" | "both" = "right"
): string {
  const padLength = length - str.length;
  if (padLength <= 0) return str;

  const padding = padString
    .repeat(Math.ceil(padLength / padString.length))
    .slice(0, padLength);

  if (side === "left") {
    return padding + str;
  } else if (side === "right") {
    return str + padding;
  } else {
    const leftPad = Math.floor(padLength / 2);
    const rightPad = padLength - leftPad;
    return padding.slice(0, leftPad) + str + padding.slice(0, rightPad);
  }
}

/**
 * Replaces all occurrences of substring
 * @param str - String
 * @param search - Substring to replace
 * @param replace - Replacement string
 * @returns String with replacements
 * @example
 * const replaced = replaceAll('hello world', 'l', 'L') // 'heLLo worLd'
 */
export function replaceAll(
  str: string,
  search: string,
  replace: string
): string {
  return str.split(search).join(replace);
}

/**
 * Escapes HTML special characters
 * @param str - String to escape
 * @returns Escaped string
 * @example
 * const escaped = escapeHtml('<div>Hello</div>') // '&lt;div&gt;Hello&lt;/div&gt;'
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Unescapes HTML entities
 * @param str - String to unescape
 * @returns Unescaped string
 * @example
 * const unescaped = unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;') // '<div>Hello</div>'
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
  };
  return str.replace(/&(amp|lt|gt|quot|#039);/g, (m) => map[m] || m);
}

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
 * Checks if string is empty or whitespace
 * @param str - String to check
 * @returns True if empty or whitespace
 * @example
 * const isEmpty = isEmptyString('   ') // true
 */
export function isEmptyString(str: string): boolean {
  return str.trim().length === 0;
}

/**
 * Counts occurrences of substring
 * @param str - String to search
 * @param substring - Substring to count
 * @returns Number of occurrences
 * @example
 * const count = countOccurrences('hello world', 'l') // 3
 */
export function countOccurrences(str: string, substring: string): number {
  return (
    str.match(
      new RegExp(substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
    ) || []
  ).length;
}

/**
 * Splits string by delimiter and trims each part
 * @param str - String to split
 * @param delimiter - Delimiter (default: ',')
 * @returns Array of trimmed strings
 * @example
 * const parts = splitAndTrim('a, b, c') // ['a', 'b', 'c']
 */
export function splitAndTrim(str: string, delimiter: string = ","): string[] {
  return str
    .split(delimiter)
    .map((s) => s.trim())
    .filter(Boolean);
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
 * Removes HTML tags from string
 * @param str - String with HTML
 * @returns String without HTML tags
 * @example
 * const text = stripHtml('<div>Hello</div>') // 'Hello'
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

/**
 * Converts string to slug
 * @param str - String to convert
 * @returns Slug string
 * @example
 * const slug = toSlug('Hello World!') // 'hello-world'
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Masks sensitive string (e.g., email, phone)
 * @param str - String to mask
 * @param visibleChars - Number of visible characters at start and end
 * @param maskChar - Character to use for masking
 * @returns Masked string
 * @example
 * const masked = maskString('hello@example.com', 2) // 'he****@example.com'
 */
export function maskString(
  str: string,
  visibleChars: number = 3,
  maskChar: string = "*"
): string {
  if (str.length <= visibleChars * 2) {
    return maskChar.repeat(str.length);
  }
  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const middle = maskChar.repeat(str.length - visibleChars * 2);
  return `${start}${middle}${end}`;
}
