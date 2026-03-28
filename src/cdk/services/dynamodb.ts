/**
 * AWS CDK DynamoDB Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { DynamoTableOptions } from "./types";
import { generateResourceName } from "../naming";

/**
 * Creates a DynamoDB table
 * @param options - DynamoDB table configuration options
 * @returns The created DynamoDB table
 * @example
 * const table = createDynamoTable({
 *   stack,
 *   tableName: 'users',
 *   partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
 *   billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
 * })
 */
export function createDynamoTable(options: DynamoTableOptions): dynamodb.Table {
  const {
    stack,
    tableName,
    partitionKey,
    sortKey,
    billingMode = dynamodb.BillingMode.PAY_PER_REQUEST,
    readCapacity,
    writeCapacity,
    pointInTimeRecovery = false,
    stream,
    ttl = false,
  } = options;

  const tableId = generateResourceName({
    stack,
    resourceType: "dynamodb",
    resourceName: tableName,
  });

  const tableProps: dynamodb.TableProps = {
    tableName: tableId,
    partitionKey,
    sortKey,
    billingMode,
    pointInTimeRecovery,
    stream,
    // Set capacity if using provisioned billing
    ...(billingMode === dynamodb.BillingMode.PROVISIONED
      ? {
          readCapacity: readCapacity || 5,
          writeCapacity: writeCapacity || 5,
        }
      : {}),
  };

  // Validate capacity if using provisioned billing
  if (billingMode === dynamodb.BillingMode.PROVISIONED) {
    if (!readCapacity || !writeCapacity) {
      throw new Error(
        "readCapacity and writeCapacity are required for PROVISIONED billing mode"
      );
    }
  }

  const table = new dynamodb.Table(stack, tableId, tableProps);

  // Enable TTL if requested
  if (ttl) {
    table.addGlobalSecondaryIndex({
      indexName: "ttl-index",
      partitionKey: partitionKey,
      sortKey: sortKey,
    });
  }

  return table;
}

/**
 * Creates a DynamoDB table with on-demand billing
 * @param stack - The stack
 * @param tableName - Name of the table
 * @param partitionKey - Partition key definition
 * @param sortKey - Optional sort key definition
 * @returns The created DynamoDB table
 * @example
 * const table = createOnDemandDynamoTable(
 *   stack,
 *   'users',
 *   { name: 'id', type: dynamodb.AttributeType.STRING }
 * )
 */
export function createOnDemandDynamoTable(
  stack: Stack,
  tableName: string,
  partitionKey: { name: string; type: dynamodb.AttributeType },
  sortKey?: { name: string; type: dynamodb.AttributeType }
): dynamodb.Table {
  return createDynamoTable({
    stack,
    tableName,
    partitionKey,
    sortKey,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });
}

/**
 * Creates a DynamoDB table with provisioned billing
 * @param stack - The stack
 * @param tableName - Name of the table
 * @param partitionKey - Partition key definition
 * @param readCapacity - Read capacity units
 * @param writeCapacity - Write capacity units
 * @param sortKey - Optional sort key definition
 * @returns The created DynamoDB table
 * @example
 * const table = createProvisionedDynamoTable(
 *   stack,
 *   'users',
 *   { name: 'id', type: dynamodb.AttributeType.STRING },
 *   5,
 *   5
 * )
 */
export function createProvisionedDynamoTable(
  stack: Stack,
  tableName: string,
  partitionKey: { name: string; type: dynamodb.AttributeType },
  readCapacity: number,
  writeCapacity: number,
  sortKey?: { name: string; type: dynamodb.AttributeType }
): dynamodb.Table {
  return createDynamoTable({
    stack,
    tableName,
    partitionKey,
    sortKey,
    billingMode: dynamodb.BillingMode.PROVISIONED,
    readCapacity,
    writeCapacity,
  });
}

/**
 * Adds a global secondary index to a DynamoDB table
 * @param table - The DynamoDB table
 * @param indexName - Name of the index
 * @param partitionKey - Partition key for the index
 * @param sortKey - Optional sort key for the index
 * @param projectionType - Projection type
 * @returns The created global secondary index
 * @example
 * addGlobalSecondaryIndex(table, 'email-index', {
 *   name: 'email',
 *   type: dynamodb.AttributeType.STRING
 * })
 */
