/**
 * Query String Utilities
 * Utilities for Node.js querystring module
 */

import { parse, stringify, escape, unescape } from "querystring";

export interface QueryParams {
  [key: string]: string | string[] | undefined;
}

/**
 * Parses a query string into an object
 * @param str - Query string
 * @param sep - Separator (default: '&')
 * @param eq - Equals sign (default: '=')
 * @param options - Parse options
 * @returns Parsed object
 * @example
 * const params = parseQuery('name=John&age=30')
 */
export function parseQuery(
  str: string,
  sep: string = "&",
  eq: string = "=",
  options?: { maxKeys?: number; decodeURIComponent?: (str: string) => string }
): QueryParams {
  return parse(str, sep, eq, options);
}

/**
 * Converts an object to a query string
 * @param obj - Object to stringify
 * @param sep - Separator (default: '&')
 * @param eq - Equals sign (default: '=')
 * @param options - Stringify options
 * @returns Query string
 * @example
 * const query = stringifyQuery({ name: 'John', age: 30 })
 */
export function stringifyQuery(
  obj: QueryParams,
  sep: string = "&",
  eq: string = "=",
  options?: { encodeURIComponent?: (str: string) => string }
): string {
  return stringify(obj, sep, eq, options);
}

/**
 * Escapes a string for use in query strings
 * @param str - String to escape
 * @returns Escaped string
 * @example
 * const escaped = escapeQuery('hello world')
 */
export function escapeQuery(str: string): string {
  return escape(str);
}

/**
 * Unescapes a query string
 * @param str - String to unescape
 * @returns Unescaped string
 * @example
 * const unescaped = unescapeQuery('hello%20world')
 */
export function unescapeQuery(str: string): string {
  return unescape(str);
}

/**
 * Gets a query parameter value
 * @param queryString - Query string
 * @param key - Parameter key
 * @param defaultValue - Default value if not found
 * @returns Parameter value or default
 * @example
 * const name = getQueryParam('name=John&age=30', 'name')
 */
export function getQueryParam(
  queryString: string,
  key: string,
  defaultValue?: string
): string | string[] | undefined {
  const params = parseQuery(queryString);
  return params[key] ?? defaultValue;
}

/**
 * Sets a query parameter value
 * @param queryString - Query string
 * @param key - Parameter key
 * @param value - Parameter value
 * @returns Updated query string
 * @example
 * const updated = setQueryParam('name=John', 'age', '30')
 */
export function setQueryParam(
  queryString: string,
  key: string,
  value: string | number | boolean
): string {
  const params = parseQuery(queryString);
  params[key] = String(value);
  return stringifyQuery(params);
}

/**
 * Removes a query parameter
 * @param queryString - Query string
 * @param key - Parameter key to remove
 * @returns Updated query string
 * @example
 * const updated = removeQueryParam('name=John&age=30', 'age')
 */
export function removeQueryParam(queryString: string, key: string): string {
  const params = parseQuery(queryString);
  delete params[key];
  return stringifyQuery(params);
}

/**
 * Merges multiple query strings
 * @param queryStrings - Array of query strings
 * @returns Merged query string
 * @example
 * const merged = mergeQueryStrings('name=John', 'age=30')
 */
export function mergeQueryStrings(...queryStrings: string[]): string {
  const merged: QueryParams = {};

  queryStrings.forEach((qs) => {
    if (qs) {
      const params = parseQuery(qs);
      Object.assign(merged, params);
    }
  });

  return stringifyQuery(merged);
}

/**
 * Filters query parameters based on a predicate
 * @param queryString - Query string
 * @param predicate - Filter function
 * @returns Filtered query string
 * @example
 * const filtered = filterQueryParams('a=1&b=2&c=3', (key) => key !== 'b')
 */
export function filterQueryParams(
  queryString: string,
  predicate: (key: string, value: string | string[]) => boolean
): string {
  const params = parseQuery(queryString);
  const filtered: QueryParams = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && predicate(key, value)) {
      filtered[key] = value;
    }
  });

  return stringifyQuery(filtered);
}

