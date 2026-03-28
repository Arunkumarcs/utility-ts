/**
 * AWS CDK Route53 Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import { generateResourceName } from "../naming";

/**
 * Creates a Route53 hosted zone
 * @param stack - The stack
 * @param zoneName - Domain name for the hosted zone
 * @param options - Hosted zone options
 * @returns The created hosted zone
 * @example
 * const zone = createHostedZone(stack, 'example.com', {
 *   comment: 'Hosted zone for example.com'
 * })
 */
export function createHostedZone(
  stack: Stack,
  zoneName: string,
  options?: {
    comment?: string;
  }
): route53.HostedZone {
  const zoneId = generateResourceName({
    stack,
    resourceType: "zone",
    resourceName: zoneName.replace(/\./g, "-"),
  });

  return new route53.HostedZone(stack, zoneId, {
    zoneName,
    comment: options?.comment || `Hosted zone for ${zoneName}`,
  });
}

/**
 * Gets an existing Route53 hosted zone
 * @param stack - The stack
 * @param zoneName - Domain name of the hosted zone
 * @returns The hosted zone reference
 * @example
 * const zone = getHostedZone(stack, 'example.com')
 */
export function getHostedZone(
  stack: Stack,
  zoneName: string
): route53.IHostedZone {
  return route53.HostedZone.fromLookup(stack, `LookupZone-${zoneName.replace(/\./g, "-")}`, {
    domainName: zoneName,
  });
}

/**
 * Creates an A record pointing to a CloudFront distribution
 * @param stack - The stack
 * @param recordName - Name of the record
 * @param hostedZone - The hosted zone
 * @param distribution - CloudFront distribution
 * @param options - Record options
 * @returns The created A record
 * @example
 * const record = createCloudFrontARecord(stack, 'www', hostedZone, distribution)
 */
export function createCloudFrontARecord(
  stack: Stack,
  recordName: string,
  hostedZone: route53.IHostedZone,
  distribution: cloudfront.IDistribution,
  options?: {
    ttl?: import("aws-cdk-lib").Duration;
  }
): route53.ARecord {
  const recordId = generateResourceName({
    stack,
    resourceType: "record",
    resourceName: recordName,
  });

  return new route53.ARecord(stack, recordId, {
    zone: hostedZone,
    recordName,
    target: route53.RecordTarget.fromAlias(
      new route53_targets.CloudFrontTarget(distribution)
    ),
    ttl: options?.ttl,
  });
}

/**
 * Creates an A record pointing to an API Gateway
 * @param stack - The stack
 * @param recordName - Name of the record
 * @param hostedZone - The hosted zone
 * @param apiGateway - API Gateway
 * @param options - Record options
 * @returns The created A record
 * @example
 * const record = createApiGatewayARecord(stack, 'api', hostedZone, apiGateway)
 */
export function createApiGatewayARecord(
  stack: Stack,
  recordName: string,
  hostedZone: route53.IHostedZone,
  apiGateway: apigateway.RestApi,
  options?: {
    ttl?: import("aws-cdk-lib").Duration;
  }
): route53.ARecord {
  const recordId = generateResourceName({
    stack,
    resourceType: "record",
    resourceName: recordName,
  });

  return new route53.ARecord(stack, recordId, {
    zone: hostedZone,
    recordName,
    target: route53.RecordTarget.fromAlias(
      new route53_targets.ApiGateway(apiGateway)
    ),
    ttl: options?.ttl,
  });
}

/**
 * Creates an A record pointing to an S3 bucket
 * @param stack - The stack
 * @param recordName - Name of the record
 * @param hostedZone - The hosted zone
 * @param bucket - S3 bucket
 * @param options - Record options
 * @returns The created A record
 * @example
 * const record = createS3ARecord(stack, 'www', hostedZone, bucket)
 */
export function createS3ARecord(
  stack: Stack,
  recordName: string,
  hostedZone: route53.IHostedZone,
  bucket: s3.IBucket,
  options?: {
    ttl?: import("aws-cdk-lib").Duration;
  }
): route53.ARecord {
  const recordId = generateResourceName({
    stack,
    resourceType: "record",
    resourceName: recordName,
  });

  return new route53.ARecord(stack, recordId, {
    zone: hostedZone,
    recordName,
    target: route53.RecordTarget.fromAlias(
      new route53_targets.BucketWebsiteTarget(bucket)
    ),
    ttl: options?.ttl,
  });
}

/**
 * Creates a CNAME record
 * @param stack - The stack
 * @param recordName - Name of the record
 * @param hostedZone - The hosted zone
 * @param target - Target domain name
 * @param options - Record options
 * @returns The created CNAME record
 * @example
 * const record = createCnameRecord(stack, 'www', hostedZone, 'example.com')
 */
export function createCnameRecord(
  stack: Stack,
  recordName: string,
  hostedZone: route53.IHostedZone,
  target: string,
  options?: {
    ttl?: import("aws-cdk-lib").Duration;
  }
): route53.CnameRecord {
  const recordId = generateResourceName({
    stack,
    resourceType: "cname",
    resourceName: recordName,
  });

  return new route53.CnameRecord(stack, recordId, {
    zone: hostedZone,
    recordName,
    domainName: target,
    ttl: options?.ttl,
  });
}

