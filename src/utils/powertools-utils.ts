/**
 * AWS Powertools Utilities
 * Utility functions that provide Powertools-like functionality
 * Note: These are lightweight alternatives. For full features, use @aws-lambda-powertools packages
 */

import { Context } from "aws-lambda";

/**
 * Logger configuration (Powertools-style)
 */
export interface PowertoolsLoggerConfig {
  serviceName?: string;
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR";
  persistentLogAttributes?: Record<string, any>;
}

/**
 * Logger class (Powertools-style)
 */
export class PowertoolsLogger {
  private serviceName: string;
  private logLevel: string;
  private persistentAttributes: Record<string, any>;

  constructor(config: PowertoolsLoggerConfig = {}) {
    this.serviceName = config.serviceName || "lambda";
    this.logLevel = config.logLevel || "INFO";
    this.persistentAttributes = config.persistentLogAttributes || {};
  }

  private shouldLog(level: string): boolean {
    const levels = ["DEBUG", "INFO", "WARN", "ERROR"];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatLog(
    level: string,
    message: string,
    extra?: Record<string, any>
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = {
      level,
      message,
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      ...this.persistentAttributes,
      ...extra,
    };

    const logMethod =
      level === "ERROR"
        ? console.error
        : level === "WARN"
        ? console.warn
        : level === "DEBUG"
        ? console.debug
        : console.info;

    logMethod(JSON.stringify(logEntry));
  }

  debug(message: string, extra?: Record<string, any>): void {
    this.formatLog("DEBUG", message, extra);
  }

  info(message: string, extra?: Record<string, any>): void {
    this.formatLog("INFO", message, extra);
  }

  warn(message: string, extra?: Record<string, any>): void {
    this.formatLog("WARN", message, extra);
  }

  error(
    message: string,
    error?: Error | any,
    extra?: Record<string, any>
  ): void {
    const errorData: Record<string, any> = {
      ...extra,
    };

    if (error) {
      if (error instanceof Error) {
        errorData.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else {
        errorData.error = error;
      }
    }

    this.formatLog("ERROR", message, errorData);
  }

  addPersistentAttributes(attributes: Record<string, any>): void {
    this.persistentAttributes = {
      ...this.persistentAttributes,
      ...attributes,
    };
  }
}

/**
 * Creates a Powertools-style logger
 * @param config - Logger configuration
 * @returns Logger instance
 * @example
 * const logger = createPowertoolsLogger({ serviceName: 'my-service' })
 * logger.info('Processing request', { userId: '123' })
 */
export function createPowertoolsLogger(
  config: PowertoolsLoggerConfig = {}
): PowertoolsLogger {
  return new PowertoolsLogger(config);
}

/**
 * Tracer utilities (Powertools-style)
 */
export class PowertoolsTracer {
  private serviceName: string;
  private traces: Map<
    string,
    { start: number; metadata?: Record<string, any> }
  >;

  constructor(serviceName: string = "lambda") {
    this.serviceName = serviceName;
    this.traces = new Map();
  }

  /**
   * Starts a trace segment
   * @param name - Segment name
   * @param metadata - Additional metadata
   * @returns Segment ID
   */
  startSegment(name: string, metadata?: Record<string, any>): string {
    const segmentId = `${name}-${Date.now()}-${Math.random()}`;
    this.traces.set(segmentId, {
      start: Date.now(),
      metadata,
    });
    return segmentId;
  }

  /**
   * Ends a trace segment
   * @param segmentId - Segment ID
   * @returns Duration in milliseconds
   */
  endSegment(segmentId: string): number {
    const trace = this.traces.get(segmentId);
    if (!trace) {
      return 0;
    }

    const duration = Date.now() - trace.start;
    this.traces.delete(segmentId);

    console.log(
      JSON.stringify({
        type: "trace",
        service: this.serviceName,
        segment: segmentId.split("-")[0],
        duration,
        metadata: trace.metadata,
      })
    );

    return duration;
  }

  /**
   * Wraps a function with tracing
   * @param name - Segment name
   * @param fn - Function to trace
   * @returns Wrapped function
   */
  async trace<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    const segmentId = this.startSegment(name);
    try {
      const result = await fn();
      this.endSegment(segmentId);
      return result;
    } catch (error) {
      this.endSegment(segmentId);
      throw error;
    }
  }
}

/**
 * Creates a Powertools-style tracer
 * @param serviceName - Service name
 * @returns Tracer instance
 * @example
 * const tracer = createPowertoolsTracer('my-service')
 * await tracer.trace('process-data', async () => {
 *   // Your code here
 * })
 */
export function createPowertoolsTracer(
  serviceName: string = "lambda"
): PowertoolsTracer {
  return new PowertoolsTracer(serviceName);
}

/**
 * Metrics utilities (Powertools-style)
 */
export class PowertoolsMetrics {
  private serviceName: string;
  private namespace: string;
  private metrics: Map<string, number>;

