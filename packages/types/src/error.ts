/**
 * Error Type Enums
 * Defines all error classification types used across the SDK
 */

/**
 * Error severity levels
 */
export enum Severity {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Fatal = 'fatal',
}

/**
 * Error types classification
 */
export enum ErrorTypes {
  /** JavaScript runtime errors (caught via window.onerror) */
  JAVASCRIPT_ERROR = 'javascript',

  /** Promise rejection errors (caught via unhandledrejection) */
  PROMISE_ERROR = 'promise',

  /** HTTP request errors (XHR/Fetch) */
  HTTP_ERROR = 'http',

  /** Resource loading errors (script, style, image, etc.) */
  RESOURCE_ERROR = 'resource',

  /** Custom/Manual error reporting */
  CUSTOM_ERROR = 'custom',
}

/**
 * Console log types for monitoring
 */
export enum ConsoleTypes {
  Log = 'log',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Debug = 'debug',
}

/**
 * Stack frame structure for error parsing
 */
export interface StackFrame {
  /** File URL where the error occurred */
  url: string;

  /** Function name */
  func: string;

  /** Function arguments */
  args: any[];

  /** Line number (1-indexed) */
  line: number;

  /** Column number (1-indexed) */
  col: number;
}

/**
 * Error data structure for reporting
 */
export interface ErrorData {
  /** Error type classification */
  type: ErrorTypes;

  /** Error severity level */
  level: Severity;

  /** Error message */
  message: string;

  /** Error name/type (e.g., TypeError, ReferenceError) */
  name?: string;

  /** Current page URL */
  url: string;

  /** Timestamp when error occurred */
  time: number;

  /** Parsed stack frames */
  stack?: StackFrame[];

  /** Additional custom data */
  extra?: Record<string, any>;

  /** User ID (optional, from trackerId) */
  userId?: string | number;
}
