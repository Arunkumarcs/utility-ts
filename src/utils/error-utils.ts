/**
 * Error Utilities
 * Utilities for error handling and creation
 */

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Creates a custom application error
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @param code - Error code
 * @param details - Additional details
 * @returns AppError instance
 * @example
 * throw createError('Not found', 404, 'NOT_FOUND', { id: 123 })
 */
export function createError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): AppError {
  return new AppError(message, statusCode, code, details);
}

/**
 * Creates a not found error
 * @param message - Error message
 * @param details - Additional details
 * @returns AppError instance
 * @example
 * throw createNotFoundError('Resource not found', { id: 123 })
 */
export function createNotFoundError(
  message: string = "Not found",
  details?: any
): AppError {
  return createError(message, 404, "NOT_FOUND", details);
}

/**
 * Creates a bad request error
 * @param message - Error message
 * @param details - Additional details
 * @returns AppError instance
 * @example
 * throw createBadRequestError('Invalid input', { field: 'email' })
 */
export function createBadRequestError(
  message: string = "Bad request",
  details?: any
): AppError {
  return createError(message, 400, "BAD_REQUEST", details);
}

/**
 * Creates an unauthorized error
 * @param message - Error message
 * @param details - Additional details
 * @returns AppError instance
 * @example
 * throw createUnauthorizedError('Authentication required')
 */
export function createUnauthorizedError(
  message: string = "Unauthorized",
  details?: any
): AppError {
  return createError(message, 401, "UNAUTHORIZED", details);
}

/**
 * Creates a forbidden error
 * @param message - Error message
 * @param details - Additional details
 * @returns AppError instance
 * @example
 * throw createForbiddenError('Access denied')
 */
export function createForbiddenError(
  message: string = "Forbidden",
  details?: any
): AppError {
  return createError(message, 403, "FORBIDDEN", details);
}

/**
 * Creates an internal server error
 * @param message - Error message
 * @param details - Additional details
 * @returns AppError instance
 * @example
 * throw createInternalError('Something went wrong')
 */
export function createInternalError(
  message: string = "Internal server error",
  details?: any
): AppError {
  return createError(message, 500, "INTERNAL_ERROR", details);
}

/**
 * Checks if error is an AppError
 * @param error - Error to check
 * @returns True if AppError
 * @example
 * if (isAppError(error)) { console.log(error.statusCode) }
 */
export function isAppError(error: any): error is AppError {
  return error instanceof AppError || (error && error.statusCode !== undefined);
}

/**
 * Gets error message safely
 * @param error - Error object
 * @param defaultMessage - Default message if error has no message
 * @returns Error message
 * @example
 * const message = getErrorMessage(error, 'Unknown error')
 */
export function getErrorMessage(
  error: any,
  defaultMessage: string = "Unknown error"
): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && error.message) {
    return String(error.message);
  }
  return defaultMessage;
}

/**
 * Gets error stack trace
 * @param error - Error object
 * @returns Stack trace or undefined
 * @example
 * const stack = getErrorStack(error)
 */
export function getErrorStack(error: any): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * Serializes error to JSON
 * @param error - Error object
 * @param includeStack - Include stack trace (default: false in production)
 * @returns Serialized error
 * @example
 * const serialized = serializeError(error, true)
 */
export function serializeError(
  error: any,
  includeStack: boolean = false
): Record<string, any> {
  const isProd = process.env.NODE_ENV === "production";

  const serialized: Record<string, any> = {
    message: getErrorMessage(error),
  };

  if (isAppError(error)) {
    serialized.statusCode = error.statusCode;
    serialized.code = error.code;
    if (error.details) {
      serialized.details = error.details;
    }
  }

  if ((includeStack || !isProd) && getErrorStack(error)) {
    serialized.stack = getErrorStack(error);
  }

  return serialized;
}

/**
 * Wraps an async function with error handling
 * @param fn - Async function to wrap
 * @returns Wrapped function
 * @example
 * const safeFn = wrapAsync(async () => { /* ... *\/ })
 */
export function wrapAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Re-throw AppError as-is
      if (isAppError(error)) {
        throw error;
      }
      // Wrap other errors
      throw createInternalError(getErrorMessage(error), error);
    }
  };
}
