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
  retry?: RetryOptions;
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
  };
  cookies?: boolean | CookieJar;
  formData?: boolean;
  multipart?: boolean;
  logging?: boolean | LogOptions;
  http2?: boolean;
}

/**
 * Retry options
 */
export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryOn?: (response: HttpResponse) => boolean;
  exponentialBackoff?: boolean;
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (
  config: HttpRequestOptions
) => HttpRequestOptions | Promise<HttpRequestOptions>;

/**
 * Response interceptor function
 */
export type ResponseInterceptor = <T>(
  response: HttpResponse<T>
) => HttpResponse<T> | Promise<HttpResponse<T>>;

/**
 * Cookie jar for managing cookies
 */
export class CookieJar {
  private cookies: Map<string, Cookie> = new Map();

  /**
   * Sets a cookie
   */
  setCookie(
    name: string,
    value: string,
    domain?: string,
    path?: string,
    expires?: Date,
    secure?: boolean,
    httpOnly?: boolean,
    maxAge?: number,
    sameSite?: "Strict" | "Lax" | "None"
  ): void {
    const cookie: Cookie = {
      name,
      value,
      domain,
      path: path || "/",
      expires,
      secure: secure || false,
      httpOnly: httpOnly || false,
    };

    if (maxAge !== undefined) {
      cookie.maxAge = maxAge;
      if (maxAge > 0 && !expires) {
        cookie.expires = new Date(Date.now() + maxAge * 1000);
      }
    }

    if (sameSite) {
      cookie.sameSite = sameSite;
    }

    this.cookies.set(name, cookie);
  }

  /**
   * Gets a cookie value
   */
  getCookie(name: string): string | undefined {
    const cookie = this.cookies.get(name);
    if (!cookie) return undefined;

    const now = new Date();

    // Check expiration
    if (cookie.expires && cookie.expires < now) {
      this.cookies.delete(name);
      return undefined;
    }

    // Note: max-age is typically handled when parsing Set-Cookie header
    // and converted to expires. If we need to track creation time for
    // max-age, we'd need to add a createdAt field, but for simplicity,
    // we rely on expires which is set from max-age during parsing.

    return cookie.value;
  }

  /**
   * Gets all cookies as a string for Cookie header
   */
  getCookieString(domain?: string, path?: string): string {
    const now = new Date();
    const validCookies: string[] = [];

    for (const cookie of this.cookies.values()) {
      // Check expiration
      if (cookie.expires && cookie.expires < now) {
        this.cookies.delete(cookie.name);
        continue;
      }

      // Check domain and path
      if (domain && cookie.domain) {
        // Domain matching: request domain must match cookie domain or be a subdomain
        // e.g., cookie.domain="example.com" matches "example.com" and "sub.example.com"
        // but not "evil-example.com"
        const cookieDomain = cookie.domain.toLowerCase();
        const requestDomain = domain.toLowerCase();
        if (
          requestDomain !== cookieDomain &&
          !requestDomain.endsWith("." + cookieDomain)
        ) {
          continue;
        }
      }
      if (path && cookie.path && !path.startsWith(cookie.path)) {
        continue;
      }

      validCookies.push(`${cookie.name}=${cookie.value}`);
    }

    return validCookies.join("; ");
  }

  /**
   * Parses Set-Cookie header and adds to jar
   */
  parseSetCookie(
    setCookieHeader: string,
    domain?: string,
    path?: string
  ): void {
    const parts = setCookieHeader.split(";").map((p) => p.trim());
    const [nameValue] = parts;
    if (!nameValue) return;

    const [name, value] = nameValue.split("=");
    if (!name) return;

    const cookie: Cookie = {
      name,
      value: value || "",
      domain,
      path: path || "/",
      secure: false,
      httpOnly: false,
    };

    for (const part of parts.slice(1)) {
      const lowerPart = part.toLowerCase();
      if (lowerPart === "secure") {
        cookie.secure = true;
      } else if (lowerPart === "httponly") {
        cookie.httpOnly = true;
      } else if (lowerPart.startsWith("domain=")) {
        cookie.domain = part.split("=")[1]?.trim();
      } else if (lowerPart.startsWith("path=")) {
        cookie.path = part.split("=")[1]?.trim();
      } else if (lowerPart.startsWith("expires=")) {
        const dateStr = part.split("=")[1]?.trim();
        if (dateStr) {
          cookie.expires = new Date(dateStr);
        }
      } else if (lowerPart.startsWith("max-age=")) {
        const maxAgeStr = part.split("=")[1]?.trim();
        if (maxAgeStr) {
          const maxAge = parseInt(maxAgeStr, 10);
          if (!isNaN(maxAge)) {
            cookie.maxAge = maxAge;
            // Calculate expires from max-age if expires not already set
            if (!cookie.expires && maxAge > 0) {
              cookie.expires = new Date(Date.now() + maxAge * 1000);
            }
          }
        }
      } else if (lowerPart.startsWith("samesite=")) {
        const sameSiteValue = part.split("=")[1]?.trim();
        if (
          sameSiteValue &&
          ["Strict", "Lax", "None"].includes(sameSiteValue)
        ) {
          cookie.sameSite = sameSiteValue as "Strict" | "Lax" | "None";
        }
      }
    }

    this.cookies.set(name, cookie);
  }

