/**
 * AWS CDK Stack Utilities
 * Provides a standardized stack class and helper functions
 */

import { Stack, StackProps, CfnOutput, Fn } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CommonTags } from "./types";
import { generateStackName, generateResourceName } from "./naming";
import { applyDefaultTags } from "./tags";
import { getEnvironment } from "./environment";
import { getAccountId, getRegion } from "./stack-info";
import { createOutput } from "./outputs";

/**
 * Options for StandardStack
 */
export interface StandardStackOptions extends StackProps {
  projectName: string;
  environment?: string;
  defaultTags?: CommonTags;
  autoTag?: boolean;
}

/**
 * Standardized Stack class with built-in utilities
 *
 * Features:
 * - Auto-tagging
 * - Standardized naming
 * - Environment detection
 * - Helper methods for common operations
 *
 * @example
 * class MyStack extends StandardStack {
 *   constructor(scope: Construct, id: string, props: StandardStackOptions) {
 *     super(scope, id, props);
 *
 *     // Resources are automatically tagged
 *     // Naming is standardized
 *   }
 * }
 */
export class StandardStack extends Stack {
  public readonly projectName: string;
  public readonly environment: string;
  public readonly defaultTags: CommonTags;

  constructor(scope: Construct, id: string, props: StandardStackOptions) {
    const {
      projectName,
      environment,
      defaultTags,
      autoTag = true,
      ...stackProps
    } = props;

    // Generate standardized stack name (use provided environment or default)
    const env = environment || "dev";
    const stackName = generateStackName({
      projectName,
      environment: env,
      region: stackProps.env?.region,
    });

    super(scope, id, {
      ...stackProps,
      stackName,
    });

    this.projectName = projectName;
    this.environment = environment || getEnvironment(this, "dev");
    this.defaultTags = defaultTags || {};

    // Auto-tag the stack if enabled
    if (autoTag) {
      this.applyDefaultTags();
    }
  }

  /**
   * Applies default tags to the stack
   * @param additionalTags - Additional tags to apply
   */
  public applyDefaultTags(additionalTags?: CommonTags): void {
    applyDefaultTags(this, this.projectName, this.environment, {
      ...this.defaultTags,
      ...additionalTags,
    });
  }

  /**
   * Gets the current region
   * @returns The region name
   */
  public getRegion(): string {
    return getRegion(this);
  }

  /**
   * Gets the current account ID
   * @returns The account ID
   */
  public getAccountId(): string {
    return getAccountId(this);
  }

  /**
   * Generates a standardized resource name
   * @param resourceType - Type of resource (e.g., 'lambda', 's3')
   * @param resourceName - Name of the resource
   * @param options - Additional naming options
   * @returns Standardized resource name
   */
  public generateResourceName(
    resourceType: string,
    resourceName: string,
    options?: {
      includeEnvironment?: boolean;
      includeRegion?: boolean;
    }
  ): string {
    return generateResourceName({
      stack: this,
      resourceType,
      resourceName,
      includeEnvironment: options?.includeEnvironment,
      includeRegion: options?.includeRegion,
    });
  }

  /**
   * Creates a CloudFormation output with standardized naming
   * @param id - Output ID
   * @param value - Output value
   * @param description - Output description
   * @param exportName - Optional export name
   * @returns The created output
   */
  public createOutput(
    id: string,
    value: string,
    description?: string,
    exportName?: string
  ): CfnOutput {
    return createOutput(this, id, value, description, exportName);
  }

  /**
   * Creates multiple CloudFormation outputs
   * @param outputs - Array of output definitions
   * @returns Array of created outputs
   */
  public createOutputs(
    outputs: Array<{
      id: string;
      value: string;
      description?: string;
      exportName?: string;
    }>
  ): CfnOutput[] {
    return outputs.map((output) =>
      this.createOutput(
        output.id,
        output.value,
        output.description,
        output.exportName
      )
    );
  }

  /**
   * Creates a cross-stack reference output
   * @param id - Output ID
   * @param value - Output value
   * @param exportName - Export name (required for cross-stack references)
   * @param description - Optional output description
   * @returns The created output
   */
  public createCrossStackOutput(
    id: string,
    value: string,
    exportName: string,
    description?: string
  ): CfnOutput {
    if (!exportName) {
      throw new Error("exportName is required for cross-stack references");
    }
    return this.createOutput(id, value, description, exportName);
  }

