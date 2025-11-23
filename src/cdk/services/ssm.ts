/**
 * AWS CDK SSM Parameter Store Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { generateResourceName } from "../naming";

/**
 * Creates an SSM String parameter
 * @param stack - The stack
 * @param parameterName - Name of the parameter
 * @param value - Parameter value
 * @param description - Parameter description
 * @returns The created parameter
 * @example
 * const param = createStringParameter(stack, '/myapp/config/api-key', 'secret-key', 'API key for my app')
 */
export function createStringParameter(
  stack: Stack,
  parameterName: string,
  value: string,
  description?: string
): ssm.StringParameter {
  const paramId = generateResourceName({
    stack,
    resourceType: "ssm",
    resourceName: parameterName.replace(/\//g, "-"),
  });

  return new ssm.StringParameter(stack, paramId, {
    parameterName,
    stringValue: value,
    description,
  });
}

/**
 * Creates an SSM SecureString parameter (encrypted)
 * @param stack - The stack
 * @param parameterName - Name of the parameter
 * @param value - Parameter value
 * @param description - Parameter description
 * @param kmsKeyId - Optional KMS key ID for encryption
 * @returns The created parameter
 * @example
 * const param = createSecureStringParameter(stack, '/myapp/config/password', 'secret-password', 'Encrypted password')
 */
export function createSecureStringParameter(
  stack: Stack,
  parameterName: string,
  value: string,
  description?: string,
  kmsKeyId?: string
): ssm.StringParameter {
  const paramId = generateResourceName({
    stack,
    resourceType: "ssm",
    resourceName: parameterName.replace(/\//g, "-"),
  });

  const paramProps: ssm.StringParameterProps = {
    parameterName,
    stringValue: value,
    description,
    type: ssm.ParameterType.SECURE_STRING,
  };

  // Note: keyId is not directly supported in StringParameterProps
  // KMS encryption key must be configured at the account/region level
  // or via a separate KMS key resource

  return new ssm.StringParameter(stack, paramId, paramProps);
}

/**
 * Gets an existing SSM String parameter
 * @param stack - The stack
 * @param parameterName - Name of the parameter
 * @returns The parameter reference
 * @example
 * const param = getStringParameter(stack, '/myapp/config/api-key')
 */
export function getStringParameter(
  stack: Stack,
  parameterName: string
): ssm.IStringParameter {
  return ssm.StringParameter.fromStringParameterName(
    stack,
    `Import${parameterName.replace(/\//g, "-")}`,
    parameterName
  );
}

/**
 * Grants read permissions to a Lambda function
 * @param parameter - The SSM parameter
 * @param lambdaFunction - The Lambda function
 * @example
 * grantSsmRead(parameter, lambdaFunction)
 */
export function grantSsmRead(
  parameter: ssm.IParameter,
  lambdaFunction: lambda.IFunction
): void {
  parameter.grantRead(lambdaFunction);
}

/**
 * Grants write permissions to a Lambda function
 * @param parameter - The SSM parameter
 * @param lambdaFunction - The Lambda function
 * @example
 * grantSsmWrite(parameter, lambdaFunction)
 */
export function grantSsmWrite(
  parameter: ssm.IParameter,
  lambdaFunction: lambda.IFunction
): void {
  parameter.grantWrite(lambdaFunction);
}

/**
 * Creates a StringList parameter
 * @param stack - The stack
 * @param parameterName - Name of the parameter
 * @param values - Array of values
 * @param description - Parameter description
 * @returns The created parameter
 * @example
 * const param = createStringListParameter(stack, '/myapp/config/allowed-ips', ['1.2.3.4', '5.6.7.8'])
 */
export function createStringListParameter(
  stack: Stack,
  parameterName: string,
  values: string[],
  description?: string
): ssm.StringListParameter {
  const paramId = generateResourceName({
    stack,
    resourceType: "ssm",
    resourceName: parameterName.replace(/\//g, "-"),
  });

  return new ssm.StringListParameter(stack, paramId, {
    parameterName,
    stringListValue: values,
    description,
  });
}
