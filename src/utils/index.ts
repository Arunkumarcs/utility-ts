/**
 * General Utilities
 * Main entry point for all utility modules
 */

// Process utilities
export * from "./process-utils";

// Child process utilities
export * from "./child-process-utils";

// Process communication utilities
export * from "./process-communication-utils";

// Buffer utilities
export * from "./buffer-utils";

// Promise utilities
export * from "./promise-utils";

// File system utilities
export * from "./fs-utils";

// Path utilities
export * from "./path-utils";

// Date utilities
export * from "./date-utils";

// HTTP utilities
export * from "./http-utils";

// Logger
export * from "./logger";

// Crypto utilities
export * from "./crypto-utils";

// Validation utilities
export * from "./validation-utils";

// Worker utilities
export * from "./worker-utils";

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
export * from "./array-utils";

// Object utilities
export * from "./object-utils";

// String utilities
export * from "./string-utils";

// Network utilities (exclude isValidUrl - use validation-utils version)
export {
  isPortAvailable,
  getLocalIP,
  isValidIP,
  findAvailablePort,
  isValidUrlFormat,
  parseUrl,
} from "./network-utils";

// Stream utilities
export * from "./stream-utils";

// Compression utilities
export * from "./compression-utils";

// Schedule utilities (exclude duplicates from promise-utils)
export { schedule, scheduleInterval, cancelSchedule } from "./schedule-utils";

// Auth utilities
export * from "./auth-utils";

// Queue utilities (exclude createQueue - use process-communication-utils version)
export { Queue, PriorityQueue, createPriorityQueue } from "./queue-utils";

// Database utilities
export * from "./db-utils";

// AI utilities
export * from "./ai-utils";

// Browser utilities
export * from "./browser-utils";

// Zod utilities
export * from "./zod-utils";

// Lambda utilities
export * from "./lambda-utils";

// Powertools utilities
export * from "./powertools-utils";
