/**
 * AWS CDK ECR Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { generateResourceName } from "../naming";

/**
 * Creates an ECR repository
 * @param stack - The stack
 * @param repositoryName - Name of the repository
 * @param options - Repository options
 * @returns The created repository
 * @example
 * const repo = createEcrRepository(stack, 'my-repo', {
 *   imageScanOnPush: true,
 *   lifecycleRules: [{ maxImageCount: 10 }]
 * })
 */
export function createEcrRepository(
  stack: Stack,
  repositoryName: string,
  options?: {
    imageScanOnPush?: boolean;
    lifecycleRules?: Array<{
      maxImageCount?: number;
      maxImageAge?: import("aws-cdk-lib").Duration;
      tagPrefixList?: string[];
    }>;
    removalPolicy?: import("aws-cdk-lib").RemovalPolicy;
  }
): ecr.Repository {
  const repoId = generateResourceName({
    stack,
    resourceType: "ecr",
    resourceName: repositoryName,
  });

  const repoProps: ecr.RepositoryProps = {
    repositoryName: repoId,
    imageScanOnPush: options?.imageScanOnPush !== false,
    removalPolicy: options?.removalPolicy,
  };

  const repository = new ecr.Repository(stack, repoId, repoProps);

  // Add lifecycle rules if specified
  if (options?.lifecycleRules && options.lifecycleRules.length > 0) {
    options.lifecycleRules.forEach((rule, index) => {
      repository.addLifecycleRule({
        maxImageCount: rule.maxImageCount,
        maxImageAge: rule.maxImageAge,
        tagPrefixList: rule.tagPrefixList,
      });
    });
  }

  return repository;
}

/**
 * Grants pull permissions to a Lambda function
 * @param repository - The ECR repository
 * @param lambdaFunction - The Lambda function
 * @example
 * grantEcrPull(repository, lambdaFunction)
 */
export function grantEcrPull(
  repository: ecr.IRepository,
  lambdaFunction: lambda.IFunction
): void {
  repository.grantPull(lambdaFunction);
}

/**
 * Grants push permissions to a Lambda function
 * @param repository - The ECR repository
 * @param lambdaFunction - The Lambda function
 * @example
 * grantEcrPush(repository, lambdaFunction)
 */
export function grantEcrPush(
  repository: ecr.IRepository,
  lambdaFunction: lambda.IFunction
): void {
  repository.grantPush(lambdaFunction);
}

/**
 * Creates a lifecycle rule for an ECR repository
 * @param repository - The ECR repository
 * @param maxImageCount - Maximum number of images to keep
 * @param maxImageAge - Maximum age of images
 * @param tagPrefixList - Tag prefixes to apply rule to
 * @example
 * addEcrLifecycleRule(repository, 10, Duration.days(30), ['prod'])
 */
export function addEcrLifecycleRule(
  repository: ecr.Repository,
  maxImageCount?: number,
  maxImageAge?: import("aws-cdk-lib").Duration,
  tagPrefixList?: string[]
): void {
  repository.addLifecycleRule({
    maxImageCount,
    maxImageAge,
    tagPrefixList,
  });
}

