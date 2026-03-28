/**
 * AWS CDK CloudWatch Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { generateResourceName } from "../naming";

/**
 * Creates a CloudWatch log group
 * @param stack - The stack
 * @param logGroupName - Name of the log group
 * @param retentionDays - Log retention in days
 * @returns The created log group
 * @example
 * const logGroup = createLogGroup(stack, '/aws/lambda/my-function', 30)
 */
export function createLogGroup(
  stack: Stack,
  logGroupName: string,
  retentionDays: number = 7
): logs.LogGroup {
  const logGroupId = generateResourceName({
    stack,
    resourceType: "logs",
    resourceName: logGroupName.replace(/\//g, "-"),
  });

  let retention: logs.RetentionDays;
  switch (retentionDays) {
    case 1:
      retention = logs.RetentionDays.ONE_DAY;
      break;
    case 3:
      retention = logs.RetentionDays.THREE_DAYS;
      break;
    case 5:
      retention = logs.RetentionDays.FIVE_DAYS;
      break;
    case 7:
      retention = logs.RetentionDays.ONE_WEEK;
      break;
    case 14:
      retention = logs.RetentionDays.TWO_WEEKS;
      break;
    case 30:
      retention = logs.RetentionDays.ONE_MONTH;
      break;
    case 60:
      retention = logs.RetentionDays.TWO_MONTHS;
      break;
    case 90:
      retention = logs.RetentionDays.THREE_MONTHS;
      break;
    case 120:
      retention = logs.RetentionDays.FOUR_MONTHS;
      break;
    case 150:
      retention = logs.RetentionDays.FIVE_MONTHS;
      break;
    case 180:
      retention = logs.RetentionDays.SIX_MONTHS;
      break;
    case 365:
      retention = logs.RetentionDays.ONE_YEAR;
      break;
    case 400:
      retention = logs.RetentionDays.THIRTEEN_MONTHS;
      break;
    case 545:
      retention = logs.RetentionDays.EIGHTEEN_MONTHS;
      break;
    case 731:
      retention = logs.RetentionDays.TWO_YEARS;
      break;
    case 1827:
      retention = logs.RetentionDays.FIVE_YEARS;
      break;
    case 3653:
      retention = logs.RetentionDays.TEN_YEARS;
      break;
    default:
      retention = logs.RetentionDays.ONE_WEEK;
  }

  return new logs.LogGroup(stack, logGroupId, {
    logGroupName,
    retention,
  });
}

/**
 * Creates a CloudWatch alarm
 * @param stack - The stack
 * @param alarmName - Name of the alarm
 * @param metric - CloudWatch metric
 * @param threshold - Alarm threshold
 * @param comparisonOperator - Comparison operator
 * @returns The created alarm
 * @example
 * const alarm = createAlarm(stack, 'high-error-rate', metric, 10, cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD)
 */
export function createAlarm(
  stack: Stack,
  alarmName: string,
  metric: cloudwatch.IMetric,
  threshold: number,
  comparisonOperator: cloudwatch.ComparisonOperator
): cloudwatch.Alarm {
  const alarmId = generateResourceName({
    stack,
    resourceType: "alarm",
    resourceName: alarmName,
  });

  return new cloudwatch.Alarm(stack, alarmId, {
    alarmName: alarmId,
    metric,
    threshold,
    comparisonOperator,
    evaluationPeriods: 1,
  });
}

/**
 * Creates a metric for Lambda function errors
 * @param lambdaFunction - The Lambda function
 * @returns The error metric
 * @example
 * const errorMetric = createLambdaErrorMetric(lambdaFunction)
 */
export function createLambdaErrorMetric(
  lambdaFunction: lambda.IFunction
): cloudwatch.Metric {
  return lambdaFunction.metricErrors({
    statistic: "Sum",
    period: Duration.minutes(1),
  });
}

/**
 * Creates a metric for Lambda function invocations
 * @param lambdaFunction - The Lambda function
 * @returns The invocations metric
 * @example
 * const invocationsMetric = createLambdaInvocationsMetric(lambdaFunction)
 */
export function createLambdaInvocationsMetric(
  lambdaFunction: lambda.IFunction
): cloudwatch.Metric {
  return lambdaFunction.metricInvocations({
    statistic: "Sum",
    period: Duration.minutes(1),
  });
}

/**
 * Creates a metric for Lambda function duration
 * @param lambdaFunction - The Lambda function
 * @returns The duration metric
 * @example
 * const durationMetric = createLambdaDurationMetric(lambdaFunction)
 */
export function createLambdaDurationMetric(
  lambdaFunction: lambda.IFunction
): cloudwatch.Metric {
  return lambdaFunction.metricDuration({
    statistic: "Average",
    period: Duration.minutes(1),
  });
}

/**
 * Creates a CloudWatch dashboard
 * @param stack - The stack
 * @param dashboardName - Name of the dashboard
 * @param widgets - Dashboard widgets
 * @returns The created dashboard
 * @example
 * const dashboard = createDashboard(stack, 'my-dashboard', [
 *   new cloudwatch.GraphWidget({ ... })
 * ])
 */
export function createDashboard(
  stack: Stack,
  dashboardName: string,
  widgets: cloudwatch.IWidget[][]
): cloudwatch.Dashboard {
  const dashboardId = generateResourceName({
    stack,
    resourceType: "dashboard",
    resourceName: dashboardName,
  });

  return new cloudwatch.Dashboard(stack, dashboardId, {
    dashboardName: dashboardId,
    widgets,
  });
}

/**
 * Creates a log group for a Lambda function
 * @param stack - The stack
 * @param lambdaFunction - The Lambda function
 * @param retentionDays - Log retention in days
 * @returns The created log group
 * @example
 * const logGroup = createLambdaLogGroup(stack, lambdaFunction, 30)
 */
export function createLambdaLogGroup(
  stack: Stack,
  lambdaFunction: lambda.IFunction,
  retentionDays: number = 7
): logs.LogGroup {
  return createLogGroup(
    stack,
    `/aws/lambda/${lambdaFunction.functionName}`,
    retentionDays
  );
}