/**
 * Validates query parameters against a schema
 * @param queryString - Query string
 * @param schema - Validation schema
 * @returns Validation result
 * @example
 * const result = validateQueryParams('age=30', { age: { type: 'number', required: true } })
 */
export function validateQueryParams(
  queryString: string,
  schema: Record<
    string,
    {
      type?: "string" | "number" | "boolean";
      required?: boolean;
      validator?: (value: any) => boolean;
    }
  >
): { valid: boolean; errors: string[] } {
  const params = parseQuery(queryString);
  const errors: string[] = [];

  Object.entries(schema).forEach(([key, rule]) => {
    const value = params[key];

    if (rule.required && value === undefined) {
      errors.push(`Parameter '${key}' is required`);
      return;
    }

    if (value !== undefined) {
      if (rule.type === "number") {
        const numValue = Array.isArray(value) ? value[0] : value;
        if (isNaN(Number(numValue))) {
          errors.push(`Parameter '${key}' must be a number`);
        }
      } else if (rule.type === "boolean") {
        const boolValue = Array.isArray(value) ? value[0] : value;
        if (!["true", "false", "1", "0"].includes(String(boolValue).toLowerCase())) {
          errors.push(`Parameter '${key}' must be a boolean`);
        }
      }

      if (rule.validator) {
        const val = Array.isArray(value) ? value[0] : value;
        if (!rule.validator(val)) {
          errors.push(`Parameter '${key}' failed validation`);
        }
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Parses nested query parameters (e.g., user[name]=John)
 * @param queryString - Query string
 * @returns Nested object
 * @example
 * const nested = parseNestedQuery('user[name]=John&user[age]=30')
 */
export function parseNestedQuery(queryString: string): Record<string, any> {
  const params = parseQuery(queryString);
  const result: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    const keys = key.split(/[\[\]]/).filter(Boolean);
    let current: any = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== "object") {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
  });

  return result;
}

/**
 * Stringifies a nested object to query string
 * @param obj - Nested object
 * @param prefix - Optional prefix for keys
 * @returns Query string
 * @example
 * const query = stringifyNestedQuery({ user: { name: 'John', age: 30 } })
 */
export function stringifyNestedQuery(
  obj: Record<string, any>,
  prefix: string = ""
): string {
  const parts: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (value === null || value === undefined) {
      return;
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        parts.push(`${fullKey}[${index}]=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof value === "object") {
      parts.push(stringifyNestedQuery(value, fullKey));
    } else {
      parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts.join("&");
}

/**
 * Formats query string with proper encoding
 * @param params - Query parameters
 * @returns Formatted query string
 * @example
 * const formatted = formatQueryString({ name: 'John Doe', age: 30 })
 */
export function formatQueryString(params: QueryParams): string {
  return stringifyQuery(params);
}

/**
 * Checks if a query string has a parameter
 * @param queryString - Query string
 * @param key - Parameter key
 * @returns True if parameter exists
 * @example
 * const hasAge = hasQueryParam('name=John&age=30', 'age')
 */
export function hasQueryParam(queryString: string, key: string): boolean {
  const params = parseQuery(queryString);
  return key in params && params[key] !== undefined;
}

/**
 * Gets all query parameter keys
 * @param queryString - Query string
 * @returns Array of keys
 * @example
 * const keys = getQueryKeys('name=John&age=30')
 */
export function getQueryKeys(queryString: string): string[] {
  const params = parseQuery(queryString);
  return Object.keys(params);
}

/**
 * Converts query string to URLSearchParams-like object
 * @param queryString - Query string
 * @returns Map-like object
 * @example
 * const params = toSearchParams('name=John&age=30')
 */
export function toSearchParams(queryString: string): Map<string, string> {
  const params = parseQuery(queryString);
  const map = new Map<string, string>();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => map.set(key, v));
    } else if (value !== undefined) {
      map.set(key, value);
    }
  });

  return map;
}

