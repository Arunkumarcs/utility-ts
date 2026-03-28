/**
 * Lambda Utilities
 * Utility functions for code inside AWS Lambda functions
 */

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

/**
 * Extracts body from API Gateway event
 * @param event - API Gateway event
 * @returns Parsed body or null
 * @example
 * const body = getEventBody(event)
 */
export function getEventBody<T = any>(event: APIGatewayProxyEvent): T | null {
  if (!event.body) {
    return null;
  }

  try {
    return JSON.parse(event.body) as T;
  } catch {
    return null;
  }
}

/**
 * Gets query parameter from event
 * @param event - API Gateway event
 * @param key - Query parameter key
 * @param defaultValue - Default value if not found
 * @returns Query parameter value or default
 * @example
 * const page = getQueryParam(event, 'page', '1')
 */
export function getQueryParam(
  event: APIGatewayProxyEvent,
  key: string,
  defaultValue?: string
): string | undefined {
  return event.queryStringParameters?.[key] || defaultValue;
}

/**
 * Gets all query parameters
 * @param event - API Gateway event
 * @returns Query parameters object
 * @example
 * const params = getAllQueryParams(event)
 */
export function getAllQueryParams(
  event: APIGatewayProxyEvent
): Record<string, string> {
  const params: Record<string, string> = {};
  if (event.queryStringParameters) {
    for (const [key, value] of Object.entries(event.queryStringParameters)) {
      if (value !== undefined) {
        params[key] = value;
      }
    }
  }
  return params;
}

/**
 * Gets path parameter from event
 * @param event - API Gateway event
 * @param key - Path parameter key
 * @param defaultValue - Default value if not found
 * @returns Path parameter value or default
 * @example
 * const id = getPathParam(event, 'id')
 */
export function getPathParam(
  event: APIGatewayProxyEvent,
  key: string,
  defaultValue?: string
): string | undefined {
  return event.pathParameters?.[key] || defaultValue;
}

/**
 * Gets header from event
 * @param event - API Gateway event
 * @param key - Header key (case-insensitive)
 * @param defaultValue - Default value if not found
 * @returns Header value or default
 * @example
 * const auth = getHeader(event, 'Authorization')
 */
export function getHeader(
  event: APIGatewayProxyEvent,
  key: string,
  defaultValue?: string
): string | undefined {
  const lowerKey = key.toLowerCase();
  const header = Object.entries(event.headers || {}).find(
    ([k]) => k.toLowerCase() === lowerKey
  );
  return header?.[1] || defaultValue;
}

/**
 * Gets all headers
 * @param event - API Gateway event
 * @returns Headers object
 * @example
 * const headers = getAllHeaders(event)
 */
export function getAllHeaders(
  event: APIGatewayProxyEvent
): Record<string, string> {
  const headers: Record<string, string> = {};
  if (event.headers) {
    for (const [key, value] of Object.entries(event.headers)) {
      if (value !== undefined) {
        headers[key] = value;
      }
    }
  }
  return headers;
}

/**
 * Gets HTTP method from event
 * @param event - API Gateway event
 * @returns HTTP method
 * @example
 * const method = getHttpMethod(event) // 'GET', 'POST', etc.
 */
export function getHttpMethod(event: APIGatewayProxyEvent): string {
  return event.httpMethod || "GET";
}

/**
 * Gets request path from event
 * @param event - API Gateway event
 * @returns Request path
 * @example
 * const path = getRequestPath(event) // '/api/users'
 */
export function getRequestPath(event: APIGatewayProxyEvent): string {
  return event.path || event.requestContext?.path || "/";
}

/**
 * Gets request ID from context
 * @param context - Lambda context
 * @returns Request ID
 * @example
 * const requestId = getRequestId(context)
 */
export function getRequestId(context: Context): string {
  return context.awsRequestId || "";
}

/**
 * Gets remaining time in milliseconds
 * @param context - Lambda context
 * @returns Remaining time in milliseconds
 * @example
 * const remaining = getRemainingTime(context)
 */
export function getRemainingTime(context: Context): number {
  return context.getRemainingTimeInMillis();
}

