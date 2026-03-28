/**
 * Stream Utilities
 * Utilities for working with streams
 */

import { Readable, Writable, Transform, PassThrough } from "stream";

/**
 * Converts a string to a readable stream
 * @param str - String to convert
 * @returns Readable stream
 * @example
 * const stream = stringToStream('Hello World')
 */
export function stringToStream(str: string): Readable {
  return Readable.from([str]);
}

/**
 * Converts a readable stream to a string
 * @param stream - Readable stream
 * @returns Promise with string
 * @example
 * const str = await streamToString(stream)
 */
export async function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * Creates a transform stream that processes data
 * @param transformFn - Transform function
 * @returns Transform stream
 * @example
 * const transform = createTransformStream((chunk) => chunk.toString().toUpperCase())
 */
export function createTransformStream(
  transformFn: (chunk: any) => any
): Transform {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      try {
        const result = transformFn(chunk);
        callback(null, result);
      } catch (error) {
        callback(error as Error);
      }
    },
  });
}

/**
 * Pipes multiple streams together
 * @param streams - Streams to pipe
 * @returns Last stream in chain
 * @example
 * const result = pipeStreams(stream1, stream2, stream3)
 */
export function pipeStreams(
  ...streams: NodeJS.ReadWriteStream[]
): NodeJS.ReadWriteStream {
  let current: NodeJS.ReadWriteStream = streams[0];
  for (let i = 1; i < streams.length; i++) {
    current = current.pipe(streams[i]);
  }
  return current;
}

/**
 * Converts a buffer to a readable stream
 * @param buffer - Buffer to convert
 * @returns Readable stream
 * @example
 * const stream = bufferToStream(buffer)
 */
export function bufferToStream(buffer: Buffer): Readable {
  return Readable.from([buffer]);
}

/**
 * Collects all data from a readable stream into an array
 * @param stream - Readable stream
 * @returns Promise with array of chunks
 * @example
 * const chunks = await collectStream(stream)
 */
export async function collectStream<T = any>(stream: Readable): Promise<T[]> {
  const chunks: T[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as T);
  }
  return chunks;
}

/**
 * Creates a writable stream that collects data
 * @returns Writable stream and promise that resolves with collected data
 * @example
 * const { stream, promise } = createCollectingStream()
 * stream.write('chunk1')
 * stream.end()
 * const data = await promise
 */
export function createCollectingStream<T = any>(): {
  stream: Writable;
  promise: Promise<T[]>;
} {
  const chunks: T[] = [];
  let resolve!: (value: T[]) => void;
  const promise = new Promise<T[]>((res) => {
    resolve = res;
  });

  const stream = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
      chunks.push(chunk as T);
      callback();
    },
    final(callback) {
      resolve(chunks);
      callback();
    },
  });

  return { stream, promise };
}

// ============================================================================
// Stream Merging
// ============================================================================

/**
 * Merges multiple readable streams into a single readable stream
 * @param streams - Array of readable streams to merge
 * @returns Merged readable stream
 * @example
 * const merged = mergeStreams(stream1, stream2, stream3)
 */
export function mergeStreams(...streams: Readable[]): Readable {
  const merged = new Readable({
    objectMode: true,
    read() {
      // Streams will push data as they become available
    },
  });

  let activeStreams = streams.length;
  let ended = false;

  const cleanup = () => {
    if (ended) return;
    ended = true;
    streams.forEach((stream) => {
      if (!stream.destroyed) {
        stream.destroy();
      }
    });
  };

  streams.forEach((stream) => {
    stream.on("data", (chunk) => {
      if (!ended && merged.push(chunk) === false) {
        // Backpressure: pause all streams
        streams.forEach((s) => s.pause());
      }
    });

    stream.on("end", () => {
      activeStreams--;
      if (activeStreams === 0) {
        merged.push(null);
      }
    });

    stream.on("error", (error) => {
      cleanup();
      merged.destroy(error);
    });

    stream.on("drain", () => {
      // Resume all streams when merged stream is ready
      streams.forEach((s) => {
        if (!s.destroyed && s.isPaused()) {
          s.resume();
        }
      });
    });
  });

  merged.on("end", cleanup);
  merged.on("close", cleanup);

  return merged;
}

// ============================================================================
// Stream Splitting
// ============================================================================

/**
 * Splits a readable stream into multiple writable streams
 * @param source - Source readable stream
 * @param destinations - Array of writable streams
 * @returns Promise that resolves when all data is written
 * @example
 * await splitStream(sourceStream, [dest1, dest2, dest3])
 */