  /**
   * Gets a value from another stack via cross-stack reference
   * @param outputName - Name of the exported output
   * @returns The value from the other stack
   */
  public getCrossStackValue(outputName: string): string {
    return Fn.importValue(outputName);
  }
}

/**
 * Helper function to create a standardized stack
 * @param scope - Parent construct
 * @param id - Stack ID
 * @param options - Stack options
 * @returns The created stack
 * @example
 * const stack = createStandardStack(app, 'MyStack', {
 *   projectName: 'my-app',
 *   environment: 'prod'
 * })
 */
export function createStandardStack(
  scope: Construct,
  id: string,
  options: StandardStackOptions
): StandardStack {
  return new StandardStack(scope, id, options);
}

/**
 * Helper function for auto-tagging any construct
 * @param construct - The construct to tag
 * @param stack - The stack (for context)
 * @param projectName - Project name
 * @param environment - Environment name
 * @param additionalTags - Additional tags
 * @example
 * autoTagConstruct(myResource, stack, 'my-app', 'prod', { Team: 'backend' })
 */
export function autoTagConstruct(
  construct: Construct,
  stack: Stack,
  projectName: string,
  environment: string,
  additionalTags?: CommonTags
): void {
  applyDefaultTags(stack, projectName, environment, additionalTags);
  // Tags are automatically applied to all children
}

/**
 * Helper function to get region from a stack
 * @param stack - The stack
 * @returns The region name
 * @example
 * const region = getStackRegion(stack)
 */
export function getStackRegion(stack: Stack): string {
  return getRegion(stack);
}

/**
 * Helper function to get account ID from a stack
 * @param stack - The stack
 * @returns The account ID
 * @example
 * const accountId = getStackAccountId(stack)
 */
export function getStackAccountId(stack: Stack): string {
  return getAccountId(stack);
}

/**
 * Helper function to generate resource name from a stack
 * @param stack - The stack
 * @param resourceType - Type of resource
 * @param resourceName - Name of the resource
 * @param options - Additional options
 * @returns Standardized resource name
 * @example
 * const name = generateStackResourceName(stack, 'lambda', 'api-handler')
 */
export function generateStackResourceName(
  stack: Stack,
  resourceType: string,
  resourceName: string,
  options?: {
    includeEnvironment?: boolean;
    includeRegion?: boolean;
  }
): string {
  return generateResourceName({
    stack,
    resourceType,
    resourceName,
    includeEnvironment: options?.includeEnvironment,
    includeRegion: options?.includeRegion,
  });
}

/**
 * Helper function to create multiple outputs at once
 * @param stack - The stack
 * @param outputs - Array of output definitions
 * @returns Array of created outputs
 * @example
 * const outputs = createMultipleOutputs(stack, [
 *   { id: 'ApiUrl', value: api.url, description: 'API URL' },
 *   { id: 'BucketName', value: bucket.bucketName, description: 'Bucket name' }
 * ])
 */
export function createMultipleOutputs(
  stack: Stack,
  outputs: Array<{
    id: string;
    value: string;
    description?: string;
    exportName?: string;
  }>
): CfnOutput[] {
  return outputs.map((output) =>
    createOutput(
      stack,
      output.id,
      output.value,
      output.description,
      output.exportName
    )
  );
}

/**
 * Helper function to create a cross-stack reference
 * @param stack - The source stack
 * @param id - Output ID
 * @param value - Output value
 * @param exportName - Export name (required)
 * @param description - Optional description
 * @returns The created output
 * @example
 * const output = createCrossStackReference(stack, 'DatabaseUrl', dbUrl, 'MyApp-DatabaseUrl')
 */
export function createCrossStackReference(
  stack: Stack,
  id: string,
  value: string,
  exportName: string,
  description?: string
): CfnOutput {
  return createOutput(stack, id, value, description, exportName);
}

/**
 * Helper function to import a value from another stack
 * @param stack - The target stack
 * @param exportName - Name of the exported value
 * @returns The imported value
 * @example
 * const dbUrl = importCrossStackValue(stack, 'MyApp-DatabaseUrl')
 */
export function importCrossStackValue(
  stack: Stack,
  exportName: string
): string {
  return Fn.importValue(exportName);
}
