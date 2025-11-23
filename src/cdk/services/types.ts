/**
 * AWS CDK Service Utility Types
 */

import { Stack } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";

/**
 * Lambda function configuration options
 */
export interface LambdaFunctionOptions {
  stack: Stack;
  functionName: string;
  codePath: string;
  handler: string;
  runtime?: import("aws-cdk-lib/aws-lambda").Runtime;
  timeout?: Duration;
  memorySize?: number;
  environment?: Record<string, string>;
  layers?: import("aws-cdk-lib/aws-lambda").ILayerVersion[];
  reservedConcurrentExecutions?: number;
  deadLetterQueue?: import("aws-cdk-lib/aws-sqs").IQueue;
  tracing?: import("aws-cdk-lib/aws-lambda").Tracing;
}

/**
 * SNS topic configuration options
 */
export interface SnsTopicOptions {
  stack: Stack;
  topicName: string;
  displayName?: string;
  fifo?: boolean;
  contentBasedDeduplication?: boolean;
}

/**
 * SQS queue configuration options
 */
export interface SqsQueueOptions {
  stack: Stack;
  queueName: string;
  fifo?: boolean;
  visibilityTimeout?: Duration;
  retentionPeriod?: Duration;
  deadLetterQueue?: {
    maxReceiveCount: number;
  };
  encryption?: {
    kmsKeyId?: string;
    kmsMasterKeyId?: string;
  };
}

/**
 * DynamoDB table configuration options
 */
export interface DynamoTableOptions {
  stack: Stack;
  tableName: string;
  partitionKey: {
    name: string;
    type: import("aws-cdk-lib/aws-dynamodb").AttributeType;
  };
  sortKey?: {
    name: string;
    type: import("aws-cdk-lib/aws-dynamodb").AttributeType;
  };
  billingMode?: import("aws-cdk-lib/aws-dynamodb").BillingMode;
  readCapacity?: number;
  writeCapacity?: number;
  pointInTimeRecovery?: boolean;
  stream?: import("aws-cdk-lib/aws-dynamodb").StreamViewType;
  ttl?: boolean;
}

/**
 * API Gateway REST API configuration options
 */
export interface ApiGatewayRestApiOptions {
  stack: Stack;
  apiName: string;
  description?: string;
  deployOptions?: {
    stageName?: string;
    throttlingBurstLimit?: number;
    throttlingRateLimit?: number;
  };
  cors?: {
    allowOrigins: string[];
    allowMethods?: string[];
    allowHeaders?: string[];
  };
}

/**
 * S3 bucket configuration options
 */
export interface S3BucketOptions {
  stack: Stack;
  bucketName: string;
  versioned?: boolean;
  encryption?: "AES256" | "KMS";
  kmsKeyId?: string;
  publicReadAccess?: boolean;
  blockPublicAccess?: boolean;
  lifecycleRules?: Array<{
    id: string;
    enabled: boolean;
    expiration?: Duration;
    transitions?: Array<{
      storageClass: import("aws-cdk-lib/aws-s3").StorageClass;
      transitionAfter: Duration;
    }>;
  }>;
}

/**
 * EventBridge rule configuration options
 */
export interface EventBridgeRuleOptions {
  stack: Stack;
  ruleName: string;
  description?: string;
  eventPattern?: Record<string, any>;
  schedule?: import("aws-cdk-lib/aws-events").Schedule;
  targets?: Array<import("aws-cdk-lib/aws-events").IRuleTarget>;
}
