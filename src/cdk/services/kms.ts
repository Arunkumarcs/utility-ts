/**
 * AWS CDK KMS Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as kms from "aws-cdk-lib/aws-kms";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { generateResourceName } from "../naming";

/**
 * Creates a KMS key
 * @param stack - The stack
 * @param keyName - Name of the key
 * @param options - Key configuration options
 * @returns The created KMS key
 * @example
 * const key = createKmsKey(stack, 'my-key', {
 *   description: 'Encryption key for my service',
 *   enableKeyRotation: true
 * })
 */
export function createKmsKey(
  stack: Stack,
  keyName: string,
  options?: {
    description?: string;
    enableKeyRotation?: boolean;
    alias?: string;
  }
): kms.Key {
  const keyId = generateResourceName({
    stack,
    resourceType: "kms",
    resourceName: keyName,
  });

  const key = new kms.Key(stack, keyId, {
    description: options?.description || `KMS key for ${keyName}`,
    enableKeyRotation: options?.enableKeyRotation !== false,
  });

  // Add alias if specified
  if (options?.alias) {
    key.addAlias(options.alias);
  }

  return key;
}

/**
 * Creates a KMS key with an alias
 * @param stack - The stack
 * @param keyName - Name of the key
 * @param alias - Key alias
 * @param description - Key description
 * @returns The created KMS key
 * @example
 * const key = createKmsKeyWithAlias(stack, 'my-key', 'alias/my-key', 'My encryption key')
 */
export function createKmsKeyWithAlias(
  stack: Stack,
  keyName: string,
  alias: string,
  description?: string
): kms.Key {
  return createKmsKey(stack, keyName, {
    description,
    alias,
    enableKeyRotation: true,
  });
}

/**
 * Grants encrypt permissions to a Lambda function
 * @param key - The KMS key
 * @param lambdaFunction - The Lambda function
 * @example
 * grantKmsEncrypt(key, lambdaFunction)
 */
export function grantKmsEncrypt(
  key: kms.IKey,
  lambdaFunction: lambda.IFunction
): void {
  key.grantEncrypt(lambdaFunction);
}

/**
 * Grants decrypt permissions to a Lambda function
 * @param key - The KMS key
 * @param lambdaFunction - The Lambda function
 * @example
 * grantKmsDecrypt(key, lambdaFunction)
 */
export function grantKmsDecrypt(
  key: kms.IKey,
  lambdaFunction: lambda.IFunction
): void {
  key.grantDecrypt(lambdaFunction);
}

/**
 * Grants encrypt/decrypt permissions to a Lambda function
 * @param key - The KMS key
 * @param lambdaFunction - The Lambda function
 * @example
 * grantKmsEncryptDecrypt(key, lambdaFunction)
 */
export function grantKmsEncryptDecrypt(
  key: kms.IKey,
  lambdaFunction: lambda.IFunction
): void {
  key.grantEncryptDecrypt(lambdaFunction);
}

/**
 * Creates a KMS key for S3 encryption
 * @param stack - The stack
 * @param keyName - Name of the key
 * @returns The created KMS key
 * @example
 * const key = createS3EncryptionKey(stack, 's3-encryption-key')
 */
export function createS3EncryptionKey(
  stack: Stack,
  keyName: string
): kms.Key {
  return createKmsKey(stack, keyName, {
    description: `KMS key for S3 encryption: ${keyName}`,
    enableKeyRotation: true,
  });
}

/**
 * Creates a KMS key for DynamoDB encryption
 * @param stack - The stack
 * @param keyName - Name of the key
 * @returns The created KMS key
 * @example
 * const key = createDynamoEncryptionKey(stack, 'dynamo-encryption-key')
 */
export function createDynamoEncryptionKey(
  stack: Stack,
  keyName: string
): kms.Key {
  return createKmsKey(stack, keyName, {
    description: `KMS key for DynamoDB encryption: ${keyName}`,
    enableKeyRotation: true,
  });
}

