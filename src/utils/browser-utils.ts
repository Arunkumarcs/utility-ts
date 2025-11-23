/**
 * Browser Utilities
 * Utilities for browser environments
 */

/**
 * Checks if running in browser
 * @returns True if in browser
 * @example
 * if (isBrowser()) { /* browser code *\/ }
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Gets user agent string
 * @returns User agent or empty string
 * @example
 * const ua = getUserAgent()
 */
export function getUserAgent(): string {
  if (typeof navigator !== "undefined") {
    return navigator.userAgent;
  }
  return "";
}

/**
 * Detects if mobile device
 * @returns True if mobile
 * @example
 * const isMobile = isMobileDevice()
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Gets URL parameters
 * @param url - URL string (default: current URL)
 * @returns URL parameters object
 * @example
 * const params = getUrlParams('https://example.com?page=1&limit=10')
 */
export function getUrlParams(url?: string): Record<string, string> {
  const urlObj = url
    ? new URL(url)
    : typeof window !== "undefined"
    ? new URL(window.location.href)
    : null;
  if (!urlObj) {
    return {};
  }
  const params: Record<string, string> = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Sets URL parameter
 * @param key - Parameter key
 * @param value - Parameter value
 * @param url - URL string (default: current URL)
 * @returns New URL with parameter
 * @example
 * const newUrl = setUrlParam('page', '2')
 */
export function setUrlParam(key: string, value: string, url?: string): string {
  const urlObj = url
    ? new URL(url)
    : typeof window !== "undefined"
    ? new URL(window.location.href)
    : null;
  if (!urlObj) {
    return url || "";
  }
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
}

/**
 * Removes URL parameter
 * @param key - Parameter key
 * @param url - URL string (default: current URL)
 * @returns New URL without parameter
 * @example
 * const newUrl = removeUrlParam('page')
 */
export function removeUrlParam(key: string, url?: string): string {
  const urlObj = url
    ? new URL(url)
    : typeof window !== "undefined"
    ? new URL(window.location.href)
    : null;
  if (!urlObj) {
    return url || "";
  }
  urlObj.searchParams.delete(key);
  return urlObj.toString();
}

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 * @example
 * await copyToClipboard('Hello World')
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    throw new Error("Clipboard API not available");
  }
}

/**
 * Gets clipboard text
 * @returns Promise with clipboard text
 * @example
 * const text = await getClipboardText()
 */
export async function getClipboardText(): Promise<string> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    return await navigator.clipboard.readText();
  }
  throw new Error("Clipboard API not available");
}

/**
 * Stores data in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @example
 * setLocalStorage('key', 'value')
 */
export function setLocalStorage(key: string, value: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(key, value);
  }
}

/**
 * Gets data from localStorage
 * @param key - Storage key
 * @returns Stored value or null
 * @example
 * const value = getLocalStorage('key')
 */
export function getLocalStorage(key: string): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return null;
}

/**
 * Removes data from localStorage
 * @param key - Storage key
 * @example
 * removeLocalStorage('key')
 */
export function removeLocalStorage(key: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

/**
 * Clears all localStorage
 * @example
 * clearLocalStorage()
 */
export function clearLocalStorage(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.clear();
  }
}
