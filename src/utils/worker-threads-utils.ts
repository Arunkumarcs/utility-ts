/**
 * Worker Threads Utilities
 * Utilities for Node.js worker_threads module
 */

import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
  MessagePort,
  threadId,
} from "worker_threads";

export interface WorkerOptions {
  workerData?: any;
  eval?: boolean;
  stdin?: boolean;
  stdout?: boolean;
  stderr?: boolean;
  execArgv?: string[];
  argv?: string[];
  env?: NodeJS.ProcessEnv;
  name?: string;
  resourceLimits?: {
    maxOldGenerationSizeMb?: number;
    maxYoungGenerationSizeMb?: number;
    codeRangeSizeMb?: number;
  };
}

export interface WorkerPoolOptions {
  size?: number;
  workerData?: any;
  script?: string;
}

/**
 * Checks if current thread is the main thread
 * @returns True if main thread
 * @example
 * if (isMain()) { ... }
 */
export function isMain(): boolean {
  return isMainThread;
}

/**
 * Gets the current thread ID
 * @returns Thread ID
 * @example
 * const id = getThreadId()
 */
export function getThreadId(): number {
  return threadId;
}

/**
 * Creates a worker from a script file
 * @param scriptPath - Path to worker script
 * @param options - Worker options
 * @returns Worker instance
 * @example
 * const worker = createWorker('./worker.js', { workerData: { id: 1 } })
 */
export function createWorker(
  scriptPath: string,
  options: WorkerOptions = {}
): Worker {
  return new Worker(scriptPath, options);
}

/**
 * Executes a function in a worker thread
 * @param fn - Function to execute
 * @param data - Data to pass to function
 * @param options - Worker options
 * @returns Promise with result
 * @example
 * const result = await executeInWorker((data) => data * 2, 5)
 */
