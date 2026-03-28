/**
 * Process Utilities
 * Utilities for working with Node.js process
 */

/**
 * Gets the current process ID
 * @returns Process ID
 * @example
 * const pid = getProcessId()
 */
export function getProcessId(): number {
  return process.pid;
}

/**
 * Gets the current working directory
 * @returns Current working directory path
 * @example
 * const cwd = getCurrentWorkingDirectory()
 */
export function getCurrentWorkingDirectory(): string {
  return process.cwd();
}

/**
 * Gets environment variable with optional default
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Environment variable value or default
 * @example
 * const port = getEnv('PORT', '3000')
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Gets environment variable as number
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Environment variable as number or default
 * @example
 * const port = getEnvNumber('PORT', 3000)
 */
export function getEnvNumber(
  key: string,
  defaultValue?: number
): number | undefined {
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
 * @param defaultValue - Default value if not found
 * @returns Environment variable as boolean or default
 * @example
 * const debug = getEnvBoolean('DEBUG', false)
 */
export function getEnvBoolean(
  key: string,
  defaultValue?: boolean
): boolean | undefined {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const lower = value.toLowerCase();
  return lower === "true" || lower === "1" || lower === "yes";
}

/**
 * Gets all environment variables with a prefix
 * @param prefix - Prefix to filter by
 * @returns Object with matching environment variables (without prefix)
 * @example
 * const dbConfig = getEnvWithPrefix('DB_') // { HOST: 'localhost', PORT: '5432' }
 */
export function getEnvWithPrefix(prefix: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(prefix) && value !== undefined) {
      const newKey = key.slice(prefix.length);
      result[newKey] = value;
    }
  }
  return result;
}

/**
 * Checks if running in production environment
 * @returns True if NODE_ENV is 'production'
 * @example
 * if (isProduction()) { // production logic }
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Checks if running in development environment
 * @returns True if NODE_ENV is 'development' or not set
 * @example
 * if (isDevelopment()) { // development logic }
 */
export function isDevelopment(): boolean {
  const env = process.env.NODE_ENV;
  return env === undefined || env === "development";
}

/**
 * Checks if running in test environment
 * @returns True if NODE_ENV is 'test'
 * @example
 * if (isTest()) { // test logic }
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Gets Node.js version
 * @returns Node.js version string
 * @example
 * const version = getNodeVersion()
 */
export function getNodeVersion(): string {
  return process.version;
}

/**
 * Gets platform information
 * @returns Platform string (e.g., 'darwin', 'linux', 'win32')
 * @example
 * const platform = getPlatform()
 */
export function getPlatform(): string {
  return process.platform;
}

/**
 * Gets architecture information
 * @returns Architecture string (e.g., 'x64', 'arm64')
 * @example
 * const arch = getArchitecture()
 */
export function getArchitecture(): string {
  return process.arch;
}

/**
 * Gets process uptime in seconds
 * @returns Uptime in seconds
 * @example
 * const uptime = getUptime()
 */
export function getUptime(): number {
  return process.uptime();
}

/**
 * Gets memory usage information
 * @returns Memory usage object
 * @example
 * const memory = getMemoryUsage()
 */
export function getMemoryUsage(): NodeJS.MemoryUsage {
  return process.memoryUsage();
}

/**
 * Exits the process with optional code
 * @param code - Exit code (default: 0)
 * @example
 * exitProcess(1) // Exit with error code
 */
export function exitProcess(code: number = 0): never {
  process.exit(code);
}

/**
 * Registers a cleanup handler for process exit
 * @param handler - Cleanup function
 * @example
 * registerExitHandler(() => { console.log('Cleaning up...') })
 */
export function registerExitHandler(handler: () => void | Promise<void>): void {
  const cleanup = async () => {
    try {
      await handler();
    } catch (error) {
      console.error("Exit handler error:", error);
    }
  };

  process.on("exit", cleanup);
  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });
}
