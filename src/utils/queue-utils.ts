/**
 * Queue Utilities
 * Utilities for queue data structures
 */

/**
 * Simple queue implementation
 */
export class Queue<T> {
  private items: T[] = [];

  /**
   * Adds item to queue
   * @param item - Item to add
   * @example
   * queue.enqueue('item')
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns first item
   * @returns First item or undefined
   * @example
   * const item = queue.dequeue()
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * Gets first item without removing
   * @returns First item or undefined
   * @example
   * const item = queue.peek()
   */
  peek(): T | undefined {
    return this.items[0];
  }

  /**
   * Gets queue size
   * @returns Number of items
   * @example
   * const size = queue.size()
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Checks if queue is empty
   * @returns True if empty
   * @example
   * const isEmpty = queue.isEmpty()
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Clears the queue
   * @example
   * queue.clear()
   */
  clear(): void {
    this.items = [];
  }
}

/**
 * Priority queue implementation
 */
export class PriorityQueue<T> {
  private items: Array<{ item: T; priority: number }> = [];

  /**
   * Adds item with priority
   * @param item - Item to add
   * @param priority - Priority (higher = more important)
   * @example
   * queue.enqueue('item', 5)
   */
  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
    this.items.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Removes and returns highest priority item
   * @returns Highest priority item or undefined
   * @example
   * const item = queue.dequeue()
   */
  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }

  /**
   * Gets queue size
   * @returns Number of items
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Checks if queue is empty
   * @returns True if empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

/**
 * Creates a new queue
 * @returns Queue instance
 * @example
 * const queue = createQueue<string>()
 */
export function createQueue<T>(): Queue<T> {
  return new Queue<T>();
}

/**
 * Creates a new priority queue
 * @returns Priority queue instance
 * @example
 * const queue = createPriorityQueue<string>()
 */
export function createPriorityQueue<T>(): PriorityQueue<T> {
  return new PriorityQueue<T>();
}
