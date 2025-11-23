/**
 * AWS CDK Output Utilities
 */

import { Stack, CfnOutput } from "aws-cdk-lib";

/**
 * Creates a CloudFormation output with standardized naming
 * @param stack - The stack to add the output to
 * @param id - Output ID
 * @param value - Output value
 * @param description - Output description
 * @param exportName - Optional export name
 * @returns The created CfnOutput
 * @example
 * createOutput(stack, 'ApiEndpoint', 'https://api.example.com', 'API endpoint URL')
 */
export function createOutput(
  stack: Stack,
  id: string,
  value: string,
  description?: string,
  exportName?: string
): CfnOutput {
  return new CfnOutput(stack, id, {
    value,
    description,
    exportName: exportName || `${stack.stackName}-${id}`,
  });
}
