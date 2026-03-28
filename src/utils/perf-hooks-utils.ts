/**
 * Performance Hooks Utilities
 * Utilities for Node.js perf_hooks module
 */

import {
  performance,
  PerformanceObserver,
  PerformanceEntry,
  PerformanceMark,
  PerformanceMeasure,
} from "perf_hooks";

export interface PerformanceMetrics {
  marks: PerformanceMark[];
  measures: PerformanceMeasure[];
  duration: number;
}

/**
 * Creates a performance mark
 * @param name - Mark name
 * @example
 * mark('start')
 */
export function mark(name: string): void {
  performance.mark(name);
}

/**
 * Creates a performance measure between two marks
 * @param name - Measure name
 * @param startMark - Start mark name
 * @param endMark - End mark name
 * @returns Performance measure
 * @example
 * const measure = measureBetween('total', 'start', 'end')
 */
export function measureBetween(
  name: string,
  startMark: string,
  endMark?: string
): PerformanceMeasure {
  performance.measure(name, startMark, endMark);
  return performance.getEntriesByName(name, "measure")[0] as PerformanceMeasure;
}

/**
 * Measures the execution time of a function
 * @param fn - Function to measure
 * @param name - Optional measure name
 * @returns Result and duration
 * @example
 * const { result, duration } = await measureFunction(async () => await fetchData())
 */
export async function measureFunction<T>(
  fn: () => T | Promise<T>,
  name: string = "function"
): Promise<{ result: T; duration: number }> {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  mark(startMark);
  const result = await fn();
  mark(endMark);

  const measure = measureBetween(name, startMark, endMark);
  return { result, duration: measure.duration };
}

/**
 * Measures the execution time of a synchronous function
 * @param fn - Function to measure
 * @param name - Optional measure name
 * @returns Result and duration
 * @example
 * const { result, duration } = measureFunctionSync(() => computeHeavy())
 */
export function measureFunctionSync<T>(
  fn: () => T,
  name: string = "function"
): { result: T; duration: number } {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  mark(startMark);
  const result = fn();
  mark(endMark);

  const measure = measureBetween(name, startMark, endMark);
  return { result, duration: measure.duration };
}

/**
 * Gets all performance entries
 * @param type - Optional entry type filter
 * @returns Array of performance entries
 * @example
 * const entries = getPerformanceEntries('measure')
 */
export function getPerformanceEntries(
  type?: "mark" | "measure"
): PerformanceEntry[] {
  if (type) {
    return performance.getEntriesByType(type);
  }
  return performance.getEntries();
}

/**
 * Gets performance entries by name
 * @param name - Entry name
 * @param type - Optional entry type filter
 * @returns Array of performance entries
 * @example
 * const entries = getEntriesByName('my-measure', 'measure')
 */
export function getEntriesByName(
  name: string,
  type?: "mark" | "measure"
): PerformanceEntry[] {
  return performance.getEntriesByName(name, type);
}

/**
 * Clears all performance marks
 * @param name - Optional mark name to clear
 * @example
 * clearMarks('start')
 */
export function clearMarks(name?: string): void {
  if (name) {
    performance.clearMarks(name);
  } else {
    performance.clearMarks();
  }
}

/**
 * Clears all performance measures
 * @param name - Optional measure name to clear
 * @example
 * clearMeasures('total')
 */
export function clearMeasures(name?: string): void {
  if (name) {
    performance.clearMeasures(name);
  } else {
    performance.clearMeasures();
  }
}

/**
 * Clears all performance entries
 * @example
 * clearAll()
 */
export function clearAll(): void {
  clearMarks();
  clearMeasures();
}

/**
 * Creates a performance observer
 * @param callback - Callback function for entries
 * @param types - Entry types to observe
 * @returns Performance observer instance
 * @example
 * const observer = createObserver((entries) => console.log(entries), ['measure'])
 */
export function createObserver(
  callback: (entries: PerformanceEntry[]) => void,
  types: ("mark" | "measure")[] = ["measure"]
): PerformanceObserver {
  const observer = new PerformanceObserver((list) => {
    callback(list.getEntries());
  });

  observer.observe({ entryTypes: types });
  return observer;
}