  /**
   * Clears all cookies
   */
  clear(): void {
    this.cookies.clear();
  }
}

/**
 * Cookie structure
 */
interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure: boolean;
  httpOnly: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Log options
 */
export interface LogOptions {
  request?: boolean;
  response?: boolean;
  headers?: boolean;
  body?: boolean;
  logger?: (message: string) => void;
}

/**
 * HTTP response
 */
export interface HttpResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  request?: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}

/**
 * Makes an HTTP request with advanced features
 * @param url - Request URL
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpRequest('https://api.example.com/data', {
 *   method: 'GET',
 *   headers: { 'Authorization': 'Bearer token' },
 *   retry: { maxRetries: 3 }
 * })
 */
export async function httpRequest<T = any>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<HttpResponse<T>> {
  // Basic URL validation
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  let {
    method = "GET",
    headers = {},
    body,
    query,
    retry,
    interceptors,
    cookies,
    formData,
    multipart,
    logging,
    http2,
  } = options;

  // Initialize cookie jar if needed
  const cookieJar =
    cookies === true
      ? new CookieJar()
      : cookies instanceof CookieJar
      ? cookies
      : undefined;

  // Apply request interceptors
  if (interceptors?.request) {
    for (const interceptor of interceptors.request) {
      const result = await interceptor(options);
      options = { ...options, ...result };
      method = options.method || method;
      headers = { ...headers, ...options.headers };
      body = options.body ?? body;
    }
  }

  // Add cookies to headers
  if (cookieJar) {
    const cookieString = cookieJar.getCookieString();
    if (cookieString) {
      headers["Cookie"] = cookieString;
    }
  }

  // Add query parameters
  let fullUrl = url;
  if (query) {
    const queryString = createQueryString(query);
    fullUrl += `${fullUrl.includes("?") ? "&" : "?"}${queryString}`;
  }

  // Prepare body
  let requestBody: string | FormData | undefined;
  let contentType = "application/json";

  if (body) {
    if (multipart && typeof body === "object" && !(body instanceof FormData)) {
      const form = new FormData();
      for (const [key, value] of Object.entries(body)) {
        if (value instanceof File || value instanceof Blob) {
          form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      }
      requestBody = form;
      // Don't set Content-Type for FormData, browser will set it with boundary
      contentType = "";
    } else if (
      formData &&
      typeof body === "object" &&
      !(body instanceof FormData)
    ) {
      const form = new URLSearchParams();
      for (const [key, value] of Object.entries(body)) {
        form.append(key, String(value));
      }
      requestBody = form.toString();
      contentType = "application/x-www-form-urlencoded";
    } else if (typeof body === "string") {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
  }

  // Prepare request options
  const requestHeaders: Record<string, string> = { ...headers };
  // Only set Content-Type if not already provided by user and not multipart
  if (contentType && !multipart && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = contentType;
  }

  // Logging
  const logOptions =
    logging === true
      ? { request: true, response: true, headers: false, body: false }
      : typeof logging === "object"
      ? logging
      : undefined;

  const logger = logOptions?.logger || console.log;

  if (logOptions?.request) {
    logger(`[HTTP Request] ${method} ${fullUrl}`);
    if (logOptions.headers) {
      logger(`[HTTP Headers] ${JSON.stringify(requestHeaders, null, 2)}`);
    }
    if (logOptions.body && requestBody) {
      logger(
        `[HTTP Body] ${
          typeof requestBody === "string" ? requestBody : "[FormData]"
        }`
      );
    }
  }

  // Retry logic
  const retryOptions = retry || {};
  const maxRetries = retryOptions.maxRetries || 0;
  const retryDelay = retryOptions.retryDelay || 1000;
  const shouldRetry = retryOptions.retryOn || ((res) => res.status >= 500);
  const exponentialBackoff = retryOptions.exponentialBackoff !== false;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Make request with timeout
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;
      if (options.timeout) {
        timeoutId = setTimeout(() => controller.abort(), options.timeout);
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal: controller.signal,
      };

      // HTTP/2 support (Note: fetch API doesn't support HTTP/2 directly in browsers,
      // but Node.js 18+ fetch uses HTTP/2 automatically when available)
      // For explicit HTTP/2, you'd need to use http2 module in Node.js
      if (http2 && typeof process !== "undefined" && process.versions?.node) {
        // In Node.js, fetch may use HTTP/2 automatically
        // This is a placeholder for HTTP/2 specific options
        // In practice, HTTP/2 is handled by the underlying implementation
      }

      const response = await fetch(fullUrl, requestOptions);
      if (timeoutId) clearTimeout(timeoutId);

      // Parse response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Handle cookies from response
      if (cookieJar) {
        try {
          const urlObj = new URL(fullUrl);
          const defaultDomain = urlObj.hostname;
          const defaultPath = urlObj.pathname || "/";

          const setCookieHeaders = response.headers.getSetCookie?.() || [];
          if (setCookieHeaders.length === 0) {
            // Fallback: check Set-Cookie header
            const setCookie =
              responseHeaders["set-cookie"] || responseHeaders["Set-Cookie"];
            if (setCookie) {
              cookieJar.parseSetCookie(setCookie, defaultDomain, defaultPath);
            }
          } else {
            for (const cookieHeader of setCookieHeaders) {
              cookieJar.parseSetCookie(cookieHeader, defaultDomain, defaultPath);
            }
          }
        } catch {
          // If URL parsing fails, try without domain/path
          const setCookie =
            responseHeaders["set-cookie"] || responseHeaders["Set-Cookie"];
          if (setCookie) {
            cookieJar.parseSetCookie(setCookie);
          }
        }
      }

      // Parse response data
      let data: T;
      const contentTypeHeader = response.headers.get("content-type");
      if (contentTypeHeader?.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      const httpResponse: HttpResponse<T> = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data,
        request: {
          url: fullUrl,
          method,
          headers: requestHeaders,
        },
      };

      // Apply response interceptors
      let finalResponse = httpResponse;
      if (interceptors?.response) {
        for (const interceptor of interceptors.response) {
          finalResponse = await interceptor(finalResponse);
        }
      }

      // Logging
      if (logOptions?.response) {
        logger(
          `[HTTP Response] ${finalResponse.status} ${finalResponse.statusText}`
        );
        if (logOptions.headers) {
          logger(
            `[HTTP Headers] ${JSON.stringify(finalResponse.headers, null, 2)}`
          );
        }
        if (logOptions.body) {
          logger(`[HTTP Body] ${JSON.stringify(finalResponse.data, null, 2)}`);
        }
      }

      // Check if we should retry
      if (attempt < maxRetries && shouldRetry(finalResponse)) {
        const delay = exponentialBackoff
          ? retryDelay * Math.pow(2, attempt)
          : retryDelay;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return finalResponse;
    } catch (error: any) {
      lastError = error;

      // Don't retry on abort errors (timeout)
      if (error.name === "AbortError") {
        throw error;
      }

      // Retry on network errors
      if (attempt < maxRetries) {
        const delay = exponentialBackoff
          ? retryDelay * Math.pow(2, attempt)
          : retryDelay;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error("Request failed");
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

// ============================================================================
// Form Data Encoding
// ============================================================================

/**
 * Encodes an object as form data (application/x-www-form-urlencoded)
 * @param data - Data object to encode
 * @returns Encoded form data string
 * @example
 * const formData = encodeFormData({ name: 'John', age: 30 })
 */
export function encodeFormData(
  data: Record<string, string | number | boolean>
): string {
  return new URLSearchParams(
    Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();
}

/**
 * Decodes form data string to object
 * @param formData - Form data string
 * @returns Decoded object
 * @example
 * const data = decodeFormData('name=John&age=30')
 */
export function decodeFormData(formData: string): Record<string, string> {
  return parseQueryString(formData);
}

// ============================================================================
// Multipart Upload
// ============================================================================

/**
 * Multipart form data field
 */
export interface MultipartField {
  name: string;
  value: string | Blob | File;
  filename?: string;
  contentType?: string;
}

/**
 * Creates multipart form data from fields
 * @param fields - Array of multipart fields
 * @returns FormData object
 * @example
 * const formData = createMultipartFormData([
 *   { name: 'text', value: 'Hello' },
 *   { name: 'file', value: fileBlob, filename: 'document.pdf', contentType: 'application/pdf' }
 * ])
 */
export function createMultipartFormData(fields: MultipartField[]): FormData {
  const formData = new FormData();

  for (const field of fields) {
    const isBlob = field.value instanceof Blob;
    const isFile = typeof File !== "undefined" && field.value instanceof File;

    if (isBlob || isFile) {
      const blob = field.value as Blob;
      if (field.filename) {
        formData.append(field.name, blob, field.filename);
      } else {
        formData.append(field.name, blob);
      }
    } else {
      formData.append(field.name, String(field.value));
    }
  }

  return formData;
}

/**
 * Makes a POST request with form data
 * @param url - Request URL
 * @param formData - Form data object
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpPostForm('https://api.example.com/submit', { name: 'John', email: 'john@example.com' })
 */
export async function httpPostForm<T = any>(
  url: string,
  formData: Record<string, string | number | boolean>,
  options?: Omit<HttpRequestOptions, "method" | "body" | "formData">
): Promise<HttpResponse<T>> {
  return httpRequest<T>(url, {
    ...options,
    method: "POST",
    body: formData,
    formData: true,
  });
}

/**
 * Makes a POST request with multipart form data
 * @param url - Request URL
 * @param fields - Multipart fields
 * @param options - Request options
 * @returns Promise with response
 * @example
 * const response = await httpPostMultipart('https://api.example.com/upload', [
 *   { name: 'file', value: fileBlob, filename: 'document.pdf' }
 * ])
 */
export async function httpPostMultipart<T = any>(
  url: string,
  fields: MultipartField[],
  options?: Omit<HttpRequestOptions, "method" | "body" | "multipart">
): Promise<HttpResponse<T>> {
  const formData = createMultipartFormData(fields);
  return httpRequest<T>(url, {
    ...options,
    method: "POST",
    body: formData,
    multipart: true,
  });
}

// ============================================================================
// HTTP Client with Interceptors
// ============================================================================

/**
 * HTTP client class with interceptors and cookie management
 */
export class HttpClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private cookieJar: CookieJar;
  private defaultOptions: Partial<HttpRequestOptions> = {};

  constructor(options?: {
    cookies?: boolean;
    defaultOptions?: Partial<HttpRequestOptions>;
  }) {
    this.cookieJar =
      options?.cookies !== false ? new CookieJar() : new CookieJar();
    this.defaultOptions = options?.defaultOptions || {};
  }

  /**
   * Adds a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Adds a response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Removes a request interceptor
   */
  removeRequestInterceptor(interceptor: RequestInterceptor): void {
    const index = this.requestInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.requestInterceptors.splice(index, 1);
    }
  }

  /**
   * Removes a response interceptor
   */
  removeResponseInterceptor(interceptor: ResponseInterceptor): void {
    const index = this.responseInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.responseInterceptors.splice(index, 1);
    }
  }

  /**
   * Gets the cookie jar
   */
  getCookieJar(): CookieJar {
    return this.cookieJar;
  }

  /**
   * Makes an HTTP request using this client
   */
  async request<T = any>(
    url: string,
    options: HttpRequestOptions = {}
  ): Promise<HttpResponse<T>> {
    return httpRequest<T>(url, {
      ...this.defaultOptions,
      ...options,
      interceptors: {
        request: [
          ...this.requestInterceptors,
          ...(options.interceptors?.request || []),
        ],
        response: [
          ...(options.interceptors?.response || []),
          ...this.responseInterceptors,
        ],
      },
      cookies: this.cookieJar,
    });
  }

  /**
   * Makes a GET request
   */
  async get<T = any>(
    url: string,
    options?: Omit<HttpRequestOptions, "method" | "body">
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  /**
   * Makes a POST request
   */
  async post<T = any>(
    url: string,
    body?: any,
    options?: Omit<HttpRequestOptions, "method" | "body">
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: "POST", body });
  }

  /**
   * Makes a PUT request
   */
  async put<T = any>(
    url: string,
    body?: any,
    options?: Omit<HttpRequestOptions, "method" | "body">
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: "PUT", body });
  }

  /**
   * Makes a DELETE request
   */
  async delete<T = any>(
    url: string,
    options?: Omit<HttpRequestOptions, "method" | "body">
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}
