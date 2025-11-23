/**
 * AWS CDK Secrets Manager Utilities
 */

import { Stack, Duration, SecretValue } from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { generateResourceName } from "../naming";

/**
 * Creates a Secrets Manager secret
 * @param stack - The stack
 * @param secretName - Name of the secret
 * @param options - Secret configuration options
 * @returns The created secret
 * @example
 * const secret = createSecret(stack, 'my-secret', {
 *   description: 'My application secret',
 *   generateSecretString: {
 *     secretStringTemplate: JSON.stringify({ username: 'admin' }),
 *     generateStringKey: 'password'
 *   }
 * })
 */
export function createSecret(
  stack: Stack,
  secretName: string,
  options?: {
    description?: string;
    generateSecretString?: secretsmanager.SecretStringGenerator;
    secretStringValue?: string;
  }
): secretsmanager.Secret {
  const secretId = generateResourceName({
    stack,
    resourceType: "secret",
    resourceName: secretName,
  });

  const secretProps: secretsmanager.SecretProps = {
    secretName: secretId,
    description: options?.description,
    ...(options?.generateSecretString
      ? { generateSecretString: options.generateSecretString }
      : {}),
    ...(options?.secretStringValue
      ? {
          secretStringValue: SecretValue.unsafePlainText(
            options.secretStringValue
          ),
        }
      : {}),
  };

  return new secretsmanager.Secret(stack, secretId, secretProps);
}

/**
 * Creates a secret with auto-generated password
 * @param stack - The stack
 * @param secretName - Name of the secret
 * @param username - Username to include in secret
 * @param passwordLength - Length of generated password
 * @returns The created secret
 * @example
 * const secret = createSecretWithPassword(stack, 'db-credentials', 'admin', 32)
 */
export function createSecretWithPassword(
  stack: Stack,
  secretName: string,
  username: string,
  passwordLength: number = 32
): secretsmanager.Secret {
  return createSecret(stack, secretName, {
    description: `Secret with auto-generated password for ${secretName}`,
    generateSecretString: {
      secretStringTemplate: JSON.stringify({ username }),
      generateStringKey: "password",
      passwordLength,
      excludeCharacters: '"@/\\',
    },
  });
}

/**
 * Grants read permissions to a Lambda function
 * @param secret - The secret
 * @param lambdaFunction - The Lambda function
 * @example
 * grantSecretRead(secret, lambdaFunction)
 */
export function grantSecretRead(
  secret: secretsmanager.ISecret,
  lambdaFunction: lambda.IFunction
): void {
  secret.grantRead(lambdaFunction);
}

/**
 * Grants write permissions to a Lambda function
 * @param secret - The secret
 * @param lambdaFunction - The Lambda function
 * @example
 * grantSecretWrite(secret, lambdaFunction)
 */
export function grantSecretWrite(
  secret: secretsmanager.ISecret,
  lambdaFunction: lambda.IFunction
): void {
  secret.grantWrite(lambdaFunction);
}

/**
 * Creates a secret rotation schedule
 * @param secret - The secret
 * @param lambdaFunction - Lambda function for rotation
 * @param scheduleDays - Rotation schedule in days
 * @returns The created rotation schedule
 * @example
 * const rotation = createSecretRotation(secret, rotationFunction, 30)
 */
export function createSecretRotation(
  secret: secretsmanager.ISecret,
  lambdaFunction: lambda.IFunction,
  scheduleDays: number = 30
): secretsmanager.RotationSchedule {
  return secret.addRotationSchedule("RotationSchedule", {
    rotationLambda: lambdaFunction,
    automaticallyAfter: Duration.days(scheduleDays),
  });
}

