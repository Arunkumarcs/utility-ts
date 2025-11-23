/**
 * Stream Utilities
 * Utilities for working with streams
 */

import { Readable, Writable, Transform } from "stream";

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
