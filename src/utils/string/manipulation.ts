/**
 * String Manipulation Utilities
 * Functions for manipulating strings
 */

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
 * Truncates string to specified length with word boundaries
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated string that respects word boundaries
 * @example
 * const truncated = truncateWords('Hello world this is a test', 15) // 'Hello world...'
 */
export function truncateWords(
  str: string,
  length: number,
  suffix: string = "..."
): string {
  if (str.length <= length) return str;
  
  const truncated = str.slice(0, length - suffix.length);
  const lastSpace = truncated.lastIndexOf(" ");
  
  // If we found a space and it's not at the very beginning
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + suffix;
  }
  
  // If no space found, just truncate at the length
  return truncated + suffix;
}

/**
 * Wraps text to specified line length
 * @param str - String to wrap
 * @param lineLength - Maximum line length
 * @param lineBreak - Line break character (default: '\n')
 * @returns Wrapped string
 * @example
 * const wrapped = wordWrap('Hello world this is a test', 10) // 'Hello\nworld this\nis a test'
 */
export function wordWrap(
  str: string,
  lineLength: number,
  lineBreak: string = "\n"
): string {
  if (str.length <= lineLength) return str;
  
  const words = str.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= lineLength) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      // If a single word is longer than lineLength, break it
      if (word.length > lineLength) {
        let remaining = word;
        while (remaining.length > lineLength) {
          lines.push(remaining.slice(0, lineLength));
          remaining = remaining.slice(lineLength);
        }
        currentLine = remaining;
      } else {
        currentLine = word;
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.join(lineBreak);
}
