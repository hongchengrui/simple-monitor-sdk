/**
 * Micro-Task Queue Utility
 *
 * Provides a Promise-based micro-task queue for batching operations.
 * Used to defer execution until the next micro-task, allowing multiple
 * operations to be batched together.
 *
 * @module queue
 */

/**
 * Task function type - void function with no parameters
 */
export type QueueTask = () => void;

/**
 * Micro-task queue using Promise for deferred execution.
 * Tasks are executed in the next micro-task after being added.
 *
 * @example
 * ```ts
 * const queue = new MicroTaskQueue();
 *
 * queue.addFn(() => console.log('Task 1'));
 * queue.addFn(() => console.log('Task 2'));
 * // Both tasks execute in next micro-task
 * ```
 */
export class MicroTaskQueue {
  /** The Promise used for micro-task scheduling */
  protected micro: Promise<void> | null;

  /** Array of pending tasks */
  protected stack: QueueTask[];

  /** Whether a flush has been scheduled */
  protected isFlushing: boolean;

  /** Whether the queue is enabled (Promise available) */
  protected enabled: boolean;

  constructor() {
    this.micro = null;
    this.stack = [];
    this.isFlushing = false;

    // Check if Promise is available
    this.enabled = typeof Promise !== 'undefined';

    if (this.enabled) {
      // Create a resolved promise to use for then()
      this.micro = Promise.resolve();
    }
  }

  /**
   * Adds a task to the queue.
   * The task will be executed in the next micro-task.
   *
   * @param fn - The task function to add
   */
  addFn(fn: QueueTask): void {
    if (typeof fn !== 'function') {
      return;
    }

    // If Promise is not available, execute immediately
    if (!this.enabled || !this.micro) {
      fn();
      return;
    }

    // Add to stack
    this.stack.push(fn);

    // Schedule flush if not already scheduled
    if (!this.isFlushing) {
      this.isFlushing = true;
      this.micro.then(() => this.flush());
    }
  }

  /**
   * Flushes all pending tasks.
   * Tasks are executed in the order they were added.
   */
  flush(): void {
    // Take a snapshot of current tasks
    const temp = this.stack.slice(0);

    // Clear the stack
    this.stack.length = 0;
    this.isFlushing = false;

    // Execute all tasks
    for (const task of temp) {
      task();
    }
  }

  /**
   * Clears all pending tasks without executing them.
   */
  clear(): void {
    this.stack.length = 0;
    this.isFlushing = false;
  }

  /**
   * Gets the current number of pending tasks.
   */
  get size(): number {
    return this.stack.length;
  }

  /**
   * Checks if there are pending tasks.
   */
  get pending(): boolean {
    return this.stack.length > 0;
  }
}

/**
 * Macro-task queue using setTimeout for deferred execution.
 * Tasks are executed after a specified delay.
 *
 * @example
 * ```ts
 * const queue = new MacroTaskQueue(100);
 *
 * queue.addFn(() => console.log('Delayed task'));
 * ```
 */
export class MacroTaskQueue {
  /** Array of pending tasks */
  protected stack: QueueTask[];

  /** Timer ID for scheduled flush */
  protected timerId: ReturnType<typeof setTimeout> | null;

  /** Delay in milliseconds */
  protected delay: number;

  /** Whether a flush has been scheduled */
  protected isFlushing: boolean;

  constructor(delay: number = 0) {
    this.stack = [];
    this.timerId = null;
    this.delay = delay;
    this.isFlushing = false;
  }

  /**
   * Adds a task to the queue.
   *
   * @param fn - The task function to add
   */
  addFn(fn: QueueTask): void {
    if (typeof fn !== 'function') {
      return;
    }

    this.stack.push(fn);

    // Schedule flush if not already scheduled
    if (!this.isFlushing) {
      this.isFlushing = true;
      this.timerId = setTimeout(() => this.flush(), this.delay);
    }
  }

  /**
   * Flushes all pending tasks.
   */
  flush(): void {
    // Clear timer
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    // Take a snapshot of current tasks
    const temp = this.stack.slice(0);

    // Clear the stack
    this.stack.length = 0;
    this.isFlushing = false;

    // Execute all tasks
    for (const task of temp) {
      task();
    }
  }

  /**
   * Clears all pending tasks without executing them.
   */
  clear(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stack.length = 0;
    this.isFlushing = false;
  }

  /**
   * Gets the current number of pending tasks.
   */
  get size(): number {
    return this.stack.length;
  }

  /**
   * Checks if there are pending tasks.
   */
  get pending(): boolean {
    return this.stack.length > 0;
  }
}

/**
 * Priority queue where tasks can have different priority levels.
 * Higher priority tasks are executed first.
 */
export class PriorityQueue {
  /** Tasks organized by priority level */
  protected tasks: Map<number, QueueTask[]>;

  /** Next unique ID for task ordering within same priority */
  protected nextId: number;

  /** Task metadata for ordering */
  protected taskMeta: Map<QueueTask, { id: number; priority: number }>;

  constructor() {
    this.tasks = new Map();
    this.nextId = 0;
    this.taskMeta = new Map();
  }

  /**
   * Adds a task with a specific priority.
   * Higher priority numbers are executed first.
   *
   * @param fn - The task function
   * @param priority - Priority level (default: 0)
   */
  addFn(fn: QueueTask, priority: number = 0): void {
    if (typeof fn !== 'function') {
      return;
    }

    if (!this.tasks.has(priority)) {
      this.tasks.set(priority, []);
    }

    this.tasks.get(priority)!.push(fn);
    this.taskMeta.set(fn, { id: this.nextId++, priority });
  }

  /**
   * Flushes tasks by priority (highest first).
   */
  flush(): void {
    // Get sorted priority levels (highest first)
    const priorities = Array.from(this.tasks.keys()).sort((a, b) => b - a);

    for (const priority of priorities) {
      const tasks = this.tasks.get(priority);
      if (tasks) {
        for (const task of tasks) {
          task();
        }
      }
    }

    this.clear();
  }

  /**
   * Clears all pending tasks.
   */
  clear(): void {
    this.tasks.clear();
    this.taskMeta.clear();
  }

  /**
   * Gets the current number of pending tasks.
   */
  get size(): number {
    let count = 0;
    for (const tasks of this.tasks.values()) {
      count += tasks.length;
    }
    return count;
  }

  /**
   * Checks if there are pending tasks.
   */
  get pending(): boolean {
    return this.size > 0;
  }
}
