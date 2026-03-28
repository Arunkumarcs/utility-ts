/**
 * AWS CDK API Gateway Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { ApiGatewayRestApiOptions } from "./types";
import { generateResourceName } from "../naming";

/**
 * Creates a REST API Gateway
 * @param options - API Gateway configuration options
 * @returns The created REST API
 * @example
 * const api = createRestApi({
 *   stack,
 *   apiName: 'my-api',
 *   description: 'My API'
 * })
 */
export function createRestApi(
  options: ApiGatewayRestApiOptions
): apigateway.RestApi {
  const { stack, apiName, description, deployOptions, cors } = options;

  const apiId = generateResourceName({
    stack,
    resourceType: "api",
    resourceName: apiName,
  });

  const defaultCorsPreflightOptions: apigateway.CorsOptions | undefined = cors
    ? {
        allowOrigins: cors.allowOrigins,
        allowMethods: cors.allowMethods || [
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "OPTIONS",
        ],
        allowHeaders: cors.allowHeaders || [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
      }
    : undefined;

  return new apigateway.RestApi(stack, apiId, {
    restApiName: apiId,
    description,
    defaultCorsPreflightOptions,
    deployOptions: {
      stageName: deployOptions?.stageName || "prod",
      throttlingBurstLimit: deployOptions?.throttlingBurstLimit || 5000,
      throttlingRateLimit: deployOptions?.throttlingRateLimit || 10000,
    },
  });
}

/**
 * Adds a Lambda integration to an API Gateway resource
 * @param resource - The API Gateway resource
 * @param lambdaFunction - The Lambda function to integrate
 * @param method - HTTP method
 * @param options - Integration options
 * @example
 * addLambdaIntegration(resource, lambdaFunction, 'GET')
 */
export function addLambdaIntegration(
  resource: apigateway.IResource,
  lambdaFunction: lambda.IFunction,
  method: string,
  options?: {
    requestTemplates?: { [contentType: string]: string };
    integrationResponses?: apigateway.IntegrationResponse[];
  }
): apigateway.Method {
  return resource.addMethod(
    method,
    new apigateway.LambdaIntegration(lambdaFunction, {
      requestTemplates: options?.requestTemplates,
      integrationResponses: options?.integrationResponses,
    })
  );
}

/**
 * Creates a resource path in an API Gateway
 * @param api - The REST API
 * @param path - Resource path (e.g., '/users')
 * @returns The created resource
 * @example
 * const usersResource = createApiResource(api, '/users')
 */
export function createApiResource(
  api: apigateway.RestApi,
  path: string
): apigateway.Resource {
  const pathParts = path.split("/").filter((p) => p.length > 0);
  let resource: apigateway.IResource = api.root;

  for (const part of pathParts) {
    const existingResource = resource.getResource(part);
    if (existingResource) {
      resource = existingResource;
    } else {
      resource = resource.addResource(part);
    }
  }

  return resource as apigateway.Resource;
}

/**
 * Creates a proxy resource that forwards all requests to a Lambda function
 * @param resource - The API Gateway resource
 * @param lambdaFunction - The Lambda function
 * @param method - HTTP method (default: 'ANY')
 * @example
 * createProxyIntegration(resource, lambdaFunction, 'ANY')
 */
export function createProxyIntegration(
  resource: apigateway.IResource,
  lambdaFunction: lambda.IFunction,
  method: string = "ANY"
): void {
  resource.addProxy({
    defaultIntegration: new apigateway.LambdaIntegration(lambdaFunction),
    anyMethod: method === "ANY",
  });
}

/**
 * Adds CORS to an API Gateway resource
 * @param resource - The API Gateway resource
 * @param options - CORS options
 * @example
 * addCors(resource, {
 *   allowOrigins: ['https://example.com'],
 *   allowMethods: ['GET', 'POST']
 * })
 */
export function addCors(
  resource: apigateway.IResource,
  options: {
    allowOrigins: string[];
    allowMethods?: string[];
    allowHeaders?: string[];
    allowCredentials?: boolean;
  }
): void {
  resource.addCorsPreflight({
    allowOrigins: options.allowOrigins,
    allowMethods: options.allowMethods || [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    allowHeaders: options.allowHeaders || [
      "Content-Type",
      "X-Amz-Date",
      "Authorization",
      "X-Api-Key",
    ],
    allowCredentials: options.allowCredentials,
  });
}

/**
 * Creates an API Gateway authorizer using a Lambda function
 * @param api - The REST API
 * @param authorizerName - Name of the authorizer
 * @param lambdaFunction - The Lambda function for authorization
 * @param options - Authorizer options
 * @returns The created authorizer
 * @example
 * const authorizer = createLambdaAuthorizer(api, 'my-authorizer', authorizerFunction, {
 *   resultsCacheTtl: Duration.minutes(5)
 * })
 */
export function createLambdaAuthorizer(
  api: apigateway.RestApi,
  authorizerName: string,
  lambdaFunction: lambda.IFunction,
  options?: {
    resultsCacheTtl?: Duration;
    identitySource?: string;
    authorizerName?: string;
  }
): apigateway.RequestAuthorizer {
  return new apigateway.RequestAuthorizer(api, authorizerName, {
    handler: lambdaFunction,
    resultsCacheTtl: options?.resultsCacheTtl || Duration.seconds(300),
    identitySources: [
      apigateway.IdentitySource.header(
        options?.identitySource || "Authorization"
      ),
    ],
    authorizerName: options?.authorizerName || authorizerName,
  });
}

/**
 * Adds a usage plan to an API Gateway
 * @param api - The REST API
 * @param planName - Name of the usage plan
 * @param options - Usage plan options
 * @returns The created usage plan
 * @example
 * const usagePlan = addUsagePlan(api, 'basic-plan', {
 *   throttle: { rateLimit: 100, burstLimit: 200 },
 *   quota: { limit: 10000, period: apigateway.Period.DAY }
 * })
 */
export function addUsagePlan(
  api: apigateway.RestApi,
  planName: string,
  options?: {
    throttle?: { rateLimit: number; burstLimit: number };
    quota?: { limit: number; period: apigateway.Period };
  }
): apigateway.UsagePlan {
  const usagePlan = api.addUsagePlan(planName, {
    throttle: options?.throttle
      ? {
          rateLimit: options.throttle.rateLimit,
          burstLimit: options.throttle.burstLimit,
        }
      : undefined,
    quota: options?.quota
      ? {
          limit: options.quota.limit,
          period: options.quota.period,
        }
      : undefined,
  });

  return usagePlan;
}

/**
 * Creates an API key for API Gateway
 * @param api - The REST API
 * @param keyName - Name of the API key
 * @returns The created API key
 * @example
 * const apiKey = createApiKey(api, 'my-api-key')
 */
export function createApiKey(
  api: apigateway.RestApi,
  keyName: string
): apigateway.IApiKey {
  return api.addApiKey(keyName);
}
