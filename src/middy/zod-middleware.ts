/**
 * Middy Zod Middleware
 * Middleware for validating API Gateway events with Zod schemas
 */

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { createErrorResponse } from "./middleware";
import { formatZodError } from "../utils/zod-utils";

/**
 * Zod validation middleware options
 */
export interface ZodMiddlewareOptions {
  bodySchema?: any; // Zod schema for request body
  querySchema?: any; // Zod schema for query parameters
  pathSchema?: any; // Zod schema for path parameters
  headersSchema?: any; // Zod schema for headers
  onError?: (error: any) => APIGatewayProxyResult;
}

/**
 * Creates Zod validation middleware for Middy
 * @param options - Validation options
 * @returns Middy middleware
 * @example
 * import { z } from 'zod'
 * const bodySchema = z.object({ name: z.string(), age: z.number() })
 *
 * export const handler = middy(async (event) => {
 *   return { statusCode: 200, body: JSON.stringify({ success: true }) }
 * }).use(zodMiddleware({ bodySchema }))
 */
export function zodMiddleware(options: ZodMiddlewareOptions = {}) {
  const { bodySchema, querySchema, pathSchema, headersSchema, onError } =
    options;

  return {
    before: async (request: {
      event: APIGatewayProxyEvent;
      context: Context;
    }) => {
      const { event } = request;

      try {
        // Validate body
        if (bodySchema && event.body) {
          let bodyData: any;
          try {
            bodyData = JSON.parse(event.body);
          } catch {
            throw new Error("Invalid JSON in request body");
          }

          const result = bodySchema.safeParse(bodyData);
          if (!result.success) {
            const error = formatZodError(result.error);
            if (onError) {
              return onError(error);
            }
            return createErrorResponse(error.message, 400, {
              validationErrors: error.errors,
            });
          }

          // Attach validated body to event
          (request.event as any).validatedBody = result.data;
        }

        // Validate query parameters
        if (querySchema && event.queryStringParameters) {
          const result = querySchema.safeParse(event.queryStringParameters);
          if (!result.success) {
            const error = formatZodError(result.error);
            if (onError) {
              return onError(error);
            }
            return createErrorResponse(error.message, 400, {
              validationErrors: error.errors,
            });
          }

          (request.event as any).validatedQuery = result.data;
        }

        // Validate path parameters
        if (pathSchema && event.pathParameters) {
          const result = pathSchema.safeParse(event.pathParameters);
          if (!result.success) {
            const error = formatZodError(result.error);
            if (onError) {
              return onError(error);
            }
            return createErrorResponse(error.message, 400, {
              validationErrors: error.errors,
            });
          }

          (request.event as any).validatedPath = result.data;
        }

        // Validate headers
        if (headersSchema && event.headers) {
          const result = headersSchema.safeParse(event.headers);
          if (!result.success) {
            const error = formatZodError(result.error);
            if (onError) {
              return onError(error);
            }
            return createErrorResponse(error.message, 400, {
              validationErrors: error.errors,
            });
          }

          (request.event as any).validatedHeaders = result.data;
        }
      } catch (error: any) {
        if (onError) {
          return onError(error);
        }
        return createErrorResponse(
          error.message || "Validation error",
          400,
          error
        );
      }
    },
  };
}

/**
 * Creates a Zod validator for request body
 * @param schema - Zod schema
 * @returns Middleware function
 * @example
 * export const handler = middy(async (event) => {
 *   const body = event.validatedBody // Validated body
 *   return { statusCode: 200, body: JSON.stringify(body) }
 * }).use(validateBody(bodySchema))
 */
export function validateBody(schema: any) {
  return zodMiddleware({ bodySchema: schema });
}

/**
 * Creates a Zod validator for query parameters
 * @param schema - Zod schema
 * @returns Middleware function
 * @example
 * export const handler = middy(async (event) => {
 *   const query = event.validatedQuery // Validated query params
 *   return { statusCode: 200, body: JSON.stringify(query) }
 * }).use(validateQuery(querySchema))
 */
export function validateQuery(schema: any) {
  return zodMiddleware({ querySchema: schema });
}

/**
 * Creates a Zod validator for path parameters
 * @param schema - Zod schema
 * @returns Middleware function
 * @example
 * export const handler = middy(async (event) => {
 *   const params = event.validatedPath // Validated path params
 *   return { statusCode: 200, body: JSON.stringify(params) }
 * }).use(validatePath(pathSchema))
 */
export function validatePath(schema: any) {
  return zodMiddleware({ pathSchema: schema });
}

/**
 * Creates a Zod validator for headers
 * @param schema - Zod schema
 * @returns Middleware function
 * @example
 * export const handler = middy(async (event) => {
 *   const headers = event.validatedHeaders // Validated headers
 *   return { statusCode: 200, body: JSON.stringify(headers) }
 * }).use(validateHeaders(headersSchema))
 */
export function validateHeaders(schema: any) {
  return zodMiddleware({ headersSchema: schema });
}
