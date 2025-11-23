/**
 * AWS CDK VPC & Networking Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { generateResourceName } from "../naming";

/**
 * Creates a VPC
 * @param stack - The stack
 * @param vpcName - Name of the VPC
 * @param options - VPC configuration options
 * @returns The created VPC
 * @example
 * const vpc = createVpc(stack, 'my-vpc', {
 *   maxAzs: 2,
 *   natGateways: 1
 * })
 */
export function createVpc(
  stack: Stack,
  vpcName: string,
  options?: {
    maxAzs?: number;
    natGateways?: number;
    cidr?: string;
    enableDnsHostnames?: boolean;
    enableDnsSupport?: boolean;
  }
): ec2.Vpc {
  const vpcId = generateResourceName({
    stack,
    resourceType: "vpc",
    resourceName: vpcName,
  });

  return new ec2.Vpc(stack, vpcId, {
    vpcName: vpcId,
    maxAzs: options?.maxAzs || 2,
    natGateways: options?.natGateways || 1,
    cidr: options?.cidr || "10.0.0.0/16",
    enableDnsHostnames: options?.enableDnsHostnames !== false,
    enableDnsSupport: options?.enableDnsSupport !== false,
  });
}

/**
 * Creates a VPC with public and private subnets
 * @param stack - The stack
 * @param vpcName - Name of the VPC
 * @param maxAzs - Maximum availability zones
 * @param natGateways - Number of NAT gateways
 * @returns The created VPC
 * @example
 * const vpc = createVpcWithSubnets(stack, 'my-vpc', 2, 1)
 */
export function createVpcWithSubnets(
  stack: Stack,
  vpcName: string,
  maxAzs: number = 2,
  natGateways: number = 1
): ec2.Vpc {
  return createVpc(stack, vpcName, {
    maxAzs,
    natGateways,
  });
}

/**
 * Creates an isolated VPC (no internet gateway)
 * @param stack - The stack
 * @param vpcName - Name of the VPC
 * @param maxAzs - Maximum availability zones
 * @returns The created VPC
 * @example
 * const vpc = createIsolatedVpc(stack, 'my-vpc', 2)
 */
export function createIsolatedVpc(
  stack: Stack,
  vpcName: string,
  maxAzs: number = 2
): ec2.Vpc {
  const vpcId = generateResourceName({
    stack,
    resourceType: "vpc",
    resourceName: vpcName,
  });

  return new ec2.Vpc(stack, vpcId, {
    vpcName: vpcId,
    maxAzs,
    natGateways: 0,
    subnetConfiguration: [
      {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        name: "Isolated",
      },
    ],
  });
}

/**
 * Creates a security group
 * @param stack - The stack
 * @param securityGroupName - Name of the security group
 * @param vpc - The VPC
 * @param description - Security group description
 * @returns The created security group
 * @example
 * const sg = createSecurityGroup(stack, 'web-sg', vpc, 'Web server security group')
 */
export function createSecurityGroup(
  stack: Stack,
  securityGroupName: string,
  vpc: ec2.IVpc,
  description: string
): ec2.SecurityGroup {
  const sgId = generateResourceName({
    stack,
    resourceType: "sg",
    resourceName: securityGroupName,
  });

  return new ec2.SecurityGroup(stack, sgId, {
    securityGroupName: sgId,
    vpc,
    description,
    allowAllOutbound: true,
  });
}

/**
 * Adds an ingress rule to a security group
 * @param securityGroup - The security group
 * @param port - Port number
 * @param peer - Network peer (e.g., ec2.Peer.anyIpv4())
 * @param description - Rule description
 * @example
 * addIngressRule(securityGroup, 80, ec2.Peer.anyIpv4(), 'Allow HTTP')
 */
export function addIngressRule(
  securityGroup: ec2.SecurityGroup,
  port: number,
  peer: ec2.IPeer,
  description: string
): void {
  securityGroup.addIngressRule(peer, ec2.Port.tcp(port), description);
}

/**
 * Adds an egress rule to a security group
 * @param securityGroup - The security group
 * @param port - Port number
 * @param peer - Network peer
 * @param description - Rule description
 * @example
 * addEgressRule(securityGroup, 443, ec2.Peer.anyIpv4(), 'Allow HTTPS outbound')
 */
export function addEgressRule(
  securityGroup: ec2.SecurityGroup,
  port: number,
  peer: ec2.IPeer,
  description: string
): void {
  securityGroup.addEgressRule(peer, ec2.Port.tcp(port), description);
}

/**
 * Connects a Lambda function to a VPC
 * @param lambdaFunction - The Lambda function
 * @param vpc - The VPC
 * @param subnets - Subnets to use (default: private subnets)
 * @param securityGroups - Security groups to use
 * @example
 * connectLambdaToVpc(lambdaFunction, vpc, vpc.privateSubnets, [securityGroup])
 */
export function connectLambdaToVpc(
  lambdaFunction: lambda.Function,
  vpc: ec2.IVpc,
  subnets?: ec2.ISubnet[],
  securityGroups?: ec2.ISecurityGroup[]
): void {
  lambdaFunction.connections.allowToDefaultPort(
    ec2.Peer.ipv4(vpc.vpcCidrBlock),
    "Allow Lambda to VPC"
  );
  
  // Note: Actual VPC connection is done via Lambda function configuration
  // This is a helper for security group rules
}

/**
 * Creates a VPC endpoint
 * @param stack - The stack
 * @param endpointName - Name of the endpoint
 * @param vpc - The VPC
 * @param service - VPC endpoint service
 * @param subnets - Subnets for the endpoint
 * @returns The created VPC endpoint
 * @example
 * const endpoint = createVpcEndpoint(stack, 's3-endpoint', vpc, ec2.GatewayVpcEndpointAwsService.S3, vpc.privateSubnets)
 */
export function createVpcEndpoint(
  stack: Stack,
  endpointName: string,
  vpc: ec2.IVpc,
  service: ec2.IGatewayVpcEndpointService | ec2.IInterfaceVpcEndpointService,
  subnets?: ec2.ISubnet[]
): ec2.VpcEndpoint | ec2.InterfaceVpcEndpoint {
  const endpointId = generateResourceName({
    stack,
    resourceType: "endpoint",
    resourceName: endpointName,
  });

  if (service instanceof ec2.GatewayVpcEndpointAwsService) {
    return vpc.addGatewayEndpoint(endpointId, {
      service: service as ec2.GatewayVpcEndpointAwsService,
    });
  } else {
    return vpc.addInterfaceEndpoint(endpointId, {
      service: service as ec2.IInterfaceVpcEndpointService,
      subnets: subnets ? { subnets } : undefined,
    });
  }
}

