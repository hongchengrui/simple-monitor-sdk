/**
 * Throttle and Debounce Utilities
 *
 * Provides function throttling and debouncing capabilities.
 * Useful for controlling high-frequency events like clicks, scroll, resize, etc.
 *
 * @module throttle
 */

/**
 * Result type for throttled/debounced functions
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
}

/**
 * Creates a throttled version of the provided function.
 * The throttled function will only invoke the original function at most once
 * per specified time period.
 *
 * @param fn - The function to throttle
 * @param delay - The minimum time between invocations in milliseconds
 * @returns Throttled function with cancel and flush methods
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll handler');
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 * // Will only log once per 100ms max
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ThrottledFunction<T> {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let pendingResult: ReturnType<T> | undefined;

  const throttled = function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    lastArgs = args;
    lastThis = this;

    if (timeSinceLastCall >= delay) {
      // Enough time has passed, execute immediately
      lastCall = now;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      pendingResult = fn.apply(this, args);
      return pendingResult;
    } else if (!timeoutId) {
      // Schedule execution for end of delay period
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        if (lastArgs) {
          pendingResult = fn.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, delay - timeSinceLastCall);
    }

    return pendingResult;
  } as ThrottledFunction<T>;

  // Cancel pending execution
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  // Execute any pending call immediately
  throttled.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastCall = Date.now();
      const result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
      return result;
    }
    return pendingResult;
  };

  return throttled;
}

/**
 * Creates a debounced version of the provided function.
 * The debounced function will delay invocation until after the specified
 * wait time has elapsed since the last call.
 *
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @param immediate - Whether to invoke on the leading edge instead of trailing
 * @returns Debounced function with cancel and flush methods
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   fetchResults(query);
 * }, 300);
 *
 * inputElement.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value);
 * });
 * // Will only fetch 300ms after user stops typing
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate = false,
): ThrottledFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let pendingResult: ReturnType<T> | undefined;
  let hasExecuted = false;

  const debounced = function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const later = () => {
      timeoutId = null;
      if (!immediate && lastArgs && !hasExecuted) {
        pendingResult = fn.apply(lastThis, lastArgs);
      }
      lastArgs = null;
      lastThis = null;
      hasExecuted = false;
    };

    lastArgs = args;
    lastThis = this;

    if (immediate && !timeoutId && !hasExecuted) {
      hasExecuted = true;
      pendingResult = fn.apply(this, args);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, delay);

    return pendingResult;
  } as ThrottledFunction<T>;

  // Cancel pending execution
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
    hasExecuted = false;
  };

  // Execute any pending call immediately
  debounced.flush = () => {
    if (timeoutId && lastArgs && !hasExecuted) {
      clearTimeout(timeoutId);
      timeoutId = null;
      hasExecuted = true;
      const result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
      return result;
    }
    return pendingResult;
  };

  return debounced;
}

/**
 * Creates a function that will only execute once per unique key.
 * Useful for preventing duplicate work with the same input.
 *
 * @param fn - The function to memoize by key
 * @param keyFn - Function to extract the key from arguments
 * @returns Memoized function
 */
export function distinctByKey<T extends (...args: any[]) => any>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string | number,
): T {
  const seenKeys = new Set<string | number>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const key = keyFn(...args);

    if (seenKeys.has(key)) {
      return undefined;
    }

    seenKeys.add(key);

    // Clean up keys after a reasonable time to prevent memory leaks
    if (seenKeys.size > 1000) {
      seenKeys.clear();
    }

    return fn.apply(this, args);
  } as T;
}
