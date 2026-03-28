/**
 * AWS CDK Tagging Utilities
 */

import { Stack } from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CommonTags } from "./types";

/**
 * Applies common tags to a construct and all its children
 * @param construct - The construct to tag
 * @param tags - Tags to apply
 * @example
 * applyCommonTags(stack, { Environment: 'prod', Project: 'my-app' })
 */
export function applyCommonTags(construct: Construct, tags: CommonTags): void {
  Object.entries(tags).forEach(([key, value]) => {
    Tags.of(construct).add(key, value);
  });
}

/**
 * Applies default tags to a stack
 * @param stack - The stack to tag
 * @param projectName - Name of the project
 * @param environment - Environment name (e.g., 'dev', 'prod')
 * @param additionalTags - Additional tags to apply
 * @example
 * applyDefaultTags(stack, 'my-app', 'prod', { Team: 'backend' })
 */
export function applyDefaultTags(
  stack: Stack,
  projectName: string,
  environment: string,
  additionalTags?: CommonTags
): void {
  const defaultTags: CommonTags = {
    Project: projectName,
    Environment: environment,
    ManagedBy: "CDK",
    ...additionalTags,
  };

  applyCommonTags(stack, defaultTags);
}