/**
 * Gets high-resolution time in milliseconds
 * @returns High-resolution time
 * @example
 * const time = now()
 */
export function now(): number {
  return performance.now();
}

/**
 * Creates a timer that tracks elapsed time
 * @returns Timer object
 * @example
 * const timer = createTimer()
 * timer.start()
 * // ... do work
 * const elapsed = timer.elapsed()
 */
export function createTimer(): {
  start: () => void;
  stop: () => void;
  elapsed: () => number;
  reset: () => void;
} {
  let startTime: number | null = null;
  let endTime: number | null = null;

  return {
    start: () => {
      startTime = now();
      endTime = null;
    },
    stop: () => {
      if (startTime !== null) {
        endTime = now();
      }
    },
    elapsed: () => {
      if (startTime === null) {
        return 0;
      }
      const end = endTime || now();
      return end - startTime;
    },
    reset: () => {
      startTime = null;
      endTime = null;
    },
  };
}

/**
 * Collects performance metrics for a code block
 * @param fn - Function to measure
 * @param name - Optional measure name
 * @returns Performance metrics
 * @example
 * const metrics = await collectMetrics(async () => await processData())
 */
export async function collectMetrics<T>(
  fn: () => T | Promise<T>,
  name: string = "operation"
): Promise<{ result: T; metrics: PerformanceMetrics }> {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  mark(startMark);
  const result = await fn();
  mark(endMark);

  const measure = measureBetween(name, startMark, endMark);

  const marks = getPerformanceEntries("mark") as PerformanceMark[];
  const measures = getPerformanceEntries("measure") as PerformanceMeasure[];

  return {
    result,
    metrics: {
      marks: marks.filter((m) => m.name === startMark || m.name === endMark),
      measures: [measure],
      duration: measure.duration,
    },
  };
}

/**
 * Gets memory usage statistics
 * @returns Memory usage object
 * @example
 * const memory = getMemoryUsage()
 */
export function getMemoryUsage(): NodeJS.MemoryUsage {
  return process.memoryUsage();
}

/**
 * Formats duration in a human-readable format
 * @param durationMs - Duration in milliseconds
 * @returns Formatted string
 * @example
 * const formatted = formatDuration(1234.56) // '1.23s'
 */
export function formatDuration(durationMs: number): string {
  if (durationMs < 1) {
    return `${(durationMs * 1000).toFixed(2)}μs`;
  } else if (durationMs < 1000) {
    return `${durationMs.toFixed(2)}ms`;
  } else if (durationMs < 60000) {
    return `${(durationMs / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(2);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Creates a performance report from entries
 * @param entries - Performance entries
 * @returns Formatted report string
 * @example
 * const report = generateReport(getPerformanceEntries())
 */
export function generateReport(entries: PerformanceEntry[]): string {
  const lines: string[] = ["Performance Report", "=".repeat(50)];

  const marks = entries.filter(
    (e) => e.entryType === "mark"
  ) as PerformanceMark[];
  const measures = entries.filter(
    (e) => e.entryType === "measure"
  ) as PerformanceMeasure[];

  if (marks.length > 0) {
    lines.push("\nMarks:");
    marks.forEach((mark) => {
      lines.push(`  ${mark.name}: ${formatDuration(mark.startTime)}`);
    });
  }

  if (measures.length > 0) {
    lines.push("\nMeasures:");
    measures.forEach((measure) => {
      lines.push(
        `  ${measure.name}: ${formatDuration(
          measure.duration
        )} (start: ${formatDuration(measure.startTime)}, end: ${formatDuration(
          measure.startTime + measure.duration
        )})`
      );
    });
  }

  const totalDuration = measures.reduce((sum, m) => sum + m.duration, 0);
  if (totalDuration > 0) {
    lines.push(`\nTotal Duration: ${formatDuration(totalDuration)}`);
  }

  return lines.join("\n");
}