export async function splitStream(
  source: Readable,
  destinations: Writable[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    let completed = 0;
    let hasError = false;

    const checkComplete = () => {
      if (completed === destinations.length && !hasError) {
        resolve();
      }
    };

    const handleError = (error: Error) => {
      if (!hasError) {
        hasError = true;
        destinations.forEach((dest) => {
          if (!dest.destroyed) {
            dest.destroy();
          }
        });
        reject(error);
      }
    };

    source.on("data", (chunk) => {
      if (hasError) return;

      destinations.forEach((dest) => {
        if (!dest.destroyed && dest.writable) {
          const written = dest.write(chunk);
          if (!written) {
            dest.once("drain", () => {
              if (!hasError) {
                source.resume();
              }
            });
            source.pause();
          }
        }
      });
    });

    source.on("end", () => {
      destinations.forEach((dest) => {
        if (!dest.destroyed) {
          dest.end();
        }
      });
    });

    source.on("error", handleError);

    destinations.forEach((dest) => {
      dest.on("finish", () => {
        completed++;
        checkComplete();
      });

      dest.on("error", handleError);
    });
  });
}

// ============================================================================
// Stream Buffering
// ============================================================================

/**
 * Creates a buffered stream that accumulates data up to a threshold
 * @param threshold - Buffer size threshold in bytes (default: 64KB)
 * @param timeout - Maximum time to wait before flushing (default: 1000ms)
 * @returns Transform stream with buffering
 * @example
 * const buffered = createBufferedStream(1024 * 64, 1000)
 */
export function createBufferedStream(
  threshold: number = 64 * 1024,
  timeout: number = 1000
): Transform {
  let buffer: Buffer[] = [];
  let bufferSize = 0;
  let timeoutId: NodeJS.Timeout | undefined;

  const stream = new Transform({
    transform(chunk, encoding, callback) {
      const chunkBuffer = Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk, encoding as BufferEncoding);
      buffer.push(chunkBuffer);
      bufferSize += chunkBuffer.length;

      if (bufferSize >= threshold) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }
        const data = Buffer.concat(buffer);
        buffer = [];
        bufferSize = 0;
        stream.push(data);
        callback();
      } else {
        scheduleFlush();
        callback();
      }
    },
    flush(callback) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      if (buffer.length > 0) {
        const data = Buffer.concat(buffer);
        buffer = [];
        bufferSize = 0;
        stream.push(data);
      }
      callback();
    },
  });

  const scheduleFlush = () => {
    if (timeoutId) return;
    timeoutId = setTimeout(() => {
      if (buffer.length > 0) {
        const data = Buffer.concat(buffer);
        buffer = [];
        bufferSize = 0;
        stream.push(data);
      }
    }, timeout);
  };

  return stream;
}

// ============================================================================
// Stream Throttling
// ============================================================================

/**
 * Creates a throttled stream that limits data throughput
 * @param bytesPerSecond - Maximum bytes per second
 * @returns Transform stream with throttling
 * @example
 * const throttled = createThrottledStream(1024 * 1024) // 1MB/s
 */
export function createThrottledStream(bytesPerSecond: number): Transform {
  let bytesProcessed = 0;
  let startTime = Date.now();
  let queue: Array<{
    chunk: any;
    encoding: BufferEncoding;
    callback: () => void;
  }> = [];
  let processing = false;

  const stream = new Transform({
    transform(chunk, encoding, callback) {
      queue.push({ chunk, encoding: encoding as BufferEncoding, callback });
      processQueue();
    },
  });

  const processQueue = () => {
    if (processing || queue.length === 0) return;
    processing = true;

    const now = Date.now();
    const elapsed = (now - startTime) / 1000;
    const allowedBytes = elapsed * bytesPerSecond;

    if (bytesProcessed >= allowedBytes) {
      // Need to wait
      const waitTime =
        ((bytesProcessed - allowedBytes) / bytesPerSecond) * 1000;
      setTimeout(() => {
        bytesProcessed = 0;
        startTime = Date.now();
        processing = false;
        processQueue();
      }, waitTime);
      return;
    }

    const item = queue.shift();
    if (!item) {
      processing = false;
      return;
    }

    const chunkBuffer = Buffer.isBuffer(item.chunk)
      ? item.chunk
      : Buffer.from(item.chunk, item.encoding);
    const chunkSize = chunkBuffer.length;

    if (bytesProcessed + chunkSize <= allowedBytes || elapsed === 0) {
      bytesProcessed += chunkSize;
      stream.push(item.chunk);
      item.callback();
      processing = false;
      processQueue();
    } else {
      // Put it back and wait
      queue.unshift(item);
      const waitTime =
        ((bytesProcessed + chunkSize - allowedBytes) / bytesPerSecond) * 1000;
      setTimeout(() => {
        bytesProcessed = 0;
        startTime = Date.now();
        processing = false;
        processQueue();
      }, waitTime);
    }
  };

  return stream;
}

