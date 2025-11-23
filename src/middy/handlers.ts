/**
 * Middy Handler Utilities
 */

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { LambdaHandler, MiddyHandlerOptions } from "./types";
import { createErrorResponse } from "./middleware";

/**
 * Wraps a Lambda handler with error handling
 * @param handler - The Lambda handler function
 * @returns Wrapped handler with error handling
 * @example
 * export const handler = withErrorHandling(async (event, context) => {
 *   // Your handler logic
 *   return { statusCode: 200, body: JSON.stringify({ message: 'Success' }) }
 * })
 */
export function withErrorHandling(
  handler: LambdaHandler
): (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult> {
  return async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
      return await handler(event, context);
    } catch (error: any) {
      console.error("Handler error:", error);

      // Determine status code based on error type
      let statusCode = 500;
      if (error.statusCode) {
        statusCode = error.statusCode;
      } else if (error.name === "ValidationError") {
        statusCode = 400;
      } else if (error.name === "UnauthorizedError") {
        statusCode = 401;
      } else if (error.name === "ForbiddenError") {
        statusCode = 403;
      } else if (error.name === "NotFoundError") {
        statusCode = 404;
      }

      return createErrorResponse(
        error.message || "Internal server error",
        statusCode,
        error
      );
    }
  };
}

/**
 * Creates a basic Lambda handler with common middleware setup
 * Note: This is a helper that returns handler configuration.
 * Actual Middy middleware setup should be done in your Lambda code.
 * @param handler - The core handler function
 * @param options - Middy handler options
 * @returns Handler function ready for Middy
 * @example
 * export const handler = createMiddyHandler(async (event) => {
 *   return createSuccessResponse({ message: 'Hello' })
 * }, {
 *   cors: true,
 *   httpJsonBodyParser: true,
 *   httpErrorHandler: true
 * })
 */
export function createMiddyHandler(
  handler: (event: any, context: Context) => Promise<APIGatewayProxyResult>,
  options?: MiddyHandlerOptions
): LambdaHandler {
  // Return handler with error handling
  // Note: Actual Middy middleware should be applied in the Lambda code
  // This is a utility wrapper that provides error handling
  return withErrorHandling(handler);
}

/**
 * Creates a handler factory with default middleware configuration
 * @param defaultOptions - Default middleware options
 * @returns Handler factory function
 * @example
 * const createHandler = createHandlerFactory({
 *   cors: { origin: '*' },
 *   httpJsonBodyParser: true
 * })
 *
 * export const handler = createHandler(async (event) => {
 *   return createSuccessResponse({ data: 'result' })
 * })
 */
export function createHandlerFactory(defaultOptions?: MiddyHandlerOptions) {
  return (
    handler: (event: any, context: Context) => Promise<APIGatewayProxyResult>,
    options?: MiddyHandlerOptions
  ): LambdaHandler => {
    const mergedOptions = { ...defaultOptions, ...options };
    return createMiddyHandler(handler, mergedOptions);
  };
}

/**
 * Validates API Gateway event structure
 * @param event - API Gateway event
 * @throws Error if event structure is invalid
 * @example
 * validateApiGatewayEvent(event)
 */
export function validateApiGatewayEvent(event: any): void {
  if (!event) {
    throw new Error("Event is required");
  }

  if (!event.httpMethod && !event.requestContext) {
    throw new Error("Invalid API Gateway event structure");
  }
}

/**
 * Gets the HTTP method from event
 * @param event - API Gateway event
 * @returns HTTP method
 * @example
 * const method = getHttpMethod(event) // 'GET', 'POST', etc.
 */
export function getHttpMethod(event: APIGatewayProxyEvent): string {
  return event.httpMethod || "GET";
}

/**
 * Gets the path from event
 * @param event - API Gateway event
 * @returns Request path
 * @example
 * const path = getPath(event) // '/api/users'
 */
export function getPath(event: APIGatewayProxyEvent): string {
  return event.path || event.requestContext?.path || "/";
}

/**
 * Gets the request ID from context
 * @param context - Lambda context
 * @returns Request ID
 * @example
 * const requestId = getRequestId(context)
 */
export function getRequestId(context: Context): string {
  return context.awsRequestId || "";
}

/**
 * Creates a handler that logs request/response
 * @param handler - The handler function
 * @param logLevel - Log level ('info', 'debug', 'error')
 * @returns Handler with logging
 * @example
 * export const handler = withLogging(async (event) => {
 *   return createSuccessResponse({ data: 'result' })
 * }, 'debug')
 */
export function withLogging(
  handler: LambdaHandler,
  logLevel: "info" | "debug" | "error" = "info"
): LambdaHandler {
  return async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const startTime = Date.now();

    if (logLevel === "debug" || logLevel === "info") {
      console.log("Request:", {
        method: getHttpMethod(event),
        path: getPath(event),
        requestId: getRequestId(context),
        headers: event.headers,
      });
    }

    try {
      const response = await handler(event, context);
      const duration = Date.now() - startTime;

      if (logLevel === "debug" || logLevel === "info") {
        console.log("Response:", {
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          requestId: getRequestId(context),
        });
      }

      return response;
    } catch (error: any) {
      const duration = Date.now() - startTime;

      if (logLevel === "error" || logLevel === "debug" || logLevel === "info") {
        console.error("Handler error:", {
          error: error.message,
          duration: `${duration}ms`,
          requestId: getRequestId(context),
          stack: error.stack,
        });
      }

      throw error;
    }
  };
}
