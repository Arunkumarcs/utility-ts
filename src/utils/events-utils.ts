/**
 * Events Utilities
 * Utilities for Node.js EventEmitter
 */

import { EventEmitter } from "events";

export interface EventListenerOptions {
  once?: boolean;
  priority?: number;
}

/**
 * Creates an enhanced EventEmitter with additional utilities
 * @returns Enhanced EventEmitter instance
 * @example
 * const emitter = createEventEmitter()
 */
export function createEventEmitter(): EventEmitter {
  return new EventEmitter();
}

/**
 * Wraps an event listener to execute only once
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @param listener - Event listener
 * @returns Unsubscribe function
 * @example
 * const unsubscribe = once(emitter, 'data', (data) => console.log(data))
 */
export function once<T = any>(
  emitter: EventEmitter,
  event: string,
  listener: (data: T) => void
): () => void {
  emitter.once(event, listener);
  return () => emitter.removeListener(event, listener);
}

/**
 * Subscribes to an event with automatic cleanup
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @param listener - Event listener
 * @returns Unsubscribe function
 * @example
 * const unsubscribe = subscribe(emitter, 'data', (data) => console.log(data))
 */
export function subscribe<T = any>(
  emitter: EventEmitter,
  event: string,
  listener: (data: T) => void
): () => void {
  emitter.on(event, listener);
  return () => emitter.removeListener(event, listener);
}

/**
 * Creates a debounced event listener
 * @param fn - Function to debounce
 * @param delayMs - Debounce delay in milliseconds
 * @returns Debounced function
 * @example
 * const debounced = createDebouncedListener((data) => console.log(data), 300)
 * emitter.on('data', debounced)
 */
export function createDebouncedListener<T = any>(
  fn: (data: T) => void,
  delayMs: number
): (data: T) => void {
  let timeoutId: NodeJS.Timeout;
  return (data: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(data), delayMs);
  };
}

/**
 * Creates a throttled event listener
 * @param fn - Function to throttle
 * @param delayMs - Throttle delay in milliseconds
 * @returns Throttled function
 * @example
 * const throttled = createThrottledListener((data) => console.log(data), 300)
 * emitter.on('data', throttled)
 */
export function createThrottledListener<T = any>(
  fn: (data: T) => void,
  delayMs: number
): (data: T) => void {
  let lastCall = 0;
  return (data: T) => {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      fn(data);
    }
  };
}

/**
 * Filters events based on a predicate
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @param predicate - Filter function
 * @param listener - Event listener
 * @returns Unsubscribe function
 * @example
 * const unsubscribe = filter(emitter, 'data', (data) => data > 10, console.log)
 */
export function filter<T = any>(
  emitter: EventEmitter,
  event: string,
  predicate: (data: T) => boolean,
  listener: (data: T) => void
): () => void {
  const filteredListener = (data: T) => {
    if (predicate(data)) {
      listener(data);
    }
  };
  emitter.on(event, filteredListener);
  return () => emitter.removeListener(event, filteredListener);
}

/**
 * Maps event data through a transformation function
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @param transform - Transformation function
 * @param listener - Event listener
 * @returns Unsubscribe function
 * @example
 * const unsubscribe = map(emitter, 'data', (x) => x * 2, console.log)
 */
export function map<TInput = any, TOutput = any>(
  emitter: EventEmitter,
  event: string,
  transform: (data: TInput) => TOutput,
  listener: (data: TOutput) => void
): () => void {
  const mappedListener = (data: TInput) => {
    listener(transform(data));
  };
  emitter.on(event, mappedListener);
  return () => emitter.removeListener(event, mappedListener);
}

/**
 * Buffers events and emits them in batches
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @param batchSize - Number of events per batch
 * @param listener - Event listener
 * @returns Unsubscribe function
 * @example
 * const unsubscribe = batch(emitter, 'data', 10, (batch) => console.log(batch))
 */
export function batch<T = any>(
  emitter: EventEmitter,
  event: string,
  batchSize: number,
  listener: (batch: T[]) => void
): () => void {
  const buffer: T[] = [];
  const batchedListener = (data: T) => {
    buffer.push(data);
    if (buffer.length >= batchSize) {
      listener([...buffer]);
      buffer.length = 0;
    }
  };
  emitter.on(event, batchedListener);
  return () => emitter.removeListener(event, batchedListener);
}

