/**
 * Worker Utilities
 * Utilities for web workers and worker threads
 */

/**
 * Creates a worker from a function string
 * @param workerFunction - Function as string
 * @returns Worker instance
 * @example
 * const worker = createWorker('self.onmessage = (e) => self.postMessage(e.data * 2)')
 */
export function createWorker(workerFunction: string): Worker {
  const blob = new Blob([workerFunction], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

/**
 * Executes a function in a worker
 * @param fn - Function to execute
 * @param data - Data to pass to function
 * @returns Promise with result
 * @example
 * const result = await executeInWorker((data) => data * 2, 5)
 */
export async function executeInWorker<T, R>(
  fn: (data: T) => R,
  data: T
): Promise<R> {
  return new Promise((resolve, reject) => {
    const workerCode = `
      self.onmessage = function(e) {
        try {
          const fn = ${fn.toString()};
          const result = fn(e.data);
          self.postMessage({ success: true, result });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      };
    `;

    const worker = createWorker(workerCode);

    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error));
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage(data);
  });
}

/**
 * Creates a worker from a file URL
 * @param fileUrl - Worker file URL
 * @returns Worker instance
 * @example
 * const worker = createWorkerFromFile('/path/to/worker.js')
 */
export function createWorkerFromFile(fileUrl: string): Worker {
  return new Worker(fileUrl);
}

/**
 * Terminates a worker
 * @param worker - Worker instance
 * @example
 * terminateWorker(worker)
 */
export function terminateWorker(worker: Worker): void {
  worker.terminate();
}

/**
 * Creates a message handler for worker
 * @param handler - Message handler function
 * @returns Message handler
 * @example
 * const handler = createWorkerMessageHandler((data) => {
 *   return processData(data)
 * })
 */
export function createWorkerMessageHandler<T, R>(
  handler: (data: T) => R | Promise<R>
): (event: MessageEvent<T>) => void {
  return async (event: MessageEvent<T>) => {
    try {
      const result = await handler(event.data);
      if (typeof self !== "undefined" && self.postMessage) {
        self.postMessage({ success: true, result });
      }
    } catch (error: any) {
      if (typeof self !== "undefined" && self.postMessage) {
        self.postMessage({ success: false, error: error.message });
      }
    }
  };
}
