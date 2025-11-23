/**
 * AWS CDK CloudFront Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import { generateResourceName } from "../naming";

/**
 * Creates a CloudFront distribution
 * @param stack - The stack
 * @param distributionName - Name of the distribution
 * @param origin - Origin configuration
 * @param options - Distribution options
 * @returns The created distribution
 * @example
 * const distribution = createCloudFrontDistribution(stack, 'my-distribution', origin, {
 *   defaultBehavior: { viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS }
 * })
 */
export function createCloudFrontDistribution(
  stack: Stack,
  distributionName: string,
  origin: cloudfront.IOrigin,
  options?: {
    defaultBehavior?: cloudfront.BehaviorOptions;
    comment?: string;
    enabled?: boolean;
    priceClass?: cloudfront.PriceClass;
    certificate?: certificatemanager.ICertificate;
    domainNames?: string[];
  }
): cloudfront.Distribution {
  const distributionId = generateResourceName({
    stack,
    resourceType: "cloudfront",
    resourceName: distributionName,
  });

  return new cloudfront.Distribution(stack, distributionId, {
    defaultBehavior: options?.defaultBehavior || {
      origin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    comment: options?.comment,
    enabled: options?.enabled !== false,
    priceClass: options?.priceClass || cloudfront.PriceClass.PRICE_CLASS_100,
    certificate: options?.certificate,
    domainNames: options?.domainNames,
  });
}

/**
 * Creates a CloudFront distribution for an S3 bucket
 * @param stack - The stack
 * @param distributionName - Name of the distribution
 * @param bucket - The S3 bucket
 * @param options - Distribution options
 * @returns The created distribution
 * @example
 * const distribution = createS3CloudFrontDistribution(stack, 'my-distribution', bucket)
 */
export function createS3CloudFrontDistribution(
  stack: Stack,
  distributionName: string,
  bucket: s3.IBucket,
  options?: {
    viewerProtocolPolicy?: cloudfront.ViewerProtocolPolicy;
    allowedMethods?: cloudfront.AllowedMethods;
    cachedMethods?: cloudfront.CachedMethods;
    compress?: boolean;
  }
): cloudfront.Distribution {
  const origin = new origins.S3Origin(bucket);

  return createCloudFrontDistribution(stack, distributionName, origin, {
    defaultBehavior: {
      origin,
      viewerProtocolPolicy:
        options?.viewerProtocolPolicy ||
        cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods:
        options?.allowedMethods || cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      cachedMethods:
        options?.cachedMethods || cloudfront.CachedMethods.CACHE_GET_HEAD,
      compress: options?.compress !== false,
    },
  });
}

/**
 * Creates a CloudFront distribution for an API Gateway
 * @param stack - The stack
 * @param distributionName - Name of the distribution
 * @param apiGateway - The API Gateway
 * @param options - Distribution options
 * @returns The created distribution
 * @example
 * const distribution = createApiGatewayCloudFrontDistribution(stack, 'api-distribution', api)
 */
export function createApiGatewayCloudFrontDistribution(
  stack: Stack,
  distributionName: string,
  apiGateway: apigateway.RestApi,
  options?: {
    viewerProtocolPolicy?: cloudfront.ViewerProtocolPolicy;
  }
): cloudfront.Distribution {
  const origin = new origins.RestApiOrigin(apiGateway);

  return createCloudFrontDistribution(stack, distributionName, origin, {
    defaultBehavior: {
      origin,
      viewerProtocolPolicy:
        options?.viewerProtocolPolicy ||
        cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
    },
  });
}

/**
 * Creates a CloudFront origin access identity
 * @param stack - The stack
 * @param oaiName - Name of the OAI
 * @param comment - OAI comment
 * @returns The created OAI
 * @example
 * const oai = createOriginAccessIdentity(stack, 'my-oai', 'OAI for S3 bucket')
 */
export function createOriginAccessIdentity(
  stack: Stack,
  oaiName: string,
  comment?: string
): cloudfront.OriginAccessIdentity {
  const oaiId = generateResourceName({
    stack,
    resourceType: "oai",
    resourceName: oaiName,
  });

  return new cloudfront.OriginAccessIdentity(stack, oaiId, {
    comment: comment || `OAI for ${oaiName}`,
  });
}

/**
 * Creates a CloudFront cache policy
 * @param stack - The stack
 * @param policyName - Name of the policy
 * @param options - Cache policy options
 * @returns The created cache policy
 * @example
 * const policy = createCachePolicy(stack, 'my-cache-policy', {
 *   defaultTtl: Duration.days(1),
 *   maxTtl: Duration.days(30)
 * })
 */
export function createCachePolicy(
  stack: Stack,
  policyName: string,
  options?: {
    defaultTtl?: Duration;
    maxTtl?: Duration;
    minTtl?: Duration;
    cookieBehavior?: cloudfront.CacheCookieBehavior;
    headerBehavior?: cloudfront.CacheHeaderBehavior;
    queryStringBehavior?: cloudfront.CacheQueryStringBehavior;
  }
): cloudfront.CachePolicy {
  const policyId = generateResourceName({
    stack,
    resourceType: "cachepolicy",
    resourceName: policyName,
  });

  return new cloudfront.CachePolicy(stack, policyId, {
    cachePolicyName: policyId,
    defaultTtl: options?.defaultTtl || Duration.days(1),
    maxTtl: options?.maxTtl || Duration.days(365),
    minTtl: options?.minTtl || Duration.seconds(0),
    cookieBehavior:
      options?.cookieBehavior || cloudfront.CacheCookieBehavior.none(),
    headerBehavior:
      options?.headerBehavior || cloudfront.CacheHeaderBehavior.none(),
    queryStringBehavior:
      options?.queryStringBehavior ||
      cloudfront.CacheQueryStringBehavior.none(),
  });
}

