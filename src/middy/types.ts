/**
 * Middy Type Definitions
 */

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

/**
 * Lambda handler function type
 */
export type LambdaHandler = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

/**
 * Middy handler options
 */
export interface MiddyHandlerOptions {
  cors?:
    | boolean
    | {
        origin?: string;
        credentials?: boolean;
        headers?: string[];
      };
  httpErrorHandler?: boolean;
  httpHeaderNormalizer?: boolean;
  httpJsonBodyParser?: boolean;
  httpMultipartBodyParser?: boolean;
  httpUrlEncodeBodyParser?: boolean;
  httpEventNormalizer?: boolean;
  httpContentNegotiation?: boolean;
  validator?: {
    inputSchema?: any;
    outputSchema?: any;
  };
  errorLogger?: boolean;
  doNotWaitForEmptyEventLoop?: boolean;
}

/**
 * CORS configuration
 */
export interface CorsConfig {
  origin?: string | string[];
  credentials?: boolean;
  headers?: string[];
  methods?: string[];
  maxAge?: number;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}
