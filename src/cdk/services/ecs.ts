/**
 * AWS CDK ECS Fargate Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { generateResourceName } from "../naming";

/**
 * Creates an ECS Fargate cluster
 * @param stack - The stack
 * @param clusterName - Name of the cluster
 * @param vpc - The VPC
 * @returns The created cluster
 * @example
 * const cluster = createFargateCluster(stack, 'my-cluster', vpc)
 */
export function createFargateCluster(
  stack: Stack,
  clusterName: string,
  vpc: ec2.IVpc
): ecs.Cluster {
  const clusterId = generateResourceName({
    stack,
    resourceType: "cluster",
    resourceName: clusterName,
  });

  return new ecs.Cluster(stack, clusterId, {
    clusterName: clusterId,
    vpc,
  });
}

/**
 * Creates a Fargate task definition
 * @param stack - The stack
 * @param taskDefinitionName - Name of the task definition
 * @param options - Task definition options
 * @returns The created task definition
 * @example
 * const taskDef = createFargateTaskDefinition(stack, 'my-task', {
 *   cpu: 256,
 *   memoryLimitMiB: 512
 * })
 */
export function createFargateTaskDefinition(
  stack: Stack,
  taskDefinitionName: string,
  options?: {
    cpu?: number;
    memoryLimitMiB?: number;
  }
): ecs.FargateTaskDefinition {
  const taskDefId = generateResourceName({
    stack,
    resourceType: "taskdef",
    resourceName: taskDefinitionName,
  });

  return new ecs.FargateTaskDefinition(stack, taskDefId, {
    cpu: options?.cpu || 256,
    memoryLimitMiB: options?.memoryLimitMiB || 512,
  });
}

/**
 * Creates a Fargate service
 * @param stack - The stack
 * @param serviceName - Name of the service
 * @param cluster - The ECS cluster
 * @param taskDefinition - The task definition
 * @param options - Service options
 * @returns The created service
 * @example
 * const service = createFargateService(stack, 'my-service', cluster, taskDef, {
 *   desiredCount: 2,
 *   assignPublicIp: false
 * })
 */
export function createFargateService(
  stack: Stack,
  serviceName: string,
  cluster: ecs.ICluster,
  taskDefinition: ecs.FargateTaskDefinition,
  options?: {
    desiredCount?: number;
    assignPublicIp?: boolean;
    subnets?: ec2.ISubnet[];
    securityGroups?: ec2.ISecurityGroup[];
    loadBalancer?: elbv2.ApplicationLoadBalancer;
  }
): ecs.FargateService {
  const serviceId = generateResourceName({
    stack,
    resourceType: "service",
    resourceName: serviceName,
  });

  return new ecs.FargateService(stack, serviceId, {
    serviceName: serviceId,
    cluster,
    taskDefinition,
    desiredCount: options?.desiredCount || 1,
    assignPublicIp: options?.assignPublicIp !== false,
    vpcSubnets: options?.subnets
      ? { subnets: options.subnets }
      : undefined,
    securityGroups: options?.securityGroups,
  });
}