  constructor(serviceName: string = "lambda", namespace: string = "MyApp") {
    this.serviceName = serviceName;
    this.namespace = namespace;
    this.metrics = new Map();
  }

  /**
   * Adds a metric
   * @param name - Metric name
   * @param value - Metric value
   * @param unit - Metric unit (default: 'Count')
   */
  addMetric(name: string, value: number, unit: string = "Count"): void {
    const key = `${name}-${unit}`;
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + value);

    console.log(
      JSON.stringify({
        type: "metric",
        namespace: this.namespace,
        service: this.serviceName,
        metric: name,
        value,
        unit,
      })
    );
  }

  /**
   * Increments a counter
   * @param name - Counter name
   * @param value - Increment value (default: 1)
   */
  increment(name: string, value: number = 1): void {
    this.addMetric(name, value, "Count");
  }

  /**
   * Records a duration
   * @param name - Metric name
   * @param durationMs - Duration in milliseconds
   */
  recordDuration(name: string, durationMs: number): void {
    this.addMetric(name, durationMs, "Milliseconds");
  }

  /**
   * Records a value
   * @param name - Metric name
   * @param value - Value to record
   */
  recordValue(name: string, value: number): void {
    this.addMetric(name, value, "None");
  }

  /**
   * Publishes all metrics
   */
  publishMetrics(): void {
    // In real Powertools, this would send to CloudWatch
    // Here we just log the summary
    const summary: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      summary[key] = value;
    });

    console.log(
      JSON.stringify({
        type: "metrics-summary",
        namespace: this.namespace,
        service: this.serviceName,
        metrics: summary,
      })
    );

    this.metrics.clear();
  }
}

/**
 * Creates a Powertools-style metrics instance
 * @param serviceName - Service name
 * @param namespace - CloudWatch namespace
 * @returns Metrics instance
 * @example
 * const metrics = createPowertoolsMetrics('my-service', 'MyApp')
 * metrics.increment('requests')
 * metrics.recordDuration('processing-time', 150)
 * metrics.publishMetrics()
 */
export function createPowertoolsMetrics(
  serviceName: string = "lambda",
  namespace: string = "MyApp"
): PowertoolsMetrics {
  return new PowertoolsMetrics(serviceName, namespace);
}

/**
 * Middleware to add Powertools context to Lambda handler
 * @param serviceName - Service name
 * @returns Middleware function
 * @example
 * export const handler = addPowertoolsContext('my-service')(async (event, context) => {
 *   // Handler code with Powertools available
 * })
 */
export function addPowertoolsContext(serviceName: string = "lambda") {
  return <T extends (...args: any[]) => any>(handler: T): T => {
    return (async (event: any, context: Context) => {
      // Add Powertools instances to context
      (context as any).logger = createPowertoolsLogger({ serviceName });
      (context as any).tracer = createPowertoolsTracer(serviceName);
      (context as any).metrics = createPowertoolsMetrics(serviceName);

      try {
        return await handler(event, context);
      } finally {
        // Publish metrics on completion
        if ((context as any).metrics) {
          (context as any).metrics.publishMetrics();
        }
      }
    }) as any as T;
  };
}
