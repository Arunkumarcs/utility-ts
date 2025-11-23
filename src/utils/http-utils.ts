/**
 * HTTP Utilities
 * Utilities for HTTP requests and responses
 */

/**
 * HTTP method types
 */
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

/**
 * HTTP request options
 */
export interface HttpRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  query?: Record<string, string | number | boolean>;
}

/**
 * HTTP response
 */
export interface HttpResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
}

/**
 * Makes an HTTP request
 * @param url - Request URL
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpRequest('https://api.example.com/data', {
 *   method: 'GET',
 *   headers: { 'Authorization': 'Bearer token' }
 * })
 */
export async function httpRequest<T = any>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<HttpResponse<T>> {
  const { method = "GET", headers = {}, body, query } = options;

  // Add query parameters
  let fullUrl = url;
  if (query) {
    const queryString = new URLSearchParams(
      Object.entries(query).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    fullUrl += `?${queryString}`;
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Add body if provided
  if (body && method !== "GET" && method !== "HEAD") {
    if (typeof body === "string") {
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  // Make request with timeout
  const controller = new AbortController();
  if (options.timeout) {
    setTimeout(() => controller.abort(), options.timeout);
  }
  requestOptions.signal = controller.signal;

  const response = await fetch(fullUrl, requestOptions);

  // Parse response headers
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  // Parse response data
  let data: T;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = (await response.text()) as any;
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    data,
  };
}

/**
 * Makes a GET request
 * @param url - Request URL
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpGet('https://api.example.com/data')
 */
export async function httpGet<T = any>(
  url: string,
  options?: Omit<HttpRequestOptions, "method" | "body">
): Promise<HttpResponse<T>> {
  return httpRequest<T>(url, { ...options, method: "GET" });
}

/**
 * Makes a POST request
 * @param url - Request URL
 * @param body - Request body
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpPost('https://api.example.com/data', { key: 'value' })
 */
export async function httpPost<T = any>(
  url: string,
  body?: any,
  options?: Omit<HttpRequestOptions, "method" | "body">
): Promise<HttpResponse<T>> {
  return httpRequest<T>(url, { ...options, method: "POST", body });
}

/**
 * Makes a PUT request
 * @param url - Request URL
 * @param body - Request body
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpPut('https://api.example.com/data/1', { key: 'value' })
 */
export async function httpPut<T = any>(
  url: string,
  body?: any,
  options?: Omit<HttpRequestOptions, "method" | "body">
): Promise<HttpResponse<T>> {
  return httpRequest<T>(url, { ...options, method: "PUT", body });
}

/**
 * Makes a DELETE request
 * @param url - Request URL
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpDelete('https://api.example.com/data/1')
 */
export async function httpDelete<T = any>(
  url: string,
  options?: Omit<HttpRequestOptions, "method" | "body">
): Promise<HttpResponse<T>> {
  return httpRequest<T>(url, { ...options, method: "DELETE" });
}

/**
 * Creates query string from object
 * @param params - Query parameters
 * @returns Query string
 * @example
 * const query = createQueryString({ page: 1, limit: 10 }) // 'page=1&limit=10'
 */
export function createQueryString(
  params: Record<string, string | number | boolean>
): string {
  return new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();
}

/**
 * Parses query string to object
 * @param queryString - Query string
 * @returns Query parameters object
 * @example
 * const params = parseQueryString('page=1&limit=10') // { page: '1', limit: '10' }
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Builds URL with query parameters
 * @param baseUrl - Base URL
 * @param query - Query parameters
 * @returns Full URL with query string
 * @example
 * const url = buildUrl('https://api.example.com/data', { page: 1, limit: 10 })
 */
export function buildUrl(
  baseUrl: string,
  query?: Record<string, string | number | boolean>
): string {
  if (!query || Object.keys(query).length === 0) {
    return baseUrl;
  }
  const queryString = createQueryString(query);
  return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${queryString}`;
}
