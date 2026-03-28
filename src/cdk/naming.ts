/**
 * AWS CDK Naming Utilities
 */

import { Stack } from "aws-cdk-lib";
import { StackNamingOptions, ResourceNamingOptions } from "./types";

/**
 * Generates a standardized stack name
 * @param options - Stack naming options
 * @returns Formatted stack name
 * @example
 * generateStackName({ projectName: 'my-app', environment: 'prod' })
 * // Returns: 'my-app-prod'
 */
export function generateStackName(options: StackNamingOptions): string {
  const parts = [options.projectName];

  if (options.environment) {
    parts.push(options.environment);
  }

  if (options.region) {
    parts.push(options.region);
  }

  if (options.suffix) {
    parts.push(options.suffix);
  }

  return parts.join("-");
}

/**
 * Generates a standardized resource name
 * @param options - Resource naming options
 * @returns Formatted resource name
 * @example
 * generateResourceName({ stack, resourceType: 'lambda', resourceName: 'api-handler' })
 * // Returns: 'my-app-prod-lambda-api-handler'
 */
export function generateResourceName(options: ResourceNamingOptions): string {
  const parts = [options.stack.stackName];

  if (options.includeEnvironment !== false) {
    const env = options.stack.node.tryGetContext("environment");
    if (env) {
      parts.push(env);
    }
  }

  if (options.includeRegion !== false) {
    parts.push(options.stack.region);
  }

  parts.push(options.resourceType);
  parts.push(options.resourceName);

  return parts.join("-");
}

/**
 * Generates a unique resource ID within a stack
 * @param stack - The stack
 * @param prefix - Prefix for the ID
 * @param suffix - Optional suffix
 * @returns Unique resource ID
 * @example
 * const id = generateUniqueId(stack, 'lambda', 'handler')
 */
export function generateUniqueId(
  stack: Stack,
  prefix: string,
  suffix?: string
): string {
  const parts = [stack.stackName, prefix];
  if (suffix) {
    parts.push(suffix);
  }
  return parts.join("-");
}
