/**
 * Cluster Utilities
 * Utilities for Node.js cluster module
 */

import cluster, { Worker } from "cluster";
import { EventEmitter } from "events";

export interface ClusterOptions {
  workers?: number;
  restartOnExit?: boolean;
  restartDelay?: number;
  env?: NodeJS.ProcessEnv;
}

export interface ClusterStats {
  totalWorkers: number;
  activeWorkers: number;
  deadWorkers: number;
  uptime: number;
}

/**
 * Creates a cluster with specified number of workers
 * @param options - Cluster configuration options
 * @returns Promise that resolves when all workers are ready
 * @example
 * await createCluster({ workers: 4 })
 */
export async function createCluster(
  options: ClusterOptions = {}
): Promise<void> {
  const {
    workers = require("os").cpus().length,
    restartOnExit = true,
    restartDelay = 1000,
    env,
  } = options;

  if (cluster.isPrimary) {
    // Fork workers
    for (let i = 0; i < workers; i++) {
      const worker = cluster.fork(env);
      setupWorkerHandlers(worker, restartOnExit, restartDelay);
    }

    // Handle worker exit
    cluster.on("exit", (worker, code, signal) => {
      console.log(
        `Worker ${worker.process.pid} died (${signal || code}). Restarting...`
      );
      if (restartOnExit) {
        setTimeout(() => {
          const newWorker = cluster.fork(env);
          setupWorkerHandlers(newWorker, restartOnExit, restartDelay);
        }, restartDelay);
      }
    });
  }
}

/**
 * Sets up event handlers for a worker
 * @param worker - Worker instance
 * @param restartOnExit - Whether to restart on exit
 * @param restartDelay - Delay before restart
 */
function setupWorkerHandlers(
  worker: Worker,
  restartOnExit: boolean,
  restartDelay: number
): void {
  worker.on("exit", (code, signal) => {
    if (restartOnExit) {
      setTimeout(() => {
        cluster.fork();
      }, restartDelay);
    }
  });
}

/**
 * Gets cluster statistics
 * @returns Cluster statistics object
 * @example
 * const stats = getClusterStats()
 */
export function getClusterStats(): ClusterStats {
  const workers = Object.values(cluster.workers || {});
  const activeWorkers = workers.filter((w) => w && !w.isDead());
  const deadWorkers = workers.filter((w) => w && w.isDead());

  return {
    totalWorkers: workers.length,
    activeWorkers: activeWorkers.length,
    deadWorkers: deadWorkers.length,
    uptime: process.uptime(),
  };
}

/**
 * Broadcasts a message to all workers
 * @param message - Message to broadcast
 * @example
 * broadcastToWorkers({ type: 'reload' })
 */
export function broadcastToWorkers(message: any): void {
  for (const worker of Object.values(cluster.workers || {})) {
    if (worker) {
      worker.send(message);
    }
  }
}

/**
 * Kills all workers gracefully
 * @param signal - Signal to send (default: 'SIGTERM')
 * @returns Promise that resolves when all workers are killed
 * @example
 * await killAllWorkers('SIGTERM')
 */
export async function killAllWorkers(
  signal: NodeJS.Signals = "SIGTERM"
): Promise<void> {
  const workers = Object.values(cluster.workers || {});
  const killPromises = workers.map((worker) => {
    if (worker) {
      return new Promise<void>((resolve) => {
        worker.once("exit", () => resolve());
        worker.kill(signal);
      });
    }
    return Promise.resolve();
  });

  await Promise.all(killPromises);
}

/**
 * Restarts all workers
 * @returns Promise that resolves when all workers are restarted
 * @example
 * await restartAllWorkers()
 */
export async function restartAllWorkers(): Promise<void> {
  await killAllWorkers();
  const workerCount = Object.keys(cluster.workers || {}).length;
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }
}

/**
 * Checks if current process is the primary/master
 * @returns True if primary process
 * @example
 * if (isPrimaryProcess()) { ... }
 */
export function isPrimaryProcess(): boolean {
  return cluster.isPrimary;
}

/**
 * Checks if current process is a worker
 * @returns True if worker process
 * @example
 * if (isWorkerProcess()) { ... }
 */
export function isWorkerProcess(): boolean {
  return cluster.isWorker;
}

/**
 * Gets the current worker ID
 * @returns Worker ID or null if primary
 * @example
 * const id = getWorkerId()
 */
export function getWorkerId(): number | null {
  if (cluster.isWorker && cluster.worker) {
    return cluster.worker.id;
  }
  return null;
}

/**
 * Creates a cluster manager with enhanced features
 * @param options - Cluster options
 * @returns Cluster manager instance
 * @example
 * const manager = createClusterManager({ workers: 4 })
 */
export function createClusterManager(
  options: ClusterOptions = {}
): EventEmitter {
  const manager = new EventEmitter();
  const { workers = require("os").cpus().length, env } = options;

  if (cluster.isPrimary) {
    let workerCount = 0;

    const forkWorker = () => {
      const worker = cluster.fork(env);
      workerCount++;

      worker.on("message", (message) => {
        manager.emit("worker:message", { worker, message });
      });

      worker.on("online", () => {
        manager.emit("worker:online", worker);
      });

      worker.on("exit", (code, signal) => {
        manager.emit("worker:exit", { worker, code, signal });
        workerCount--;
      });

      return worker;
    };

    // Fork initial workers
    for (let i = 0; i < workers; i++) {
      forkWorker();
    }

    manager.on("restart", () => {
      restartAllWorkers();
    });

    manager.on("broadcast", (message) => {
      broadcastToWorkers(message);
    });

    manager.on("stats", () => {
      manager.emit("stats:data", getClusterStats());
    });
  }

  return manager;
}
