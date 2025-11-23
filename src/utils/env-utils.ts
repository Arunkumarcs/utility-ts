/**
 * Environment Utilities
 * Utilities for environment variables and configuration
 */

/**
 * Gets environment variable with default
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @returns Environment variable value or default
 * @example
 * const port = getEnv('PORT', '3000')
 */
export function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Gets required environment variable
 * @param key - Environment variable key
 * @returns Environment variable value
 * @throws Error if not found
 * @example
 * const apiKey = getRequiredEnv('API_KEY')
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Gets environment variable as number
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @returns Number value
 * @example
 * const port = getEnvNumber('PORT', 3000)
 */
export function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Gets environment variable as boolean
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @returns Boolean value
 * @example
 * const debug = getEnvBoolean('DEBUG', false)
 */
export function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const lower = value.toLowerCase();
  return lower === "true" || lower === "1" || lower === "yes" || lower === "on";
}

/**
 * Gets environment variable as array (comma-separated)
 * @param key - Environment variable key
 * @param defaultValue - Default array
 * @returns Array of strings
 * @example
 * const hosts = getEnvArray('HOSTS', ['localhost'])
 */
export function getEnvArray(key: string, defaultValue: string[]): string[] {
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Gets all environment variables with a prefix
 * @param prefix - Prefix to filter by
 * @param removePrefix - Remove prefix from keys (default: true)
 * @returns Object with matching environment variables
 * @example
 * const dbConfig = getEnvWithPrefix('DB_') // { HOST: 'localhost', PORT: '5432' }
 */
export function getEnvWithPrefix(
  prefix: string,
  removePrefix: boolean = true
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(prefix) && value !== undefined) {
      const newKey = removePrefix ? key.slice(prefix.length) : key;
      result[newKey] = value;
    }
  }
  return result;
}

/**
 * Checks if environment variable is set
 * @param key - Environment variable key
 * @returns True if set
 * @example
 * if (hasEnv('API_KEY')) { /* ... *\/ }
 */
export function hasEnv(key: string): boolean {
  return process.env[key] !== undefined;
}

/**
 * Gets current environment
 * @returns Environment name (development, production, test)
 * @example
 * const env = getEnvironment() // 'development'
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || "development";
}

/**
 * Checks if running in production
 * @returns True if production
 * @example
 * if (isProduction()) { /* production logic *\/ }
 */
export function isProduction(): boolean {
  return getEnvironment() === "production";
}

/**
 * Checks if running in development
 * @returns True if development
 * @example
 * if (isDevelopment()) { /* dev logic *\/ }
 */
export function isDevelopment(): boolean {
  return getEnvironment() === "development";
}

/**
 * Checks if running in test
 * @returns True if test
 * @example
 * if (isTest()) { /* test logic *\/ }
 */
export function isTest(): boolean {
  return getEnvironment() === "test";
}

/**
 * Loads environment variables from object
 * @param env - Environment variables object
 * @example
 * loadEnv({ PORT: '3000', DEBUG: 'true' })
 */
export function loadEnv(env: Record<string, string>): void {
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
