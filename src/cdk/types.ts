/**
 * AWS CDK Type Definitions
 */

/**
 * Interface for common tags
 */
export interface CommonTags {
  [key: string]: string;
}

/**
 * Interface for stack naming options
 */
export interface StackNamingOptions {
  projectName: string;
  environment?: string;
  region?: string;
  suffix?: string;
}

/**
 * Interface for resource naming options
 */
export interface ResourceNamingOptions {
  stack: import("aws-cdk-lib").Stack;
  resourceType: string;
  resourceName: string;
  includeEnvironment?: boolean;
  includeRegion?: boolean;
}
