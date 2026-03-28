/**
 * AWS CDK SNS Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { SnsTopicOptions } from "./types";
import { generateResourceName } from "../naming";

/**
 * Creates an SNS topic
 * @param options - SNS topic configuration options
 * @returns The created SNS topic
 * @example
 * const topic = createSnsTopic({
 *   stack,
 *   topicName: 'notifications'
 * })
 */
export function createSnsTopic(options: SnsTopicOptions): sns.Topic {
  const {
    stack,
    topicName,
    displayName,
    fifo = false,
    contentBasedDeduplication = false,
  } = options;

  const topicId = generateResourceName({
    stack,
    resourceType: "sns",
    resourceName: topicName,
  });

  const topicProps: sns.TopicProps = {
    topicName: fifo ? `${topicId}.fifo` : topicId,
    displayName,
    fifo,
    contentBasedDeduplication: fifo ? contentBasedDeduplication : undefined,
  };

  return new sns.Topic(stack, topicId, topicProps);
}

/**
 * Creates a standard SNS topic (non-FIFO)
 * @param stack - The stack
 * @param topicName - Name of the topic
 * @param displayName - Optional display name
 * @returns The created SNS topic
 * @example
 * const topic = createStandardSnsTopic(stack, 'notifications', 'Notifications Topic')
 */
export function createStandardSnsTopic(
  stack: Stack,
  topicName: string,
  displayName?: string
): sns.Topic {
  return createSnsTopic({
    stack,
    topicName,
    displayName,
    fifo: false,
  });
}

/**
 * Creates a FIFO SNS topic
 * @param stack - The stack
 * @param topicName - Name of the topic
 * @param displayName - Optional display name
 * @param contentBasedDeduplication - Enable content-based deduplication
 * @returns The created FIFO SNS topic
 * @example
 * const topic = createFifoSnsTopic(stack, 'orders', 'Orders Topic', true)
 */
export function createFifoSnsTopic(
  stack: Stack,
  topicName: string,
  displayName?: string,
  contentBasedDeduplication: boolean = false
): sns.Topic {
  return createSnsTopic({
    stack,
    topicName,
    displayName,
    fifo: true,
    contentBasedDeduplication,
  });
}

/**
 * Subscribes a Lambda function to an SNS topic
 * @param topic - The SNS topic
 * @param lambdaFunction - The Lambda function to subscribe
 * @param filterPolicy - Optional filter policy
 * @example
 * subscribeLambdaToSns(topic, lambdaFunction)
 */
export function subscribeLambdaToSns(
  topic: sns.Topic,
  lambdaFunction: lambda.IFunction,
  filterPolicy?: Record<string, sns.SubscriptionFilter>
): void {
  topic.addSubscription(
    new subscriptions.LambdaSubscription(lambdaFunction, {
      filterPolicy,
    })
  );
}

/**
 * Subscribes an SQS queue to an SNS topic
 * @param topic - The SNS topic
 * @param queue - The SQS queue to subscribe
 * @param filterPolicy - Optional filter policy
 * @example
 * subscribeSqsToSns(topic, queue)
 */
export function subscribeSqsToSns(
  topic: sns.Topic,
  queue: sqs.IQueue,
  filterPolicy?: Record<string, sns.SubscriptionFilter>
): void {
  topic.addSubscription(
    new subscriptions.SqsSubscription(queue, {
      filterPolicy,
    })
  );
}

/**
 * Subscribes an email address to an SNS topic
 * @param topic - The SNS topic
 * @param emailAddress - Email address to subscribe
 * @param filterPolicy - Optional filter policy
 * @example
 * subscribeEmailToSns(topic, 'user@example.com')
 */
export function subscribeEmailToSns(
  topic: sns.Topic,
  emailAddress: string,
  filterPolicy?: Record<string, sns.SubscriptionFilter>
): void {
  topic.addSubscription(
    new subscriptions.EmailSubscription(emailAddress, {
      filterPolicy,
    })
  );
}

/**
 * Grants publish permissions to a Lambda function
 * @param topic - The SNS topic
 * @param lambdaFunction - The Lambda function
 * @example
 * grantSnsPublish(topic, lambdaFunction)
 */
export function grantSnsPublish(
  topic: sns.ITopic,
  lambdaFunction: lambda.IFunction
): void {
  topic.grantPublish(lambdaFunction);
}

/**
 * Creates a dead letter queue for an SNS subscription
 * @param stack - The stack
 * @param queueName - Name of the DLQ
 * @returns The created dead letter queue
 * @example
 * const dlq = createSnsDeadLetterQueue(stack, 'sns-dlq')
 */
export function createSnsDeadLetterQueue(
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
