/**
 * Error Capture Utilities
 *
 * Provides utilities for safe error handling and catching.
 * Ensures monitoring code errors don't affect user applications.
 *
 * @module error-catch
 */

/**
 * Error handler callback type.
 */
export type ErrorHandler = (error: Error) => void;

/**
 * Safely executes a function with try-catch.
 * If an error occurs, the error handler is called instead of throwing.
 *
 * @param fn - The function to execute
 * @param errorFn - Optional error handler callback
 * @returns The function result or undefined if error occurred
 *
 * @example
 * ```ts
 * nativeTryCatch(
 *   () => JSON.parse(invalidString),
 *   (error) => console.error('Parse failed:', error)
 * );
 * ```
 */
export function nativeTryCatch<T>(
  fn: () => T,
  errorFn?: ErrorHandler,
): T | undefined {
  try {
    return fn();
  } catch (err) {
    if (errorFn) {
      errorFn(err instanceof Error ? err : new Error(String(err)));
    }
    return undefined;
  }
}

/**
 * Safely executes an async function with try-catch.
 *
 * @param fn - The async function to execute
 * @param errorFn - Optional error handler callback
 * @returns Promise that resolves to the result or undefined if error occurred
 */
export async function nativeTryCatchAsync<T>(
  fn: () => Promise<T>,
  errorFn?: ErrorHandler,
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (err) {
    if (errorFn) {
      errorFn(err instanceof Error ? err : new Error(String(err)));
    }
    return undefined;
  }
}

/**
 * Wraps a function with automatic error handling.
 * The wrapped function will never throw; errors are passed to the handler.
 *
 * @param fn - The function to wrap
 * @param errorFn - Optional error handler callback
 * @returns Wrapped function that catches errors
 *
 * @example
 * ```ts
 * const safeParse = safeWrap((str: string) => JSON.parse(str));
 *
 * const result = safeParse('{ invalid }');
 * // Returns undefined instead of throwing
 * ```
 */
export function safeWrap<T extends (...args: any[]) => any>(
  fn: T,
  errorFn?: ErrorHandler,
): T {
  return (function (this: any, ...args: any[]) {
    return nativeTryCatch(() => fn.apply(this, args), errorFn);
  }) as T;
}

/**
 * Wraps an async function with automatic error handling.
 *
 * @param fn - The async function to wrap
 * @param errorFn - Optional error handler callback
 * @returns Wrapped async function that catches errors
 */
export function safeWrapAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorFn?: ErrorHandler,
): T {
  return (function (this: any, ...args: any[]) {
    return nativeTryCatchAsync(() => fn.apply(this, args), errorFn);
  }) as T;
}

/**
 * Executes multiple functions safely, continuing even if one fails.
 *
 * @param fns - Array of functions to execute
 * @param errorFn - Optional error handler callback
 * @returns Array of results (undefined for failed functions)
 */
export function safeForEach<T>(
  fns: Array<() => T>,
  errorFn?: ErrorHandler,
): Array<T | undefined> {
  const results: Array<T | undefined> = [];

  for (const fn of fns) {
    results.push(nativeTryCatch(fn, errorFn));
  }

  return results;
}

/**
 * Executes multiple async functions safely, continuing even if one fails.
 *
 * @param fns - Array of async functions to execute
 * @param errorFn - Optional error handler callback
 * @returns Promise resolving to array of results
 */
export async function safeForEachAsync<T>(
  fns: Array<() => Promise<T>>,
  errorFn?: ErrorHandler,
): Promise<Array<T | undefined>> {
  const results: Array<T | undefined> = [];

  for (const fn of fns) {
    results.push(await nativeTryCatchAsync(fn, errorFn));
  }

  return results;
}

/**
 * Executes functions in sequence, stopping at first error.
 *
 * @param fns - Array of functions to execute in sequence
 * @param errorFn - Optional error handler callback
 * @returns Last successful result or undefined
 */
export function safeSequence<T>(
  fns: Array<() => T>,
  errorFn?: ErrorHandler,
): T | undefined {
  let lastResult: T | undefined = undefined;

  for (const fn of fns) {
    const result = nativeTryCatch(fn, errorFn);
    if (result === undefined && errorFn) {
      // An error occurred (assuming undefined indicates error)
      // Note: This is a simplification; real implementation needs better error tracking
      break;
    }
    lastResult = result;
  }

  return lastResult;
}

/**
 * Executes async functions in sequence, stopping at first error.
 *
 * @param fns - Array of async functions to execute in sequence
 * @param errorFn - Optional error handler callback
 * @returns Promise resolving to last successful result or undefined
 */
export async function safeSequenceAsync<T>(
  fns: Array<() => Promise<T>>,
  errorFn?: ErrorHandler,
): Promise<T | undefined> {
  let lastResult: T | undefined = undefined;

  for (const fn of fns) {
    const result = await nativeTryCatchAsync(fn, errorFn);
    if (result === undefined) {
      break;
    }
    lastResult = result;
  }

  return lastResult;
}

/**
 * Silently executes a function, suppressing all errors.
 * Useful for fire-and-forget operations where errors don't matter.
 *
 * @param fn - The function to execute
 * @returns The function result or undefined if error occurred
 */
export function silent<T>(fn: () => T): T | undefined {
  return nativeTryCatch(fn);
}

/**
 * Silently executes an async function.
 *
 * @param fn - The async function to execute
 * @returns Promise that resolves to the result or undefined
 */
export function silentAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
  return nativeTryCatchAsync(fn);
}

/**
 * Executes a function with a timeout.
 * If the function doesn't complete within the timeout, it's rejected.
 *
 * @param fn - The function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @param timeoutMessage - Error message on timeout
 * @returns Promise that resolves or rejects on timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out',
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs),
    ),
  ]);
}

/**
 * Retries a function on failure with exponential backoff.
 *
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param baseDelay - Base delay in milliseconds (default: 100)
 * @param errorFn - Optional error handler for final failure
 * @returns Promise that resolves to the result or rejects after all retries
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 100,
  errorFn?: ErrorHandler,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  if (errorFn && lastError) {
    errorFn(lastError);
  }

  throw lastError || new Error('Retry operation failed');
}

/**
 * Creates a fallback chain that tries each function until one succeeds.
 *
 * @param fns - Array of functions to try in order
 * @returns A function that tries each function until success
 */
export function fallbackChain<T extends (...args: any[]) => any>(
  ...fns: T[]
): T {
  return (function (this: any, ...args: any[]) {
    for (const fn of fns) {
      const result = nativeTryCatch(() => fn.apply(this, args));
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }) as T;
}

/**
 * Error boundary class that catches errors in its scope.
 * Useful for isolating error-prone code.
 */
export class ErrorBoundary {
  private handlers: ErrorHandler[] = [];

  /**
   * Registers an error handler.
   */
  onError(handler: ErrorHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Removes an error handler.
   */
  offError(handler: ErrorHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  /**
   * Executes a function within this boundary.
   */
  execute<T>(fn: () => T): T | undefined {
    return nativeTryCatch(fn, (error) => {
      this.notifyHandlers(error);
    });
  }

  /**
   * Executes an async function within this boundary.
   */
  async executeAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
    return nativeTryCatchAsync(fn, (error) => {
      this.notifyHandlers(error);
    });
  }

  /**
   * Notifies all registered error handlers.
   */
  private notifyHandlers(error: Error): void {
    for (const handler of this.handlers) {
      nativeTryCatch(() => handler(error));
    }
  }
}

/**
 * Creates a new error boundary instance.
 */
export function createErrorBoundary(): ErrorBoundary {
  return new ErrorBoundary();
}