/**
 * Creates a success response
 * @param data - Response data
 * @param statusCode - HTTP status code (default: 200)
 * @param headers - Additional headers
 * @returns API Gateway response
 * @example
 * return createSuccessResponse({ message: 'Success' }, 200)
 */
export function createSuccessResponse(
  data: any,
  statusCode: number = 200,
  headers?: Record<string, string>
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  };
}

/**
 * Creates an error response
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param error - Error object (optional)
 * @returns API Gateway response
 * @example
 * return createErrorResponse('Not found', 404)
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  error?: any
): APIGatewayProxyResult {
  const body: any = {
    error: message,
    statusCode,
  };

  if (error && process.env.NODE_ENV !== "production") {
    body.details = error;
  }

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

/**
 * Creates a redirect response
 * @param location - Redirect URL
 * @param statusCode - HTTP status code (default: 302)
 * @returns API Gateway response
 * @example
 * return createRedirectResponse('https://example.com', 301)
 */
export function createRedirectResponse(
  location: string,
  statusCode: number = 302
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      Location: location,
    },
    body: "",
  };
}

/**
 * Checks if request is from API Gateway
 * @param event - Event object
 * @returns True if from API Gateway
 * @example
 * if (isApiGatewayEvent(event)) { /* API Gateway logic *\/ }
 */
export function isApiGatewayEvent(event: any): event is APIGatewayProxyEvent {
  return (
    event &&
    typeof event === "object" &&
    ("httpMethod" in event || "requestContext" in event)
  );
}

/**
 * Gets user from Cognito authorizer
 * @param event - API Gateway event
 * @returns User information or null
 * @example
 * const user = getCognitoUser(event)
 */
export function getCognitoUser(event: APIGatewayProxyEvent): {
  sub: string;
  email?: string;
  [key: string]: any;
} | null {
  const claims =
    event.requestContext?.authorizer?.claims ||
    event.requestContext?.authorizer;

  if (!claims || !claims.sub) {
    return null;
  }

  return claims as any;
}

/**
 * Gets API Gateway stage
 * @param event - API Gateway event
 * @returns Stage name
 * @example
 * const stage = getStage(event) // 'dev', 'prod', etc.
 */
export function getStage(event: APIGatewayProxyEvent): string {
  return event.requestContext?.stage || "default";
}

/**
 * Gets API Gateway request ID
 * @param event - API Gateway event
 * @returns Request ID
 * @example
 * const requestId = getApiGatewayRequestId(event)
 */
export function getApiGatewayRequestId(event: APIGatewayProxyEvent): string {
  return (
    event.requestContext?.requestId || event.requestContext?.requestId || ""
  );
}

/**
 * Creates CORS headers
 * @param origin - Allowed origin (default: '*')
 * @param methods - Allowed methods (default: '*')
 * @param headers - Allowed headers (default: '*')
 * @returns CORS headers
 * @example
 * const corsHeaders = createCorsHeaders('https://example.com')
 */
export function createCorsHeaders(
  origin: string = "*",
  methods: string = "*",
  headers: string = "*"
): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": headers,
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Checks if Lambda is running in warm start
 * @param context - Lambda context
 * @returns True if warm start
 * @example
 * if (isWarmStart(context)) { /* skip initialization *\/ }
 */
export function isWarmStart(context: Context): boolean {
  // This is a heuristic - warm starts typically have very short remaining time
  // compared to cold starts, but this isn't always reliable
  return context.getRemainingTimeInMillis() < 300000; // Less than 5 minutes
}

/**
 * Logs Lambda invocation details
 * @param event - Lambda event
 * @param context - Lambda context
 * @param additionalData - Additional data to log
 * @example
 * logInvocation(event, context, { userId: '123' })
 */
export function logInvocation(
  event: any,
  context: Context,
  additionalData?: Record<string, any>
): void {
  console.log("Lambda Invocation:", {
    requestId: context.awsRequestId,
    functionName: context.functionName,
    remainingTime: context.getRemainingTimeInMillis(),
    ...additionalData,
  });
}
