/**
 * General Utilities
 * Main entry point for all utility modules
 */

// Process utilities
export * from "./process-utils";

// Child process utilities
export * from "./child-process-utils";

// Cluster utilities
export * from "./cluster-utils";

// Process communication utilities
export * from "./process-communication-utils";

// Events utilities (exclude waitFor - use test-utils version)
export {
  createEventEmitter,
  once,
  subscribe,
  createDebouncedListener,
  createThrottledListener,
  filter,
  map,
  batch,
  broadcast,
  removeAllListeners,
  getListenerCount,
  withMiddleware,
  createNamespacedEmitter,
} from "./events-utils";

// Buffer utilities
export * from "./buffer-utils";

// Promise utilities
export * from "./promise-utils";

// File system utilities
export * from "./fs-utils";

// Path utilities
export * from "./path-utils";

// Date utilities
export * from "./date";

// HTTP utilities
export * from "./http-utils";

// Query string utilities (exclude getQueryParam - use lambda-utils version)
export {
  parseQuery,
  stringifyQuery,
  escapeQuery,
  unescapeQuery,
  setQueryParam,
  removeQueryParam,
  mergeQueryStrings,
  filterQueryParams,
  validateQueryParams,
  parseNestedQuery,
  stringifyNestedQuery,
  formatQueryString,
  hasQueryParam,
  getQueryKeys,
  toSearchParams,
} from "./querystring-utils";

// Logger
export * from "./logger";

// Crypto utilities
export * from "./crypto-utils";

// Validation utilities
export * from "./validation-utils";

// Worker utilities
export * from "./worker-utils";

// Worker threads utilities (exclude duplicates from worker-utils and process-communication-utils)
export {
  isMain,
  getThreadId,
  createWorker as createWorkerThread,
  executeInWorker as executeInWorkerThread,
  sendToParent,
  onParentMessage,
  getWorkerData,
  createWorkerPool,
  transferToWorker,
  createMessageChannel as createWorkerMessageChannel,
  waitForParentMessage,
  terminateWorker as terminateWorkerThread,
  getWorkerResourceUsage,
} from "./worker-threads-utils";

// Cache utilities
export * from "./cache-utils";

// Config utilities
export * from "./config-utils";

// Test utilities
export * from "./test-utils";

// Error utilities
export * from "./error-utils";

// Environment utilities (exclude duplicates from process-utils)
export {
  getRequiredEnv,
  getEnvNumber,
  getEnvArray,
  getEnvWithPrefix,
  hasEnv,
  getEnvironment,
  isProduction as isProductionEnv,
  isDevelopment as isDevelopmentEnv,
  isTest as isTestEnv,
  loadEnv,
} from "./env-utils";

// Math utilities
export * from "./math-utils";

// Array utilities
export * from "./array";

// Object utilities
export * from "./object";

// String utilities
export * from "./string";

// Network utilities (exclude isValidUrl - use validation-utils version)
export {
  isPortAvailable,
  getLocalIP,
  isValidIP,
  findAvailablePort,
  isValidUrlFormat,
  parseUrl,
  resolveDNS,
  resolveIPv4,
  resolveIPv6,
  reverseDNS,
  getNetworkInterfaces,
  getNetworkInterfaceByName,
  measureLatency,
  measureLatencyStats,
  measureDownloadBandwidth,
  measureUploadBandwidth,
  formatBandwidth,
  createWebSocket,
  sendWebSocketMessage,
  type NetworkInterface,
  type WebSocketOptions,
} from "./network-utils";

// Stream utilities
export * from "./stream-utils";

// Compression utilities
export * from "./compression-utils";

// Schedule utilities (exclude duplicates from promise-utils)
export { schedule, scheduleInterval, cancelSchedule } from "./schedule-utils";

// Timers utilities (exclude duplicates from promise-utils and schedule-utils)
export {
  setTimeout as setTimeoutWithOptions,
  setInterval as setIntervalWithOptions,
  setImmediate as setImmediateWithOptions,
  clearTimeout,
  clearInterval,
  clearImmediate,
  delay as delayWithValue,
  debounce as debounceTimer,
  throttle as throttleTimer,
  withTimeout as withTimeoutTimer,
  retryWithBackoff,
  createTimerPool,
  createCountdown,
  createRateLimiter,
  scheduleAt,
} from "./timers";

// Performance hooks utilities (exclude getMemoryUsage - use process-utils version)
export {
  mark,
  measureBetween,
  measureFunction,
  measureFunctionSync,
  getPerformanceEntries,
  getEntriesByName,
  clearMarks,
  clearMeasures,
  clearAll,
  createObserver,
  now,
  createTimer,
  collectMetrics,
  formatDuration,
  generateReport,
} from "./perf-hooks-utils";

// Auth utilities (exclude hashPassword - use crypto-utils version)
export {
  generateSalt,
  verifyPassword,
  createToken,
  verifyToken,
} from "./auth-utils";

// Queue utilities (exclude createQueue - use process-communication-utils version)
export { Queue, PriorityQueue, createPriorityQueue } from "./queue-utils";

// Database utilities
export * from "./db-utils";

// AI utilities (exclude dotProduct, normalizeVector, vectorMagnitude - use math-utils versions)
export {
  cosineSimilarity,
  euclideanDistance,
  manhattanDistance,
  addVectors,
  subtractVectors,
  scaleVector,
} from "./ai-utils";

// Browser utilities
export * from "./browser-utils";

// Zod utilities
export * from "./zod-utils";

// Lambda utilities
export * from "./lambda-utils";

// Powertools utilities
export * from "./powertools-utils";

// CLI utilities
export * from "./cli-utils";

// TypeScript utilities (exclude duplicates from validation-utils and object-utils)
export {
  isNotNull,
  isNull,
  isBoolean,
  isFunction,
  isPromise,
  isDate,
  isError,
  isPlainObject,
  assertNotNull,
  assertType,
  getOrDefault,
  getOrThrow,
  getKeys,
  getEntries,
  getValues,
  makeReadonly,
  arrayToRecord,
  arrayToMap,
  makePartial,
  makeRequired,
  hasKey,
  getProperty,
  isDiscriminated,
  tuple,
  identity,
  createNoop,
  unsafeCast,
  brand,
  remapKeys,
} from "./ts";

// React utilities
export * from "./react";
