/**
 * Configuration Utilities
 * Utilities for managing application configuration
 */

import { getEnv, getEnvNumber, getEnvBoolean, getEnvArray } from "./env-utils";

/**
 * Configuration loader options
 */
export interface ConfigOptions {
  prefix?: string;
  defaults?: Record<string, any>;
  required?: string[];
}

/**
 * Loads configuration from environment variables
 * @param options - Configuration options
 * @returns Configuration object
 * @example
 * const config = loadConfig({
 *   prefix: 'APP_',
 *   defaults: { port: 3000 },
 *   required: ['API_KEY']
 * })
 */
export function loadConfig(options: ConfigOptions = {}): Record<string, any> {
  const { prefix = "", defaults = {}, required = [] } = options;
  const config: Record<string, any> = { ...defaults };

  // Load from environment
  for (const key in defaults) {
    const envKey = prefix ? `${prefix}${key}` : key;
    if (typeof defaults[key] === "number") {
      config[key] = getEnvNumber(envKey, defaults[key]);
    } else if (typeof defaults[key] === "boolean") {
      config[key] = getEnvBoolean(envKey, defaults[key]);
    } else if (Array.isArray(defaults[key])) {
      config[key] = getEnvArray(envKey, defaults[key]);
    } else {
      config[key] = getEnv(envKey, defaults[key]);
    }
  }

  // Validate required fields
  for (const key of required) {
    const envKey = prefix ? `${prefix}${key}` : key;
    if (!process.env[envKey] && config[key] === undefined) {
      throw new Error(`Required configuration ${key} is not set`);
    }
  }

  return config;
}

/**
 * Merges multiple configuration objects
 * @param configs - Configuration objects (later ones override earlier ones)
 * @returns Merged configuration
 * @example
 * const merged = mergeConfig(defaultConfig, envConfig, localConfig)
 */
export function mergeConfig(
  ...configs: Record<string, any>[]
): Record<string, any> {
  return Object.assign({}, ...configs);
}

/**
 * Validates configuration against schema
 * @param config - Configuration object
 * @param schema - Validation schema
 * @returns Validation result
 * @example
 * const result = validateConfig(config, { port: (v) => v > 0 && v < 65536 })
 */
export function validateConfig(
  config: Record<string, any>,
  schema: Record<string, (value: any) => boolean>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const [key, validator] of Object.entries(schema)) {
    if (!validator(config[key])) {
      errors.push(`Invalid configuration for ${key}`);
    }
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
