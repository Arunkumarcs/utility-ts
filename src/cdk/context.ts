/**
 * AWS CDK Context Utilities
 */

import { Stack } from "aws-cdk-lib";

/**
 * Gets the environment from stack context or process environment
 * @param stack - The stack
 * @param defaultValue - Default value if not found
 * @returns Environment name
 * @example
 * const env = getEnvironment(stack, 'dev')
 */
export function getEnvironment(
  stack: Stack,
  defaultValue: string = "dev"
): string {
  return (
    stack.node.tryGetContext("environment") ||
    process.env.CDK_ENVIRONMENT ||
    process.env.ENVIRONMENT ||
    defaultValue
  );
}

/**
 * Validates that required context values are present
 * @param stack - The stack
 * @param requiredKeys - Array of required context keys
 * @throws Error if any required keys are missing
 * @example
 * validateContext(stack, ['environment', 'projectName'])
 */
export function validateContext(stack: Stack, requiredKeys: string[]): void {
  const missing = requiredKeys.filter((key) => !stack.node.tryGetContext(key));

  if (missing.length > 0) {
    throw new Error(
      `Missing required context values: ${missing.join(", ")}. ` +
        `Provide them via -c flag: cdk deploy -c ${missing[0]}=value`
    );
  }
}

/**
 * Gets a context value with a default fallback
 * @param stack - The stack
 * @param key - Context key
 * @param defaultValue - Default value if key is not found
 * @returns Context value or default
 * @example
 * const projectName = getContext(stack, 'projectName', 'my-app')
 */
export function getContext<T>(stack: Stack, key: string, defaultValue: T): T {
  return (stack.node.tryGetContext(key) as T) || defaultValue;
}
