/**
 * AWS CDK Lambda Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { LambdaFunctionOptions } from "./types";
import { generateResourceName } from "../naming";

/**
 * Creates a Lambda function from code in a directory
 * @param options - Lambda function configuration options
 * @returns The created Lambda function
 * @example
 * const fn = createLambdaFunction({
 *   stack,
 *   functionName: 'api-handler',
 *   codePath: './lambda',
 *   handler: 'index.handler',
 *   runtime: lambda.Runtime.NODEJS_18_X
 * })
 */
export function createLambdaFunction(
  options: LambdaFunctionOptions
): lambda.Function {
  const {
    stack,
    functionName,
    codePath,
    handler,
    runtime = lambda.Runtime.NODEJS_18_X,
    timeout = Duration.minutes(3),
    memorySize = 128,
    environment = {},
    layers = [],
    reservedConcurrentExecutions,
    deadLetterQueue,
    tracing = lambda.Tracing.ACTIVE,
  } = options;

  const functionId = generateResourceName({
    stack,
    resourceType: "lambda",
    resourceName: functionName,
  });

  return new lambda.Function(stack, functionId, {
    functionName: functionId,
    code: lambda.Code.fromAsset(codePath),
    handler,
    runtime,
    timeout,
    memorySize,
    environment,
    layers,
    reservedConcurrentExecutions,
    deadLetterQueue,
    tracing,
  });
}

/**
 * Creates a Node.js Lambda function from TypeScript/JavaScript source
 * @param options - Lambda function configuration options
 * @param entry - Path to the entry file (relative to project root)
 * @param bundlingOptions - Optional bundling configuration
 * @returns The created Node.js Lambda function
 * @example
 * const fn = createNodejsLambdaFunction({
 *   stack,
 *   functionName: 'api-handler',
 *   handler: 'handler',
 * }, './src/lambda/api.ts')
 */
export function createNodejsLambdaFunction(
  options: Omit<LambdaFunctionOptions, "codePath" | "handler">,
  entry: string,
  bundlingOptions?: lambdaNodejs.BundlingOptions
): lambdaNodejs.NodejsFunction {
  const {
    stack,
    functionName,
    runtime = lambda.Runtime.NODEJS_18_X,
    timeout = Duration.minutes(3),
    memorySize = 128,
    environment = {},
    layers = [],
    reservedConcurrentExecutions,
    deadLetterQueue,
    tracing = lambda.Tracing.ACTIVE,
  } = options;

  const functionId = generateResourceName({
    stack,
    resourceType: "lambda",
    resourceName: functionName,
  });

  return new lambdaNodejs.NodejsFunction(stack, functionId, {
    functionName: functionId,
    entry,
    runtime,
    timeout,
    memorySize,
    environment,
    layers,
    reservedConcurrentExecutions,
    deadLetterQueue,
    tracing,
    bundling: bundlingOptions,
  });
}

/**
 * Grants a Lambda function permission to invoke another Lambda function
 * @param sourceFunction - The Lambda function that will invoke
 * @param targetFunction - The Lambda function to be invoked
 * @example
 * grantLambdaInvoke(lambda1, lambda2)
 */
export function grantLambdaInvoke(
  sourceFunction: lambda.IFunction,
  targetFunction: lambda.IFunction
): void {
  targetFunction.grantInvoke(sourceFunction);
}

/**
 * Grants a Lambda function permission to read from an SQS queue
 * @param lambdaFunction - The Lambda function
 * @param queue - The SQS queue
 * @example
 * grantSqsRead(lambdaFunction, queue)
 */
export function grantSqsRead(
  lambdaFunction: lambda.IFunction,
  queue: sqs.IQueue
): void {
  queue.grantConsumeMessages(lambdaFunction);
}

/**
 * Creates a dead letter queue for a Lambda function
 * @param stack - The stack
 * @param queueName - Name of the DLQ
 * @returns The created dead letter queue
 * @example
 * const dlq = createLambdaDeadLetterQueue(stack, 'lambda-dlq')
 */
export function createLambdaDeadLetterQueue(
  stack: Stack,
  queueName: string
): sqs.Queue {
  const queueId = generateResourceName({
    stack,
    resourceType: "dlq",
    resourceName: queueName,
  });

  return new sqs.Queue(stack, queueId, {
    queueName: queueId,
    retentionPeriod: Duration.days(14),
  });
}

/**
 * Adds environment variables to a Lambda function
 * @param lambdaFunction - The Lambda function
 * @param environment - Environment variables to add
 * @example
 * addLambdaEnvironment(lambdaFunction, { API_KEY: 'value' })
 */
export function addLambdaEnvironment(
  lambdaFunction: lambda.Function,
  environment: Record<string, string>
): void {
  Object.entries(environment).forEach(([key, value]) => {
    lambdaFunction.addEnvironment(key, value);
  });
}

/**
 * Creates a Lambda function URL (HTTP endpoint)
 * @param lambdaFunction - The Lambda function
 * @param options - URL configuration options
 * @returns The Lambda function URL
 * @example
 * const url = createLambdaFunctionUrl(lambdaFunction, {
 *   authType: lambda.FunctionUrlAuthType.NONE
 * })
 */
export function createLambdaFunctionUrl(
  lambdaFunction: lambda.Function,
  options?: {
    authType?: lambda.FunctionUrlAuthType;
    cors?: lambda.FunctionUrlCorsOptions;
  }
): lambda.FunctionUrl {
  return lambdaFunction.addFunctionUrl({
    authType: options?.authType || lambda.FunctionUrlAuthType.AWS_IAM,
    cors: options?.cors,
  });
}
