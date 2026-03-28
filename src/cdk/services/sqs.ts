/**
 * AWS CDK SQS Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as kms from "aws-cdk-lib/aws-kms";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as sns from "aws-cdk-lib/aws-sns";
import * as snsSubscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import { SqsQueueOptions } from "./types";
import { generateResourceName } from "../naming";

/**
 * Creates an SQS queue
 * @param options - SQS queue configuration options
 * @returns The created SQS queue
 * @example
 * const queue = createSqsQueue({
 *   stack,
 *   queueName: 'messages',
 *   visibilityTimeout: Duration.minutes(5)
 * })
 */
export function createSqsQueue(options: SqsQueueOptions): sqs.Queue {
  const {
    stack,
    queueName,
    fifo = false,
    visibilityTimeout = Duration.seconds(30),
    retentionPeriod = Duration.days(4),
    deadLetterQueue,
    encryption,
  } = options;

  const queueId = generateResourceName({
    stack,
    resourceType: "sqs",
    resourceName: queueName,
  });

  let deadLetterQueueConfig: sqs.DeadLetterQueue | undefined;
  if (deadLetterQueue) {
    const dlq = createDeadLetterQueue(stack, `${queueName}-dlq`, fifo);
    deadLetterQueueConfig = {
      queue: dlq,
      maxReceiveCount: deadLetterQueue.maxReceiveCount,
    };
  }

  let encryptionConfig: sqs.QueueEncryption | undefined;
  let encryptionMasterKey: kms.IKey | undefined;
  if (encryption) {
    if (encryption.kmsKeyId) {
      encryptionConfig = sqs.QueueEncryption.KMS;
      encryptionMasterKey = kms.Key.fromKeyArn(
        stack,
        `${queueId}-key`,
        encryption.kmsKeyId
      );
    } else if (encryption.kmsMasterKeyId) {
      encryptionConfig = sqs.QueueEncryption.KMS;
      encryptionMasterKey = kms.Key.fromKeyArn(
        stack,
        `${queueId}-key`,
        encryption.kmsMasterKeyId
      );
    } else {
      encryptionConfig = sqs.QueueEncryption.UNENCRYPTED;
    }
  }

  const queueProps: sqs.QueueProps = {
    queueName: fifo ? `${queueId}.fifo` : queueId,
    visibilityTimeout,
    retentionPeriod,
    fifo,
    contentBasedDeduplication: fifo ? true : undefined,
    deadLetterQueue: deadLetterQueueConfig,
    encryption: encryptionConfig,
    encryptionMasterKey,
  };

  return new sqs.Queue(stack, queueId, queueProps);
}

/**
 * Creates a standard SQS queue (non-FIFO)
 * @param stack - The stack
 * @param queueName - Name of the queue
 * @param visibilityTimeout - Message visibility timeout
 * @returns The created SQS queue
 * @example
 * const queue = createStandardSqsQueue(stack, 'messages', Duration.minutes(5))
 */
export function createStandardSqsQueue(
  stack: Stack,
  queueName: string,
  visibilityTimeout?: Duration
): sqs.Queue {
  return createSqsQueue({
    stack,
    queueName,
    fifo: false,
    visibilityTimeout,
  });
}

/**
 * Creates a FIFO SQS queue
 * @param stack - The stack
 * @param queueName - Name of the queue
 * @param visibilityTimeout - Message visibility timeout
 * @returns The created FIFO SQS queue
 * @example
 * const queue = createFifoSqsQueue(stack, 'orders', Duration.minutes(5))
 */
export function createFifoSqsQueue(
  stack: Stack,
  queueName: string,
  visibilityTimeout?: Duration
): sqs.Queue {
  return createSqsQueue({
    stack,
    queueName,
    fifo: true,
    visibilityTimeout,
  });
}

/**
 * Creates a dead letter queue
 * @param stack - The stack
 * @param queueName - Name of the DLQ
 * @param fifo - Whether to create a FIFO queue
 * @returns The created dead letter queue
 * @example
 * const dlq = createDeadLetterQueue(stack, 'dlq', false)
 */
export function createDeadLetterQueue(
  stack: Stack,
  queueName: string,
  fifo: boolean = false
): sqs.Queue {
  const queueId = generateResourceName({
    stack,
    resourceType: "dlq",
    resourceName: queueName,
  });

  return new sqs.Queue(stack, queueId, {
    queueName: fifo ? `${queueId}.fifo` : queueId,
    retentionPeriod: Duration.days(14),
    fifo,
  });
}

/**
 * Grants a Lambda function permission to consume messages from an SQS queue
 * @param queue - The SQS queue
 * @param lambdaFunction - The Lambda function
 * @example
 * grantSqsConsume(queue, lambdaFunction)
 */
export function grantSqsConsume(
  queue: sqs.IQueue,
  lambdaFunction: lambda.IFunction
): void {
  queue.grantConsumeMessages(lambdaFunction);
}

/**
 * Grants a Lambda function permission to send messages to an SQS queue
 * @param queue - The SQS queue
 * @param lambdaFunction - The Lambda function
 * @example
 * grantSqsSend(queue, lambdaFunction)
 */
export function grantSqsSend(
  queue: sqs.IQueue,
  lambdaFunction: lambda.IFunction
): void {
  queue.grantSendMessages(lambdaFunction);
}

/**
 * Creates an SQS event source for a Lambda function
 * @param queue - The SQS queue
 * @param options - Event source configuration options
 * @returns The event source mapping
 * @example
 * const eventSource = createSqsEventSource(queue, {
 *   batchSize: 10,
 *   maxBatchingWindow: Duration.seconds(5)
 * })
 */
export function createSqsEventSource(
  queue: sqs.IQueue,
  options?: {
    batchSize?: number;
    maxBatchingWindow?: Duration;
    reportBatchItemFailures?: boolean;
  }
): lambdaEventSources.SqsEventSource {
  return new lambdaEventSources.SqsEventSource(queue, {
    batchSize: options?.batchSize || 10,
    maxBatchingWindow: options?.maxBatchingWindow,
    reportBatchItemFailures: options?.reportBatchItemFailures || false,
  });
}

/**
 * Subscribes an SQS queue to an SNS topic
 * @param topic - The SNS topic
 * @param queue - The SQS queue
 * @param rawMessageDelivery - Enable raw message delivery
 * @example
 * subscribeSqsToSnsTopic(topic, queue, true)
 */
export function subscribeSqsToSnsTopic(
  topic: sns.ITopic,
  queue: sqs.IQueue,
  rawMessageDelivery: boolean = false
): void {
  topic.addSubscription(
    new snsSubscriptions.SqsSubscription(queue, {
      rawMessageDelivery,
    })
  );
}
