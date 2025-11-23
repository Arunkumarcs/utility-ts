/**
 * Zod Utilities
 * Utilities for working with Zod schema validation
 */

/**
 * Common Zod schema patterns and utilities
 * Note: This file provides utility functions that work with Zod.
 * You need to install 'zod' package: npm install zod
 */

/**
 * Creates a schema validator function
 * @param schema - Zod schema
 * @returns Validator function
 * @example
 * import { z } from 'zod'
 * const schema = z.object({ name: z.string(), age: z.number() })
 * const validate = createValidator(schema)
 * const result = validate({ name: 'John', age: 30 })
 */
export function createValidator<T>(schema: any): (data: unknown) => T {
  return (data: unknown): T => {
    return schema.parse(data);
  };
}

/**
 * Creates a safe validator that returns result instead of throwing
 * @param schema - Zod schema
 * @returns Safe validator function
 * @example
 * const validate = createSafeValidator(schema)
 * const result = validate(data)
 * if (result.success) {
 *   console.log(result.data)
 * } else {
 *   console.error(result.error)
 * }
 */
export function createSafeValidator<T>(schema: any): (data: unknown) => {
  success: boolean;
  data?: T;
  error?: any;
} {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  };
}

/**
 * Validates and transforms data with error handling
 * @param schema - Zod schema
 * @param data - Data to validate
 * @param onError - Error handler
 * @returns Validated data or undefined
 * @example
 * const validated = validateWithErrorHandler(schema, data, (error) => {
 *   console.error('Validation failed:', error)
 * })
 */
export function validateWithErrorHandler<T>(
  schema: any,
  data: unknown,
  onError?: (error: any) => void
): T | undefined {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    if (onError) {
      onError(result.error);
    }
    return undefined;
  }
}

/**
 * Creates a partial schema (all fields optional)
 * @param schema - Zod schema
 * @returns Partial schema
 * @example
 * const partialSchema = createPartialSchema(schema)
 */
export function createPartialSchema(schema: any): any {
  if (schema.partial) {
    return schema.partial();
  }
  throw new Error("Schema does not support partial()");
}

/**
 * Creates a pick schema (select specific fields)
 * @param schema - Zod object schema
 * @param keys - Keys to pick
 * @returns Picked schema
 * @example
 * const pickedSchema = createPickSchema(schema, ['name', 'age'])
 */
export function createPickSchema(schema: any, keys: string[]): any {
  if (schema.pick) {
    return schema.pick(
      keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );
  }
  throw new Error("Schema does not support pick()");
}

/**
 * Creates an omit schema (exclude specific fields)
 * @param schema - Zod object schema
 * @param keys - Keys to omit
 * @returns Omitted schema
 * @example
 * const omittedSchema = createOmitSchema(schema, ['password'])
 */
export function createOmitSchema(schema: any, keys: string[]): any {
  if (schema.omit) {
    return schema.omit(
      keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );
  }
  throw new Error("Schema does not support omit()");
}

/**
 * Merges two Zod object schemas
 * @param schema1 - First schema
 * @param schema2 - Second schema
 * @returns Merged schema
 * @example
 * const merged = mergeSchemas(schema1, schema2)
 */
export function mergeSchemas(schema1: any, schema2: any): any {
  if (schema1.merge && schema2) {
    return schema1.merge(schema2);
  }
  throw new Error("Schemas do not support merge()");
}

/**
 * Creates a schema with default values
 * @param schema - Zod schema
 * @param defaults - Default values
 * @returns Schema with defaults
 * @example
 * const schemaWithDefaults = createSchemaWithDefaults(schema, { age: 0 })
 */
export function createSchemaWithDefaults(
  schema: any,
  defaults: Record<string, any>
): any {
  // This is a helper that preprocesses data before validation
  return schema.preprocess((data: any) => {
    return { ...defaults, ...data };
  }, schema);
}

/**
 * Validates array of items
 * @param schema - Zod schema for array items
 * @param data - Array data to validate
 * @returns Validated array
 * @example
 * const validatedArray = validateArray(itemSchema, [item1, item2])
 */
export function validateArray<T>(schema: any, data: unknown[]): T[] {
  const arraySchema = schema.array();
  return arraySchema.parse(data);
}

/**
 * Creates a schema validator with custom error messages
 * @param schema - Zod schema
 * @param errorMap - Custom error messages
 * @returns Validator function
 * @example
 * const validate = createValidatorWithCustomErrors(schema, {
 *   required_error: 'This field is required'
 * })
 */
export function createValidatorWithCustomErrors(
  schema: any,
  errorMap: Record<string, string>
): (data: unknown) => any {
  return (data: unknown) => {
    try {
      return schema.parse(data);
    } catch (error: any) {
      // Map custom error messages
      if (error.errors) {
        error.errors = error.errors.map((err: any) => {
          const customMessage = errorMap[err.code];
          if (customMessage) {
            return { ...err, message: customMessage };
          }
          return err;
        });
      }
      throw error;
    }
  };
}

/**
 * Formats Zod error for user-friendly display
 * @param error - Zod error
 * @returns Formatted error object
 * @example
 * const formatted = formatZodError(error)
 */
export function formatZodError(error: any): {
  message: string;
  errors: Array<{ path: string; message: string }>;
} {
  if (!error.errors) {
    return { message: "Validation error", errors: [] };
  }

  const errors = error.errors.map((err: any) => ({
    path: err.path.join(".") || "root",
    message: err.message,
  }));

  return {
    message: "Validation failed",
    errors,
  };
}

