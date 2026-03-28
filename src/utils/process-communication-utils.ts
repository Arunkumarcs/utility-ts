/**
 * Process Communication Utilities
 * Utilities for inter-process communication
 */

import { EventEmitter } from "events";

/**
 * Creates a message channel between processes
 * @returns Message channel with send and receive methods
 * @example
 * const channel = createMessageChannel()
 * channel.on('message', (data) => console.log('Received:', data))
 * channel.send({ type: 'hello', data: 'world' })
 */
export function createMessageChannel(): {
  send: (data: any) => void;
  on: (event: string, handler: (data: any) => void) => void;
  off: (event: string, handler: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
} {
  const emitter = new EventEmitter();

  return {
    send: (data: any) => emitter.emit("message", data),
    on: (event: string, handler: (data: any) => void) =>
      emitter.on(event, handler),
    off: (event: string, handler: (data: any) => void) =>
      emitter.off(event, handler),
    emit: (event: string, data: any) => emitter.emit(event, data),
  };
}

/**
 * Creates a request-response pattern for process communication
 * @param timeout - Request timeout in milliseconds
 * @returns Request-response handler
 * @example
 * const rpc = createRequestResponse(5000)
 * rpc.onRequest('getData', async (params) => ({ result: 'data' }))
 * const response = await rpc.request('getData', { id: 1 })
 */
export function createRequestResponse(timeout: number = 5000): {
  request: (method: string, params?: any) => Promise<any>;
  onRequest: (
    method: string,
    handler: (params?: any) => Promise<any> | any
  ) => void;
} {
  const emitter = new EventEmitter();
  let requestId = 0;

  return {
    request: (method: string, params?: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        const id = ++requestId;
        const responseEvent = `response:${id}`;

        const timeoutId = setTimeout(() => {
          emitter.off(responseEvent, handler);
          reject(new Error(`Request timeout: ${method}`));
        }, timeout);

        const handler = (response: {
          success: boolean;
          data?: any;
          error?: any;
        }) => {
          clearTimeout(timeoutId);
          emitter.off(responseEvent, handler);
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error || "Request failed"));
          }
        };

        emitter.once(responseEvent, handler);
        emitter.emit("request", { id, method, params, responseEvent });
      });
    },

    onRequest: (
      method: string,
      handler: (params?: any) => Promise<any> | any
    ) => {
      emitter.on(
        "request",
        async (request: {
          id: number;
          method: string;
          params?: any;
          responseEvent: string;
        }) => {
          if (request.method === method) {
            try {
              const result = await handler(request.params);
              emitter.emit(request.responseEvent, {
                success: true,
                data: result,
              });
            } catch (error: any) {
              emitter.emit(request.responseEvent, {
                success: false,
                error: error.message || String(error),
              });
            }
          }
        }
      );
    },
  };
}

/**
 * Creates a pub-sub pattern for process communication
 * @returns Pub-sub handler
 * @example
 * const pubsub = createPubSub()
 * pubsub.subscribe('news', (data) => console.log('News:', data))
 * pubsub.publish('news', { title: 'Breaking news' })
 */
export function createPubSub(): {
  publish: (topic: string, data: any) => void;
  subscribe: (topic: string, handler: (data: any) => void) => () => void;
  unsubscribe: (topic: string, handler: (data: any) => void) => void;
} {
  const emitter = new EventEmitter();

  return {
    publish: (topic: string, data: any) => {
      emitter.emit(topic, data);
    },

    subscribe: (topic: string, handler: (data: any) => void) => {
      emitter.on(topic, handler);
      return () => emitter.off(topic, handler);
    },

    unsubscribe: (topic: string, handler: (data: any) => void) => {
      emitter.off(topic, handler);
    },
  };
}

/**
 * Creates a queue for process communication
 * @returns Queue handler
 * @example
 * const queue = createQueue()
 * queue.enqueue({ task: 'process-data' })
 * queue.dequeue().then(item => console.log('Processing:', item))
 */
export function createQueue<T>(): {
  enqueue: (item: T) => void;
  dequeue: () => Promise<T>;
  size: () => number;
  isEmpty: () => boolean;
} {
  const items: T[] = [];
  const waiters: Array<(item: T) => void> = [];

  return {
    enqueue: (item: T) => {
      if (waiters.length > 0) {
        const waiter = waiters.shift();
        if (waiter) {
          waiter(item);
        }
      } else {
        items.push(item);
      }
    },

    dequeue: (): Promise<T> => {
      return new Promise((resolve) => {
        if (items.length > 0) {
          resolve(items.shift()!);
        } else {
          waiters.push(resolve);
        }
      });
    },

    size: () => items.length,
    isEmpty: () => items.length === 0,
  };
}

/**
 * Creates a semaphore for limiting concurrent operations
 * @param count - Number of permits
 * @returns Semaphore handler
 * @example
 * const semaphore = createSemaphore(3)
 * await semaphore.acquire()
 * try {
 *   // Critical section
 * } finally {
 *   semaphore.release()
 * }
 */
export function createSemaphore(count: number): {
  acquire: () => Promise<void>;
  release: () => void;
  available: () => number;
} {
  let permits = count;
  const waiters: Array<() => void> = [];

  return {
    acquire: (): Promise<void> => {
      return new Promise((resolve) => {
        if (permits > 0) {
          permits--;
          resolve();
        } else {
          waiters.push(resolve);
        }
      });
    },

    release: () => {
      if (waiters.length > 0) {
        const waiter = waiters.shift();
        if (waiter) {
          waiter();
        }
      } else {
        permits++;
      }
    },

    available: () => permits,
  };
}