export async function executeInWorker<T, R>(
  fn: (data: T) => R | Promise<R>,
  data: T,
  options: WorkerOptions = {}
): Promise<R> {
  return new Promise((resolve, reject) => {
    const workerCode = `
      const { parentPort, workerData } = require('worker_threads');
      const fn = ${fn.toString()};
      (async () => {
        try {
          const result = await fn(workerData);
          parentPort.postMessage({ success: true, result });
        } catch (error) {
          parentPort.postMessage({ success: false, error: error.message });
        }
      })();
    `;

    const worker = new Worker(workerCode, {
      ...options,
      eval: true,
      workerData: data,
    });

    worker.on("message", (message: any) => {
      if (message.success) {
        resolve(message.result);
      } else {
        reject(new Error(message.error));
      }
      worker.terminate();
    });

    worker.on("error", (error) => {
      reject(error);
      worker.terminate();
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

/**
 * Sends a message to the parent thread (from worker)
 * @param message - Message to send
 * @example
 * sendToParent({ result: computeResult() })
 */
export function sendToParent(message: any): void {
  if (parentPort) {
    parentPort.postMessage(message);
  }
}

/**
 * Listens for messages from parent thread (in worker)
 * @param handler - Message handler
 * @returns Unsubscribe function
 * @example
 * const unsubscribe = onParentMessage((message) => console.log(message))
 */
export function onParentMessage(handler: (message: any) => void): () => void {
  if (!parentPort) {
    return () => {};
  }

  parentPort.on("message", handler);
  return () => {
    if (parentPort) {
      parentPort.off("message", handler);
    }
  };
}

/**
 * Gets worker data
 * @returns Worker data
 * @example
 * const data = getWorkerData()
 */
export function getWorkerData<T = any>(): T {
  return workerData as T;
}

/**
 * Creates a worker pool
 * @param scriptPath - Path to worker script
 * @param options - Pool options
 * @returns Worker pool instance
 * @example
 * const pool = createWorkerPool('./worker.js', { size: 4 })
 */
export function createWorkerPool(
  scriptPath: string,
  options: WorkerPoolOptions = {}
): {
  execute: <T, R>(data: T) => Promise<R>;
  terminate: () => Promise<void>;
  getStats: () => { size: number; active: number; idle: number };
} {
  const { size = require("os").cpus().length, workerData } = options;
  const workers: Worker[] = [];
  const queue: Array<{
    data: any;
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }> = [];
  let activeCount = 0;

  // Create workers
  for (let i = 0; i < size; i++) {
    const worker = new Worker(scriptPath, { workerData });
    workers.push(worker);

    worker.on("message", (result: any) => {
      activeCount--;
      const task = queue.shift();
      if (task) {
        task.resolve(result);
        activeCount++;
      }
    });

    worker.on("error", (error) => {
      activeCount--;
      const task = queue.shift();
      if (task) {
        task.reject(error);
      }
    });
  }

  return {
    execute: <T, R>(data: T): Promise<R> => {
      return new Promise((resolve, reject) => {
        if (activeCount < size) {
          activeCount++;
          const worker = workers[activeCount - 1];
          worker.postMessage(data);
          worker.once("message", (result: R) => {
            resolve(result);
          });
        } else {
          queue.push({ data, resolve, reject });
        }
      });
    },
    terminate: async (): Promise<void> => {
      await Promise.all(workers.map((worker) => worker.terminate()));
    },
    getStats: () => ({
      size,
      active: activeCount,
      idle: size - activeCount,
    }),
  };
}

/**
 * Transfers data to worker using transfer list
 * @param worker - Worker instance
 * @param message - Message to send
 * @param transferList - Array of transferable objects
 * @example
 * transferToWorker(worker, { buffer }, [buffer.buffer])
 */
export function transferToWorker(
  worker: Worker,
  message: any,
  transferList: ArrayBuffer[]
): void {
  worker.postMessage(message, transferList);
}

/**
 * Creates a message channel between threads
 * @returns Object with port1 and port2
 * @example
 * const { port1, port2 } = createMessageChannel()
 */
export function createMessageChannel(): {
  port1: MessagePort;
  port2: MessagePort;
} {
  const { MessageChannel } = require("worker_threads");
  const channel = new MessageChannel();
  return { port1: channel.port1, port2: channel.port2 };
}

/**
 * Waits for a message from parent thread
 * @param timeoutMs - Optional timeout in milliseconds
 * @returns Promise with message
 * @example
 * const message = await waitForParentMessage(5000)
 */
export function waitForParentMessage(timeoutMs?: number): Promise<any> {
  if (!parentPort) {
    return Promise.reject(new Error("Not in a worker thread"));
  }

  const port = parentPort; // Capture for type narrowing

  return new Promise((resolve, reject) => {
    const timeout = timeoutMs
      ? setTimeout(() => {
          port.off("message", handler);
          reject(new Error(`Message timeout after ${timeoutMs}ms`));
        }, timeoutMs)
      : null;

    const handler = (message: any) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      port.off("message", handler);
      resolve(message);
    };

    port.once("message", handler);
  });
}

/**
 * Terminates a worker gracefully
 * @param worker - Worker instance
 * @param timeoutMs - Timeout before force termination
 * @returns Promise that resolves when worker is terminated
 * @example
 * await terminateWorker(worker, 5000)
 */
export async function terminateWorker(
  worker: Worker,
  timeoutMs: number = 5000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error("Worker termination timeout"));
    }, timeoutMs);

    worker.once("exit", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Worker exited with code ${code}`));
      }
    });

    // Try graceful shutdown by sending a message
    // Note: The worker script needs to listen for shutdown messages
    try {
      worker.postMessage({ type: "shutdown" });
    } catch {
      // Worker may not be ready to receive messages
    }
  });
}

/**
 * Gets worker resource usage
 * @param worker - Worker instance
 * @returns Resource usage or null if not available
 * @example
 * const usage = getWorkerResourceUsage(worker)
 */
export function getWorkerResourceUsage(worker: Worker): {
  utilization: number;
  active: number;
  idle: number;
} | null {
  try {
    return worker.performance.eventLoopUtilization();
  } catch {
    return null;
  }
}
