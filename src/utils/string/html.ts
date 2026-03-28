/**
 * String HTML Utilities
 * Functions for HTML string operations
 */

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
 * Removes HTML tags from string
 * @param str - String with HTML
 * @returns String without HTML tags
 * @example
 * const text = stripHtml('<div>Hello</div>') // 'Hello'
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}