/**
 * Waits for an event to occur
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise that resolves with event data
 * @example
 * const data = await waitFor(emitter, 'ready', 5000)
 */
export function waitFor<T = any>(
  emitter: EventEmitter,
  event: string,
  timeoutMs?: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = timeoutMs
      ? setTimeout(() => {
          emitter.removeListener(event, listener);
          reject(new Error(`Event ${event} timed out after ${timeoutMs}ms`));
        }, timeoutMs)
      : null;

    const listener = (data: T) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      emitter.removeListener(event, listener);
      resolve(data);
    };

    emitter.once(event, listener);
  });
}

/**
 * Broadcasts an event to multiple emitters
 * @param emitters - Array of EventEmitter instances
 * @param event - Event name
 * @param data - Event data
 * @example
 * broadcast([emitter1, emitter2], 'data', { value: 1 })
 */
export function broadcast(
  emitters: EventEmitter[],
  event: string,
  data: any
): void {
  emitters.forEach((emitter) => {
    emitter.emit(event, data);
  });
}

/**
 * Removes all listeners for an event
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @example
 * removeAllListeners(emitter, 'data')
 */
export function removeAllListeners(emitter: EventEmitter, event: string): void {
  emitter.removeAllListeners(event);
}

/**
 * Gets the number of listeners for an event
 * @param emitter - EventEmitter instance
 * @param event - Event name
 * @returns Number of listeners
 * @example
 * const count = getListenerCount(emitter, 'data')
 */
export function getListenerCount(emitter: EventEmitter, event: string): number {
  return emitter.listenerCount(event);
}

/**
 * Creates an event middleware pattern
 * @param emitter - EventEmitter instance
 * @param middleware - Middleware function
 * @returns Enhanced emitter with middleware
 * @example
 * const enhanced = withMiddleware(emitter, (data, next) => {
 *   console.log('Before:', data)
 *   next()
 * })
 */
export function withMiddleware<T = any>(
  emitter: EventEmitter,
  middleware: (data: T, next: () => void) => void
): EventEmitter {
  const originalEmit = emitter.emit.bind(emitter);

  emitter.emit = function (event: string, ...args: any[]): boolean {
    if (args.length > 0) {
      return new Promise<boolean>((resolve) => {
        middleware(args[0] as T, () => {
          resolve(originalEmit(event, ...args));
        });
      }) as any;
    }
    return originalEmit(event, ...args);
  };

  return emitter;
}

/**
 * Creates a namespaced event emitter
 * @param namespace - Namespace prefix
 * @param emitter - Base EventEmitter instance
 * @returns Namespaced emitter
 * @example
 * const nsEmitter = createNamespacedEmitter('app', emitter)
 * nsEmitter.emit('user:created', data) // emits 'app:user:created'
 */
export function createNamespacedEmitter(
  namespace: string,
  emitter: EventEmitter = new EventEmitter()
): EventEmitter {
  const namespacedEmitter = new EventEmitter();

  const originalEmit = emitter.emit.bind(emitter);
  const originalOn = emitter.on.bind(emitter);
  const originalOnce = emitter.once.bind(emitter);
  const originalOff = emitter.off.bind(emitter);

  namespacedEmitter.emit = function (event: string, ...args: any[]): boolean {
    return originalEmit(`${namespace}:${event}`, ...args);
  };

  namespacedEmitter.on = function (
    event: string,
    listener: (...args: any[]) => void
  ): EventEmitter {
    return originalOn(`${namespace}:${event}`, listener);
  };

  namespacedEmitter.once = function (
    event: string,
    listener: (...args: any[]) => void
  ): EventEmitter {
    return originalOnce(`${namespace}:${event}`, listener);
  };

  namespacedEmitter.off = function (
    event: string,
    listener: (...args: any[]) => void
  ): EventEmitter {
    return originalOff(`${namespace}:${event}`, listener);
  };

  return namespacedEmitter;
}
