/**
 * Logger Utilities
 * Simple logging utility
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colorize?: boolean;
}

/**
 * Log levels with numeric values
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * ANSI color codes
 */
const COLORS = {
  reset: "\x1b[0m",
  debug: "\x1b[36m", // Cyan
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

/**
 * Logger class
 */
export class Logger {
  private level: LogLevel;
  private prefix: string;
  private timestamp: boolean;
  private colorize: boolean;

  constructor(config: LoggerConfig = {}) {
    this.level =
      config.level ||
      (process.env.NODE_ENV === "production" ? "info" : "debug");
    this.prefix = config.prefix || "";
    this.timestamp = config.timestamp !== false;
    this.colorize = config.colorize !== false && process.stdout.isTTY;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: any[]
  ): string {
    const parts: string[] = [];

    if (this.timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    if (this.prefix) {
      parts.push(`[${this.prefix}]`);
    }

    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);

    let formatted = parts.join(" ");

    if (this.colorize) {
      formatted = `${COLORS[level]}${formatted}${COLORS.reset}`;
    }

    return formatted;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, ...args), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, ...args), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, ...args), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, ...args), ...args);
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }
}

/**
 * Creates a logger instance
 * @param config - Logger configuration
 * @returns Logger instance
 * @example
 * const logger = createLogger({ level: 'info', prefix: 'App' })
 * logger.info('Application started')
 */
export function createLogger(config: LoggerConfig = {}): Logger {
  return new Logger(config);
}

/**
 * Default logger instance
 */
export const logger = createLogger();

/**
 * Logs a debug message
 * @param message - Message to log
 * @param args - Additional arguments
 * @example
 * logDebug('Debug information', { key: 'value' })
 */
export function logDebug(message: string, ...args: any[]): void {
  logger.debug(message, ...args);
}

/**
 * Logs an info message
 * @param message - Message to log
 * @param args - Additional arguments
 * @example
 * logInfo('Application started')
 */
export function logInfo(message: string, ...args: any[]): void {
  logger.info(message, ...args);
}

/**
 * Logs a warning message
 * @param message - Message to log
 * @param args - Additional arguments
 * @example
 * logWarn('Deprecated feature used')
 */
export function logWarn(message: string, ...args: any[]): void {
  logger.warn(message, ...args);
}

/**
 * Logs an error message
 * @param message - Message to log
 * @param args - Additional arguments
 * @example
 * logError('Error occurred', error)
 */
export function logError(message: string, ...args: any[]): void {
  logger.error(message, ...args);
}
