/**
 * AWS CDK Stack Information Utilities
 */

import { Stack } from "aws-cdk-lib";

/**
 * Gets the account ID from stack
 * @param stack - The stack
 * @returns Account ID
 * @example
 * const accountId = getAccountId(stack)
 */
export function getAccountId(stack: Stack): string {
  return stack.account;
}

/**
 * Gets the region from stack
 * @param stack - The stack
 * @returns Region name
 * @example
 * const region = getRegion(stack)
 */
export function getRegion(stack: Stack): string {
  return stack.region;
}

