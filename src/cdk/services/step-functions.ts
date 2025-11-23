/**
 * AWS CDK Step Functions Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { generateResourceName } from "../naming";

/**
 * Creates a Step Functions state machine
 * @param stack - The stack
 * @param stateMachineName - Name of the state machine
 * @param definition - State machine definition
 * @param options - State machine options
 * @returns The created state machine
 * @example
 * const stateMachine = createStateMachine(stack, 'my-workflow', definition)
 */
export function createStateMachine(
  stack: Stack,
  stateMachineName: string,
  definition: sfn.IChainable,
  options?: {
    timeout?: Duration;
    comment?: string;
  }
): sfn.StateMachine {
  const stateMachineId = generateResourceName({
    stack,
    resourceType: "sfn",
    resourceName: stateMachineName,
  });

  return new sfn.StateMachine(stack, stateMachineId, {
    stateMachineName: stateMachineId,
    definition,
    timeout: options?.timeout,
    comment: options?.comment,
  });
}

/**
 * Creates a Lambda task for Step Functions
 * @param stack - The stack
 * @param lambdaFunction - The Lambda function
 * @param taskName - Name of the task
 * @param options - Task options
 * @returns The created Lambda task
 * @example
 * const task = createLambdaTask(stack, lambdaFunction, 'ProcessData', {
 *   resultPath: '$.result'
 * })
 */
export function createLambdaTask(
  stack: Stack,
  lambdaFunction: lambda.IFunction,
  taskName: string,
  options?: {
    resultPath?: string;
    inputPath?: string;
    outputPath?: string;
    timeout?: Duration;
  }
): tasks.LambdaInvoke {
  return new tasks.LambdaInvoke(stack, taskName, {
    lambdaFunction,
    resultPath: options?.resultPath,
    inputPath: options?.inputPath,
    outputPath: options?.outputPath,
    timeout: options?.timeout,
  });
}

/**
 * Creates a wait state
 * @param waitName - Name of the wait state
 * @param duration - Wait duration
 * @returns The created wait state
 * @example
 * const wait = createWaitState('Wait5Seconds', Duration.seconds(5))
 */
export function createWaitState(
  stack: Stack,
  waitName: string,
  duration: Duration
): sfn.Wait {
  return new sfn.Wait(stack, waitName, {
    time: sfn.WaitTime.duration(duration),
  });
}

/**
 * Creates a choice state
 * @param choiceName - Name of the choice state
 * @param conditions - Choice conditions
 * @returns The created choice state
 * @example
 * const choice = createChoiceState('CheckStatus', [
 *   sfn.Condition.stringEquals('$.status', 'SUCCESS')
 * ])
 */
export function createChoiceState(
  stack: Stack,
  choiceName: string,
  conditions: sfn.Condition[]
): sfn.Choice {
  const choice = new sfn.Choice(stack, choiceName);
  conditions.forEach((condition, index) => {
    if (index < conditions.length - 1) {
      choice.when(condition, new sfn.Pass(stack, `When${index}`));
    } else {
      choice.otherwise(new sfn.Pass(stack, "Default"));
    }
  });
  return choice;
}

/**
 * Creates a parallel state
 * @param parallelName - Name of the parallel state
 * @param branches - Parallel branches (chainable states)
 * @returns The created parallel state
 * @example
 * const parallel = createParallelState('ParallelTasks', [branch1, branch2])
 */
export function createParallelState(
  stack: Stack,
  parallelName: string,
  branches: sfn.IChainable[]
): sfn.Parallel {
  const parallel = new sfn.Parallel(stack, parallelName);
  branches.forEach((branch) => {
    parallel.branch(branch);
  });
  return parallel;
}

/**
 * Creates a map state
 * @param stack - The stack
 * @param mapName - Name of the map state
 * @param iterator - Iterator state machine
 * @param itemsPath - Path to items array
 * @returns The created map state
 * @example
 * const map = createMapState(stack, 'ProcessItems', iterator, '$.items')
 */
export function createMapState(
  stack: Stack,
  mapName: string,
  iterator: sfn.IChainable,
  itemsPath: string
): sfn.Map {
  return new sfn.Map(stack, mapName, {
    itemsPath,
    maxConcurrency: 10,
  }).iterator(iterator);
}

/**
 * Grants execution permissions to a Lambda function
 * @param stateMachine - The state machine
 * @param lambdaFunction - The Lambda function
 * @example
 * grantStepFunctionsExecution(stateMachine, lambdaFunction)
 */
export function grantStepFunctionsExecution(
  stateMachine: sfn.IStateMachine,
  lambdaFunction: lambda.IFunction
): void {
  stateMachine.grantStartExecution(lambdaFunction);
}

