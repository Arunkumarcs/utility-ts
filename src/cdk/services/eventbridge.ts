/**
 * AWS CDK EventBridge Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as iam from "aws-cdk-lib/aws-iam";
import { EventBridgeRuleOptions } from "./types";
import { generateResourceName } from "../naming";

/**
 * Creates an EventBridge rule
 * @param options - EventBridge rule configuration options
 * @returns The created EventBridge rule
 * @example
 * const rule = createEventBridgeRule({
 *   stack,
 *   ruleName: 'my-rule',
 *   eventPattern: { source: ['my.app'] }
 * })
 */
export function createEventBridgeRule(
  options: EventBridgeRuleOptions
): events.Rule {
  const {
    stack,
    ruleName,
    description,
    eventPattern,
    schedule,
    targets: ruleTargets,
  } = options;

  const ruleId = generateResourceName({
    stack,
    resourceType: "eventbridge",
    resourceName: ruleName,
  });

  const ruleProps: events.RuleProps = {
    ruleName: ruleId,
    description,
    eventPattern,
    schedule,
  };

  const rule = new events.Rule(stack, ruleId, ruleProps);

  // Add targets if provided
  if (ruleTargets) {
    ruleTargets.forEach((target) => {
      rule.addTarget(target);
    });
  }

  return rule;
}

/**
 * Creates a scheduled EventBridge rule (cron or rate)
 * @param stack - The stack
 * @param ruleName - Name of the rule
 * @param schedule - Schedule expression
 * @param description - Optional description
 * @returns The created EventBridge rule
 * @example
 * const rule = createScheduledRule(stack, 'daily-job', events.Schedule.cron({ hour: '0', minute: '0' }))
 */
export function createScheduledRule(
  stack: Stack,
  ruleName: string,
  schedule: events.Schedule,
  description?: string
): events.Rule {
  return createEventBridgeRule({
    stack,
    ruleName,
    description,
    schedule,
  });
}

/**
 * Creates an EventBridge rule with event pattern
 * @param stack - The stack
 * @param ruleName - Name of the rule
 * @param eventPattern - Event pattern
 * @param description - Optional description
 * @returns The created EventBridge rule
 * @example
 * const rule = createEventPatternRule(stack, 'api-events', {
 *   source: ['my.api'],
 *   'detail-type': ['API Request']
 * })
 */
export function createEventPatternRule(
  stack: Stack,
  ruleName: string,
  eventPattern: Record<string, any>,
  description?: string
): events.Rule {
  return createEventBridgeRule({
    stack,
    ruleName,
    description,
    eventPattern,
  });
}

/**
 * Adds a Lambda function as a target to an EventBridge rule
 * @param rule - The EventBridge rule
 * @param lambdaFunction - The Lambda function
 * @param options - Target options
 * @example
 * addLambdaTarget(rule, lambdaFunction, {
 *   retryAttempts: 2,
 *   maxEventAge: Duration.hours(1)
 * })
 */
export function addLambdaTarget(
  rule: events.Rule,
  lambdaFunction: lambda.IFunction,
  options?: {
    retryAttempts?: number;
    maxEventAge?: Duration;
    deadLetterQueue?: sqs.IQueue;
  }
): void {
  rule.addTarget(
    new targets.LambdaFunction(lambdaFunction, {
      retryAttempts: options?.retryAttempts || 2,
      maxEventAge: options?.maxEventAge,
      deadLetterQueue: options?.deadLetterQueue,
    })
  );
}

/**
 * Adds an SQS queue as a target to an EventBridge rule
 * @param rule - The EventBridge rule
 * @param queue - The SQS queue
 * @param options - Target options
 * @example
 * addSqsTarget(rule, queue, {
 *   messageGroupId: 'my-group'
 * })
 */
export function addSqsTarget(
  rule: events.Rule,
  queue: sqs.IQueue,
  options?: {
    messageGroupId?: string;
  }
): void {
  rule.addTarget(
    new targets.SqsQueue(queue, {
      messageGroupId: options?.messageGroupId,
    })
  );
}

/**
 * Adds an SNS topic as a target to an EventBridge rule
 * @param rule - The EventBridge rule
 * @param topic - The SNS topic
 * @param options - Target options
 * @example
 * addSnsTarget(rule, topic, {
 *   message: events.RuleTargetInput.fromText('Event occurred')
 * })
 */
export function addSnsTarget(
  rule: events.Rule,
  topic: sns.ITopic,
  options?: {
    message?: events.RuleTargetInput;
  }
): void {
  rule.addTarget(
    new targets.SnsTopic(topic, {
      message: options?.message,
    })
  );
}

/**
 * Creates a custom EventBridge bus
 * @param stack - The stack
 * @param busName - Name of the bus
 * @param eventSourceName - Optional event source name
 * @returns The created EventBridge bus
 * @example
 * const bus = createEventBus(stack, 'my-bus', 'my.app')
 */
export function createEventBus(
  stack: Stack,
  busName: string,
  eventSourceName?: string
): events.EventBus {
  const busId = generateResourceName({
    stack,
    resourceType: "eventbus",
    resourceName: busName,
  });

  return new events.EventBus(stack, busId, {
    eventBusName: busId,
    eventSourceName,
  });
}

/**
 * Grants permission for a Lambda function to put events to EventBridge
 * @param rule - The EventBridge rule
 * @param lambdaFunction - The Lambda function
 * @example
 * grantEventBridgePutEvents(rule, lambdaFunction)
 */
export function grantEventBridgePutEvents(
  rule: events.Rule,
  lambdaFunction: lambda.IFunction
): void {
  lambdaFunction.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["events:PutEvents"],
      resources: [rule.ruleArn],
    })
  );
}

/**
 * Creates a cron schedule expression
 * @param expression - Cron expression (e.g., '0 12 * * ? *')
 * @returns The schedule
 * @example
 * const schedule = createCronSchedule('0 12 * * ? *') // Daily at noon UTC
 */
export function createCronSchedule(
  expression: string
): events.Schedule {
  return events.Schedule.expression(`cron(${expression})`);
}

/**
 * Creates a rate-based schedule
 * @param duration - Duration (e.g., Duration.minutes(5))
 * @returns The schedule
 * @example
 * const schedule = createRateSchedule(Duration.minutes(5)) // Every 5 minutes
 */
export function createRateSchedule(
  duration: Duration
): events.Schedule {
  return events.Schedule.rate(duration);
}

