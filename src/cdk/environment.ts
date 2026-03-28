/**
 * AWS CDK Environment Utilities
 */

import { Stack } from "aws-cdk-lib";
import { getEnvironment as getEnvironmentFromContext } from "./context";

/**
 * Re-export getEnvironment from context for convenience
 */
export { getEnvironment } from "./context";

/**
 * Checks if the stack is in a production environment
 * @param stack - The stack
 * @returns True if production environment
 * @example
 * if (isProduction(stack)) { // apply production-specific config }
 */
export function isProduction(stack: Stack): boolean {
  const env = getEnvironmentFromContext(stack).toLowerCase();
  return env === "prod" || env === "production";
}

/**
 * Checks if the stack is in a development environment
 * @param stack - The stack
 * @returns True if development environment
 * @example
 * if (isDevelopment(stack)) { // apply dev-specific config }
 */
export function isDevelopment(stack: Stack): boolean {
  const env = getEnvironmentFromContext(stack).toLowerCase();
  return env === "dev" || env === "development";
}

/**
 * Gets environment-specific configuration value
 * @param stack - The stack
 * @param config - Configuration object with environment keys
 * @param defaultValue - Default value if environment not found
 * @returns Configuration value for current environment
 * @example
 * const instanceType = getEnvConfig(stack, {
 *   dev: 't3.micro',
 *   prod: 't3.large'
 * }, 't3.small')
 */
export function getEnvConfig<T>(
  stack: Stack,
  config: Record<string, T>,
  defaultValue: T
): T {
  const env = getEnvironmentFromContext(stack).toLowerCase();
  return config[env] || defaultValue;
}
