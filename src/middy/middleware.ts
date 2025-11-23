/**
 * Middy Middleware Utilities
 */

import { APIGatewayProxyResult } from "aws-lambda";
import { CorsConfig, ErrorResponse } from "./types";

/**
 * Creates a standardized success response
 * @param statusCode - HTTP status code (default: 200)
 * @param body - Response body (will be JSON stringified)
 * @param headers - Additional headers
 * @returns API Gateway proxy result
 * @example
 * return createSuccessResponse(200, { message: 'Success' })
 */
export function createSuccessResponse(
  body: any,
  statusCode: number = 200,
  headers?: Record<string, string>
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

/**
 * Creates a standardized error response
 * @param statusCode - HTTP status code (default: 500)
 * @param message - Error message
 * @param error - Optional error object
 * @param headers - Additional headers
 * @returns API Gateway proxy result
 * @example
 * return createErrorResponse(400, 'Invalid request', error)
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  error?: Error | any,
  headers?: Record<string, string>
): APIGatewayProxyResult {
  const errorResponse: ErrorResponse = {
    statusCode,
    body: JSON.stringify({
      message,
      ...(error && { error: error.message || String(error) }),
      ...(process.env.NODE_ENV === "development" && error && { stack: error.stack }),
    }),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  return errorResponse;
}

/**
 * Creates CORS headers
 * @param config - CORS configuration
 * @param requestOrigin - Origin from the request
 * @returns CORS headers
 * @example
 * const corsHeaders = createCorsHeaders({ origin: '*' }, event.headers.origin)
 */
export function createCorsHeaders(
  config: CorsConfig,
  requestOrigin?: string
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Set Access-Control-Allow-Origin
  if (config.origin === "*" || (Array.isArray(config.origin) && config.origin.includes("*"))) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (config.origin) {
    const allowedOrigins = Array.isArray(config.origin) ? config.origin : [config.origin];
    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      headers["Access-Control-Allow-Origin"] = requestOrigin;
    } else if (allowedOrigins.length === 1) {
      headers["Access-Control-Allow-Origin"] = allowedOrigins[0];
    }
  } else {
    headers["Access-Control-Allow-Origin"] = "*";
  }

  // Set Access-Control-Allow-Credentials
  if (config.credentials) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  // Set Access-Control-Allow-Headers
  if (config.headers && config.headers.length > 0) {
    headers["Access-Control-Allow-Headers"] = config.headers.join(", ");
  } else {
    headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key";
  }

  // Set Access-Control-Allow-Methods
  if (config.methods && config.methods.length > 0) {
    headers["Access-Control-Allow-Methods"] = config.methods.join(", ");
  } else {
    headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
  }

  // Set Access-Control-Max-Age
  if (config.maxAge !== undefined) {
    headers["Access-Control-Max-Age"] = String(config.maxAge);
  }

  return headers;
}

/**
 * Creates a CORS preflight response
 * @param config - CORS configuration
 * @param requestOrigin - Origin from the request
 * @returns Preflight response
 * @example
 * if (event.httpMethod === 'OPTIONS') {
 *   return createCorsPreflightResponse({ origin: '*' }, event.headers.origin)
 * }
 */
export function createCorsPreflightResponse(
  config: CorsConfig,
  requestOrigin?: string
): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: createCorsHeaders(config, requestOrigin),
    body: "",
  };
}

/**
 * Extracts path parameters from event
 * @param event - API Gateway event
 * @returns Path parameters
 * @example
 * const { id } = getPathParameters(event)
 */
export function getPathParameters(event: any): Record<string, string> {
  return event.pathParameters || {};
}

/**
 * Extracts query string parameters from event
 * @param event - API Gateway event
 * @returns Query string parameters
 * @example
 * const { page, limit } = getQueryParameters(event)
 */
export function getQueryParameters(event: any): Record<string, string | undefined> {
  return event.queryStringParameters || {};
}

/**
 * Extracts request body from event
 * @param event - API Gateway event
 * @returns Parsed body (if JSON) or raw body
 * @example
 * const body = getRequestBody(event)
 */
export function getRequestBody(event: any): any {
  if (!event.body) {
    return null;
  }

  // If body is already parsed (by httpJsonBodyParser middleware)
  if (typeof event.body === "object") {
    return event.body;
  }

  // Try to parse as JSON
  try {
    return JSON.parse(event.body);
  } catch {
    return event.body;
  }
}

/**
 * Gets a header value from event
 * @param event - API Gateway event
 * @param headerName - Name of the header (case-insensitive)
 * @returns Header value or undefined
 * @example
 * const authToken = getHeader(event, 'Authorization')
 */
export function getHeader(event: any, headerName: string): string | undefined {
  const headers = event.headers || {};
  const lowerHeaderName = headerName.toLowerCase();

  // Check exact match first
  if (headers[headerName]) {
    return headers[headerName];
  }

  // Check case-insensitive match
  for (const key in headers) {
    if (key.toLowerCase() === lowerHeaderName) {
      return headers[key];
    }
  }

  return undefined;
}

/**
 * Validates required fields in an object
 * @param data - Object to validate
 * @param requiredFields - Array of required field names
 * @throws Error if any required field is missing
 * @example
 * validateRequiredFields(body, ['email', 'password'])
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
}

/**
 * Creates a pagination response
 * @param data - Array of items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Paginated response
 * @example
 * return createPaginatedResponse(items, 1, 10, 100)
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): APIGatewayProxyResult {
  return createSuccessResponse({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

