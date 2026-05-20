/**
 * Time Utilities
 *
 * Provides utilities for working with timestamps and time formatting.
 *
 * @module time
 */

/**
 * Gets the current timestamp in milliseconds.
 * Uses performance.now() if available for sub-millisecond precision,
 * otherwise falls back to Date.now().
 *
 * @returns Current timestamp in milliseconds
 */
export function getTimestamp(): number {
  // Use performance.now() for high precision when available
  if (typeof performance !== 'undefined' && performance.now) {
    // performance.now() returns time since navigation start
    // Add performance.timeOrigin for absolute timestamp
    if (performance.timeOrigin) {
      return performance.timeOrigin + performance.now();
    }
    // Fallback: just use Date.now()
  }

  return Date.now();
}

/**
 * Gets the current timestamp in seconds.
 *
 * @returns Current timestamp in seconds
 */
export function getTimestampInSeconds(): number {
  return Math.floor(getTimestamp() / 1000);
}

/**
 * Formats a timestamp into a readable date string.
 *
 * @param timestamp - Timestamp in milliseconds
 * @param format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string
 */
export function formatTimestamp(
  timestamp: number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', ms);
}

/**
 * Formats milliseconds into a human-readable duration string.
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string (e.g., "1h 23m 45s 678ms")
 */
export function formatDuration(ms: number): string {
  const parts: string[] = [];

  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }
  if (milliseconds > 0 && parts.length <= 2) {
    parts.push(`${milliseconds}ms`);
  }

  return parts.join(' ') || '0ms';
}

/**
 * Calculates the time difference between two timestamps.
 *
 * @param start - Start timestamp in milliseconds
 * @param end - End timestamp in milliseconds (default: current time)
 * @returns Time difference in milliseconds
 */
export function getTimeDiff(start: number, end: number = getTimestamp()): number {
  return end - start;
}

/**
 * Converts milliseconds to seconds.
 *
 * @param ms - Milliseconds
 * @returns Seconds
 */
export function msToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * Converts seconds to milliseconds.
 *
 * @param seconds - Seconds
 * @returns Milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Converts milliseconds to minutes.
 *
 * @param ms - Milliseconds
 * @returns Minutes
 */
export function msToMinutes(ms: number): number {
  return ms / 60000;
}

/**
 * Converts minutes to milliseconds.
 *
 * @param minutes - Minutes
 * @returns Milliseconds
 */
export function minutesToMs(minutes: number): number {
  return minutes * 60000;
}

/**
 * Creates a timestamp generator that returns monotonically increasing values.
 * Useful for creating unique, ordered IDs.
 *
 * @returns A function that returns the next timestamp
 */
export function createTimestampGenerator(): () => number {
  let lastTime = getTimestamp();

  return () => {
    const now = getTimestamp();
    // Ensure timestamps are monotonically increasing
    lastTime = Math.max(lastTime + 1, now);
    return lastTime;
  };
}

/**
 * Measures the execution time of a synchronous function.
 *
 * @param fn - The function to measure
 * @returns Object containing result and execution time
 */
export function measureTime<T>(fn: () => T): { result: T; duration: number } {
  const start = getTimestamp();
  const result = fn();
  const duration = getTimeDiff(start);

  return { result, duration };
}

/**
 * Creates an async version of measureTime.
 *
 * @param fn - The async function to measure
 * @returns Promise resolving to result and execution time
 */
export async function measureTimeAsync<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; duration: number }> {
  const start = getTimestamp();
  const result = await fn();
  const duration = getTimeDiff(start);

  return { result, duration };
}

/**
 * Debounces a function based on time instead of call count.
 * Similar to debounce from throttle.ts but time-focused.
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function delayExecution<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Creates a function that executes after a minimum delay,
 * useful for ensuring loading states are visible.
 *
 * @param fn - The function to wrap
 * @param minDelay - Minimum delay in milliseconds
 * @returns Wrapped function
 */
export function withMinDelay<T extends (...args: any[]) => any>(
  fn: T,
  minDelay: number,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    const start = getTimestamp();

    const result = fn.apply(this, args);

    // Handle both sync and async functions
    const executeDelay = (value: any) => {
      const elapsed = getTimeDiff(start);
      const remaining = Math.max(0, minDelay - elapsed);

      if (remaining > 0) {
        return new Promise((resolve) => setTimeout(() => resolve(value), remaining));
      }
      return value;
    };

    // Convert result to Promise if it isn't already
    return Promise.resolve(result).then(executeDelay);
  } as any;
}

/**
 * Checks if a timestamp is within a recent time window.
 *
 * @param timestamp - Timestamp to check
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if timestamp is within the window
 */
export function isRecent(timestamp: number, windowMs: number = 60000): boolean {
  const now = getTimestamp();
  const diff = now - timestamp;
  return diff >= 0 && diff <= windowMs;
}

/**
 * Parses an ISO 8601 date string into a timestamp.
 *
 * @param isoString - ISO 8601 date string
 * @returns Timestamp in milliseconds, or NaN if invalid
 */
export function parseISOToTimestamp(isoString: string): number {
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? NaN : date.getTime();
}

/**
 * Formats a timestamp as ISO 8601 string.
 *
 * @param timestamp - Timestamp in milliseconds
 * @returns ISO 8601 formatted string
 */
export function toISO(timestamp: number = getTimestamp()): string {
  return new Date(timestamp).toISOString();
}

/**
 * Gets the current date and time as an ISO string.
 *
 * @returns Current ISO 8601 formatted datetime
 */
export function getCurrentISO(): string {
  return toISO(getTimestamp());
}

/**
 * Time zone utilities.
 */
export const TimeZone = {
  /**
   * Gets the timezone offset in minutes.
   */
  getOffset(): number {
    return new Date().getTimezoneOffset();
  },

  /**
   * Gets the timezone offset in milliseconds.
   */
  getOffsetMs(): number {
    return this.getOffset() * 60000;
  },

  /**
   * Formats a timezone offset as ±HH:mm.
   */
  formatOffset(): string {
    const offset = Math.abs(this.getOffset());
    const hours = Math.floor(offset / 60);
    const minutes = offset % 60;
    const sign = this.getOffset() <= 0 ? '+' : '-';
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  },
};
