/**
 * AWS CDK S3 Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as kms from "aws-cdk-lib/aws-kms";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { S3BucketOptions } from "./types";
import { generateResourceName } from "../naming";

/**
 * Creates an S3 bucket
 * @param options - S3 bucket configuration options
 * @returns The created S3 bucket
 * @example
 * const bucket = createS3Bucket({
 *   stack,
 *   bucketName: 'my-bucket',
 *   versioned: true,
 *   encryption: 'AES256'
 * })
 */
export function createS3Bucket(options: S3BucketOptions): s3.Bucket {
  const {
    stack,
    bucketName,
    versioned = false,
    encryption = "AES256",
    kmsKeyId,
    publicReadAccess = false,
    blockPublicAccess = true,
    lifecycleRules = [],
  } = options;

  const bucketId = generateResourceName({
    stack,
    resourceType: "s3",
    resourceName: bucketName,
  });

  // Set encryption
  let encryptionKey: kms.IKey | undefined;
  let encryptionType: s3.BucketEncryption;
  
  if (encryption === "KMS" && kmsKeyId) {
    encryptionType = s3.BucketEncryption.KMS;
    encryptionKey = kms.Key.fromKeyArn(stack, `${bucketId}-key`, kmsKeyId);
  } else if (encryption === "AES256") {
    encryptionType = s3.BucketEncryption.S3_MANAGED;
  } else {
    encryptionType = s3.BucketEncryption.UNENCRYPTED;
  }

  // Map lifecycle rules
  const mappedLifecycleRules: s3.LifecycleRule[] | undefined = lifecycleRules.length > 0
    ? lifecycleRules.map((rule) => ({
        id: rule.id,
        enabled: rule.enabled,
        expiration: rule.expiration,
        transitions: rule.transitions?.map((t) => ({
          storageClass: t.storageClass,
          transitionAfter: t.transitionAfter,
        })),
      }))
    : undefined;

  const bucketProps: s3.BucketProps = {
    bucketName: bucketId,
    versioned,
    publicReadAccess,
    blockPublicAccess: blockPublicAccess
      ? s3.BlockPublicAccess.BLOCK_ALL
      : s3.BlockPublicAccess.BLOCK_ACLS,
    encryption: encryptionType,
    encryptionKey,
    lifecycleRules: mappedLifecycleRules,
  };

  return new s3.Bucket(stack, bucketId, bucketProps);
}

/**
 * Creates a private S3 bucket (no public access)
 * @param stack - The stack
 * @param bucketName - Name of the bucket
 * @param versioned - Enable versioning
 * @returns The created S3 bucket
 * @example
 * const bucket = createPrivateS3Bucket(stack, 'my-bucket', true)
 */
export function createPrivateS3Bucket(
  stack: Stack,
  bucketName: string,
  versioned: boolean = false
): s3.Bucket {
  return createS3Bucket({
    stack,
    bucketName,
    versioned,
    encryption: "AES256",
    publicReadAccess: false,
    blockPublicAccess: true,
  });
}

/**
 * Creates a public S3 bucket (with public read access)
 * @param stack - The stack
 * @param bucketName - Name of the bucket
 * @param versioned - Enable versioning
 * @returns The created S3 bucket
 * @example
 * const bucket = createPublicS3Bucket(stack, 'public-assets', false)
 */
export function createPublicS3Bucket(
  stack: Stack,
  bucketName: string,
  versioned: boolean = false
): s3.Bucket {
  return createS3Bucket({
    stack,
    bucketName,
    versioned,
    encryption: "AES256",
    publicReadAccess: true,
    blockPublicAccess: false,
  });
}

/**
 * Grants read permissions to a Lambda function
 * @param bucket - The S3 bucket
 * @param lambdaFunction - The Lambda function
 * @example
 * grantS3Read(bucket, lambdaFunction)
 */
export function grantS3Read(
  bucket: s3.IBucket,
  lambdaFunction: lambda.IFunction
): void {
  bucket.grantRead(lambdaFunction);
}

/**
 * Grants write permissions to a Lambda function
 * @param bucket - The S3 bucket
 * @param lambdaFunction - The Lambda function
 * @example
 * grantS3Write(bucket, lambdaFunction)
 */
export function grantS3Write(
  bucket: s3.IBucket,
  lambdaFunction: lambda.IFunction
): void {
  bucket.grantWrite(lambdaFunction);
}

/**
 * Grants read/write permissions to a Lambda function
 * @param bucket - The S3 bucket
 * @param lambdaFunction - The Lambda function
 * @example
 * grantS3ReadWrite(bucket, lambdaFunction)
 */
export function grantS3ReadWrite(
  bucket: s3.IBucket,
  lambdaFunction: lambda.IFunction
): void {
  bucket.grantReadWrite(lambdaFunction);
}

/**
 * Grants delete permissions to a Lambda function
 * @param bucket - The S3 bucket
 * @param lambdaFunction - The Lambda function
 * @example
 * grantS3Delete(bucket, lambdaFunction)
 */
export function grantS3Delete(
  bucket: s3.IBucket,
  lambdaFunction: lambda.IFunction
): void {
  bucket.grantDelete(lambdaFunction);
}

/**
 * Creates an S3 event source for a Lambda function
 * @param bucket - The S3 bucket
 * @param lambdaFunction - The Lambda function
 * @param events - S3 event types
 * @param filters - Optional filters
 * @example
 * createS3EventSource(bucket, lambdaFunction, [
 *   s3.EventType.OBJECT_CREATED,
 *   s3.EventType.OBJECT_REMOVED
 * ])
 */
export function createS3EventSource(
  bucket: s3.IBucket,
  lambdaFunction: lambda.IFunction,
  events: s3.EventType[],
  filters?: s3.NotificationKeyFilter[]
): void {
  const lambdaDestination = new s3n.LambdaDestination(lambdaFunction);
  events.forEach((eventType) => {
    bucket.addEventNotification(eventType, lambdaDestination, ...(filters || []));
  });
}

/**
 * Adds a lifecycle rule to an S3 bucket
 * @param bucket - The S3 bucket
 * @param ruleId - Unique identifier for the rule
 * @param options - Lifecycle rule options
 * @example
 * addLifecycleRule(bucket, 'archive-old-files', {
 *   expiration: Duration.days(365),
 *   transitions: [{
 *     storageClass: s3.StorageClass.GLACIER,
 *     transitionAfter: Duration.days(90)
 *   }]
 * })
 */
export function addLifecycleRule(
  bucket: s3.Bucket,
  ruleId: string,
  options: {
    enabled?: boolean;
    expiration?: import("aws-cdk-lib").Duration;
    transitions?: Array<{
      storageClass: s3.StorageClass;
      transitionAfter: import("aws-cdk-lib").Duration;
    }>;
  }
): void {
  bucket.addLifecycleRule({
    id: ruleId,
    enabled: options.enabled !== false,
    expiration: options.expiration,
    transitions: options.transitions?.map((t) => ({
      storageClass: t.storageClass,
      transitionAfter: t.transitionAfter,
    })),
  });
}

