/**
 * String Utility Functions
 * Miscellaneous string utility functions
 */

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

/**
 * Interpolates template string with values
 * @param template - Template string with {{key}} placeholders
 * @param values - Object with values to interpolate
 * @returns Interpolated string
 * @example
 * const result = interpolate('Hello {{name}}, you have {{count}} messages', { name: 'John', count: 5 })
 * // 'Hello John, you have 5 messages'
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}

/**
 * Pluralizes a word based on count
 * @param count - Number to check
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns Pluralized string
 * @example
 * const msg = pluralize(1, 'item') // '1 item'
 * const msg2 = pluralize(5, 'item') // '5 items'
 * const msg3 = pluralize(2, 'child', 'children') // '2 children'
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }
  return `${count} ${plural || singular + "s"}`;
}

/**
 * Counts words in a string
 * @param str - String to count words in
 * @returns Number of words
 * @example
 * const count = wordCount('Hello world this is a test') // 5
 */
export function wordCount(str: string): number {
  if (!str.trim()) return 0;
  return str.trim().split(/\s+/).length;
}

/**
 * Generates an acronym from a string
 * @param str - String to generate acronym from
 * @param options - Options for acronym generation
 * @returns Acronym string
 * @example
 * const acronym = generateAcronym('World Health Organization') // 'WHO'
 * const acronym2 = generateAcronym('as soon as possible', { minLength: 2 }) // 'ASAP'
 */
export function generateAcronym(
  str: string,
  options: {
    minLength?: number;
    includeAllWords?: boolean;
  } = {}
): string {
  const { minLength = 1, includeAllWords = false } = options;
  
  const words = str.trim().split(/\s+/);
  
  if (includeAllWords) {
    return words
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }
  
  // Only include words that meet minimum length
  return words
    .filter((word) => word.length >= minLength)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Calculates Levenshtein distance between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Levenshtein distance
 * @example
 * const distance = levenshteinDistance('kitten', 'sitting') // 3
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return matrix[len1][len2];
}

/**
 * Calculates string similarity (0-1 scale) using Levenshtein distance
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity score between 0 and 1 (1 = identical, 0 = completely different)
 * @example
 * const similarity = stringSimilarity('kitten', 'sitting') // ~0.57
 */
export function stringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;
  
  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  
  return 1 - distance / maxLength;
}