// ============================================================================
// Stream Transformation Pipeline
// ============================================================================

/**
 * Creates a transformation pipeline from multiple transform functions
 * @param transforms - Array of transform functions
 * @returns Transform stream
 * @example
 * const pipeline = createTransformPipeline([
 *   (chunk) => chunk.toString().toUpperCase(),
 *   (chunk) => chunk.replace(/[^A-Z]/g, ''),
 *   (chunk) => chunk.split('').reverse().join('')
 * ])
 */
export function createTransformPipeline(
  transforms: Array<(chunk: any) => any>
): Transform {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      try {
        let result = chunk;
        for (const transformFn of transforms) {
          result = transformFn(result);
        }
        callback(null, result);
      } catch (error) {
        callback(error as Error);
      }
    },
  });
}

/**
 * Creates a transformation pipeline with async transform functions
 * @param transforms - Array of async transform functions
 * @returns Transform stream
 * @example
 * const pipeline = createAsyncTransformPipeline([
 *   async (chunk) => await processChunk(chunk),
 *   async (chunk) => await validateChunk(chunk)
 * ])
 */
export function createAsyncTransformPipeline(
  transforms: Array<(chunk: any) => Promise<any>>
): Transform {
  return new Transform({
    objectMode: true,
    async transform(chunk, encoding, callback) {
      try {
        let result = chunk;
        for (const transformFn of transforms) {
          result = await transformFn(result);
        }
        callback(null, result);
      } catch (error) {
        callback(error as Error);
      }
    },
  });
}

// ============================================================================
// Stream Error Recovery
// ============================================================================

/**
 * Options for error recovery
 */
export interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error, attempt: number) => void;
  fallback?: (error: Error) => any;
}

/**
 * Creates a stream with error recovery capabilities
 * @param source - Source readable stream
 * @param options - Error recovery options
 * @returns Readable stream with error recovery
 * @example
 * const recovered = createErrorRecoveryStream(sourceStream, {
 *   maxRetries: 3,
 *   retryDelay: 1000,
 *   fallback: (error) => `Error: ${error.message}`
 * })
 */
export function createErrorRecoveryStream(
  source: Readable,
  options: ErrorRecoveryOptions = {}
): Readable {
  const { maxRetries = 3, retryDelay = 1000, onError, fallback } = options;

  const output = new PassThrough({ objectMode: true });
  let retryCount = 0;
  let currentSource = source;

  const setupSource = (stream: Readable) => {
    stream.on("data", (chunk) => {
      retryCount = 0; // Reset retry count on successful data
      output.push(chunk);
    });

    stream.on("end", () => {
      output.push(null);
    });

    stream.on("error", async (error: Error) => {
      if (onError) {
        onError(error, retryCount);
      }

      if (retryCount < maxRetries) {
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        // Try to recreate/resume the stream
        // Note: This is a simplified version - actual implementation
        // would depend on the stream type and how to recreate it
        if (fallback) {
          const fallbackData = fallback(error);
          output.push(fallbackData);
        } else {
          // Retry by re-emitting the error after delay
          setupSource(currentSource);
        }
      } else {
        if (fallback) {
          const fallbackData = fallback(error);
          output.push(fallbackData);
          output.push(null);
        } else {
          output.destroy(error);
        }
      }
    });
  };

  setupSource(currentSource);

  return output;
}

/**
 * Wraps a transform stream with error recovery
 * @param transform - Transform stream to wrap
 * @param options - Error recovery options
 * @returns Transform stream with error recovery
 * @example
 * const safeTransform = wrapTransformWithErrorRecovery(transformStream, {
 *   maxRetries: 3,
 *   fallback: (error) => null // Skip on error
 * })
 */
export function wrapTransformWithErrorRecovery(
  transform: Transform,
  options: ErrorRecoveryOptions = {}
): Transform {
  const { fallback } = options;

  const wrapped = new Transform({
    objectMode: transform.readableObjectMode,
    transform(chunk, encoding, callback) {
      try {
        transform._transform(chunk, encoding, (error, data) => {
          if (error) {
            if (fallback) {
              const fallbackData = fallback(error);
              callback(null, fallbackData);
            } else {
              callback(error);
            }
          } else {
            callback(null, data);
          }
        });
      } catch (error) {
        if (fallback) {
          const fallbackData = fallback(error as Error);
          callback(null, fallbackData);
        } else {
          callback(error as Error);
        }
      }
    },
  });

  // Forward events
  transform.on("error", (error) => {
    if (fallback) {
      wrapped.emit("error", error);
    }
  });

  return wrapped;
}