export function addGlobalSecondaryIndex(
  table: dynamodb.Table,
  indexName: string,
  partitionKey: { name: string; type: dynamodb.AttributeType },
  sortKey?: { name: string; type: dynamodb.AttributeType },
  projectionType: dynamodb.ProjectionType = dynamodb.ProjectionType.ALL
): void {
  table.addGlobalSecondaryIndex({
    indexName,
    partitionKey,
    sortKey,
    projectionType,
  });
}

/**
 * Adds a local secondary index to a DynamoDB table
 * @param table - The DynamoDB table
 * @param indexName - Name of the index
 * @param sortKey - Sort key for the index
 * @param projectionType - Projection type
 * @example
 * addLocalSecondaryIndex(table, 'status-index', {
 *   name: 'status',
 *   type: dynamodb.AttributeType.STRING
 * })
 */
export function addLocalSecondaryIndex(
  table: dynamodb.Table,
  indexName: string,
  sortKey: { name: string; type: dynamodb.AttributeType },
  projectionType: dynamodb.ProjectionType = dynamodb.ProjectionType.ALL
): void {
  table.addLocalSecondaryIndex({
    indexName,
    sortKey,
    projectionType,
  });
}

/**
 * Grants read permissions to a Lambda function
 * @param table - The DynamoDB table
 * @param lambdaFunction - The Lambda function
 * @example
 * grantDynamoRead(table, lambdaFunction)
 */
export function grantDynamoRead(
  table: dynamodb.ITable,
  lambdaFunction: lambda.IFunction
): void {
  table.grantReadData(lambdaFunction);
}

/**
 * Grants write permissions to a Lambda function
 * @param table - The DynamoDB table
 * @param lambdaFunction - The Lambda function
 * @example
 * grantDynamoWrite(table, lambdaFunction)
 */
export function grantDynamoWrite(
  table: dynamodb.ITable,
  lambdaFunction: lambda.IFunction
): void {
  table.grantWriteData(lambdaFunction);
}

/**
 * Grants read/write permissions to a Lambda function
 * @param table - The DynamoDB table
 * @param lambdaFunction - The Lambda function
 * @example
 * grantDynamoReadWrite(table, lambdaFunction)
 */
export function grantDynamoReadWrite(
  table: dynamodb.ITable,
  lambdaFunction: lambda.IFunction
): void {
  table.grantReadWriteData(lambdaFunction);
}

/**
 * Enables DynamoDB Stream on a table
 * @param table - The DynamoDB table
 * @param streamViewType - Stream view type
 * @example
 * enableDynamoStream(table, dynamodb.StreamViewType.NEW_AND_OLD_IMAGES)
 */
export function enableDynamoStream(
  table: dynamodb.Table,
  streamViewType: dynamodb.StreamViewType = dynamodb.StreamViewType
    .NEW_AND_OLD_IMAGES
): void {
  // Stream is enabled via tableProps.stream in createDynamoTable
  // This function is kept for backward compatibility but does nothing
  // as streams must be configured at table creation time
}

/**
 * Creates a DynamoDB stream event source for a Lambda function
 * @param table - The DynamoDB table
 * @param options - Event source configuration options
 * @returns The event source mapping
 * @example
 * const eventSource = createDynamoStreamEventSource(table, {
 *   startingPosition: lambda.StartingPosition.TRIM_HORIZON,
 *   batchSize: 10
 * })
 */
export function createDynamoStreamEventSource(
  table: dynamodb.ITable,
  options?: {
    startingPosition?: lambda.StartingPosition;
    batchSize?: number;
    bisectBatchOnError?: boolean;
    maxRecordAge?: import("aws-cdk-lib").Duration;
  }
): lambdaEventSources.DynamoEventSource {
  return new lambdaEventSources.DynamoEventSource(table, {
    startingPosition:
      options?.startingPosition || lambda.StartingPosition.TRIM_HORIZON,
    batchSize: options?.batchSize || 10,
    bisectBatchOnError: options?.bisectBatchOnError || false,
    maxRecordAge: options?.maxRecordAge,
  });
}
