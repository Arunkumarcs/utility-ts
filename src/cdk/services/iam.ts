/**
 * AWS CDK IAM Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";

/**
 * Creates an IAM role for a Lambda function
 * @param stack - The stack
 * @param roleName - Name of the role
 * @param assumeRolePolicy - Optional custom assume role policy
 * @returns The created IAM role
 * @example
 * const role = createLambdaRole(stack, 'lambda-execution-role')
 */
export function createLambdaRole(
  stack: Stack,
  roleName: string,
  assumeRolePolicy?: iam.PolicyDocument
): iam.Role {
  return new iam.Role(stack, roleName, {
    roleName,
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    inlinePolicies: assumeRolePolicy
      ? { assumeRole: assumeRolePolicy }
      : undefined,
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      ),
    ],
  });
}

/**
 * Creates an IAM role with custom managed policies
 * @param stack - The stack
 * @param roleName - Name of the role
 * @param servicePrincipal - Service principal (e.g., 'lambda.amazonaws.com')
 * @param managedPolicies - Array of managed policy ARNs or names
 * @returns The created IAM role
 * @example
 * const role = createRoleWithPolicies(stack, 'my-role', 'lambda.amazonaws.com', [
 *   'arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess'
 * ])
 */
export function createRoleWithPolicies(
  stack: Stack,
  roleName: string,
  servicePrincipal: string,
  managedPolicies: string[]
): iam.Role {
  return new iam.Role(stack, roleName, {
    roleName,
    assumedBy: new iam.ServicePrincipal(servicePrincipal),
    managedPolicies: managedPolicies.map((policy) =>
      iam.ManagedPolicy.fromAwsManagedPolicyName(policy)
    ),
  });
}

/**
 * Creates an IAM policy statement
 * @param effect - Allow or Deny
 * @param actions - IAM actions
 * @param resources - Resource ARNs
 * @param conditions - Optional conditions
 * @returns The created policy statement
 * @example
 * const statement = createPolicyStatement(
 *   iam.Effect.ALLOW,
 *   ['s3:GetObject'],
 *   ['arn:aws:s3:::my-bucket/*']
 * )
 */
export function createPolicyStatement(
  effect: iam.Effect,
  actions: string[],
  resources: string[],
  conditions?: Record<string, any>
): iam.PolicyStatement {
  const statement = new iam.PolicyStatement({
    effect,
    actions,
    resources,
  });

  if (conditions) {
    Object.entries(conditions).forEach(([key, value]) => {
      statement.addCondition(key, value);
    });
  }

  return statement;
}

/**
 * Attaches a policy to a role
 * @param role - The IAM role
 * @param policyName - Name of the policy
 * @param statements - Policy statements
 * @example
 * attachPolicyToRole(role, 'my-policy', [
 *   createPolicyStatement(iam.Effect.ALLOW, ['s3:GetObject'], ['arn:aws:s3:::bucket/*'])
 * ])
 */
export function attachPolicyToRole(
  role: iam.Role,
  policyName: string,
  statements: iam.PolicyStatement[]
): void {
  role.attachInlinePolicy(
    new iam.Policy(role, policyName, {
      statements,
    })
  );
}

/**
 * Grants a Lambda function permission to assume a role
 * @param role - The IAM role
 * @param lambdaFunction - The Lambda function
 * @example
 * grantLambdaAssumeRole(role, lambdaFunction)
 */
export function grantLambdaAssumeRole(
  role: iam.IRole,
  lambdaFunction: lambda.IFunction
): void {
  role.grantAssumeRole(lambdaFunction.role!);
}

/**
 * Creates a service-linked role
 * @param stack - The stack
 * @param roleName - Name of the role
 * @param servicePrincipal - Service principal
 * @param description - Role description
 * @returns The created IAM role
 * @example
 * const role = createServiceLinkedRole(stack, 'es-role', 'es.amazonaws.com', 'Elasticsearch service role')
 */
export function createServiceLinkedRole(
  stack: Stack,
  roleName: string,
  servicePrincipal: string,
  description?: string
): iam.Role {
  return new iam.Role(stack, roleName, {
    roleName,
    assumedBy: new iam.ServicePrincipal(servicePrincipal),
    description,
  });
}

/**
 * Grants CloudWatch Logs permissions to a Lambda function
 * @param lambdaFunction - The Lambda function
 * @example
 * grantCloudWatchLogs(lambdaFunction)
 */
export function grantCloudWatchLogs(lambdaFunction: lambda.IFunction): void {
  lambdaFunction.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
      resources: [
        `arn:aws:logs:*:*:log-group:/aws/lambda/${lambdaFunction.functionName}:*`,
      ],
    })
  );
}

/**
 * Grants X-Ray tracing permissions to a Lambda function
 * @param lambdaFunction - The Lambda function
 * @example
 * grantXRayTracing(lambdaFunction)
 */
export function grantXRayTracing(lambdaFunction: lambda.IFunction): void {
  lambdaFunction.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
      resources: ["*"],
    })
  );
}
