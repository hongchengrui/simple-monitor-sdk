/**
 * Default Configuration Options
 *
 * Default values for SDK initialization options.
 * These are applied when user doesn't provide custom values.
 *
 * @module defaults
 */

/**
 * Default maximum number of breadcrumbs to keep
 */
export const DEFAULT_MAX_BREADCRUMBS = 10;

/**
 * Default minimum number of breadcrumbs to keep
 */
export const DEFAULT_MIN_BREADCRUMBS = 5;

/**
 * Default throttle delay for high-frequency events (milliseconds)
 */
export const DEFAULT_THROTTLE_DELAY = 100;

/**
 * Default debounce delay for search/input events (milliseconds)
 */
export const DEFAULT_DEBOUNCE_DELAY = 300;

/**
 * Default request timeout (milliseconds)
 */
export const DEFAULT_REQUEST_TIMEOUT = 10000;

/**
 * Default maximum number of retries for failed requests
 */
export const DEFAULT_MAX_RETRIES = 3;

/**
 * Default retry delay base (milliseconds)
 */
export const DEFAULT_RETRY_DELAY = 1000;

/**
 * Default maximum stack trace depth
 */
export const DEFAULT_MAX_STACK_DEPTH = 20;

/**
 * Default maximum error message length
 */
export const DEFAULT_MAX_ERROR_MESSAGE_LENGTH = 2048;

/**
 * Default maximum URL length to report
 */
export const DEFAULT_MAX_URL_LENGTH = 2000;

/**
 * Default maximum parameter value length
 */
export const DEFAULT_MAX_PARAM_LENGTH = 512;

/**
 * Default maximum body length to report
 */
export const DEFAULT_MAX_BODY_LENGTH = 4096;

/**
 * Default sample rate (0-1), 1 means report everything
 */
export const DEFAULT_SAMPLE_RATE = 1;

/**
 * Default before unload timeout (milliseconds)
 */
export const DEFAULT_BEFORE_UNLOAD_TIMEOUT = 5000;

/**
 * Default flush interval for batch reporting (milliseconds)
 */
export const DEFAULT_FLUSH_INTERVAL = 5000;

/**
 * Default maximum batch size for reporting
 */
export const DEFAULT_MAX_BATCH_SIZE = 10;

/**
 * Default silent mode (no console output)
 */
export const DEFAULT_SILENT_MODE = true;

/**
 * Default debug mode
 */
export const DEFAULT_DEBUG_MODE = false;

/**
 * Default enable error tracking
 */
export const DEFAULT_ENABLE_ERROR_TRACKING = true;

/**
 * Default enable performance tracking
 */
export const DEFAULT_ENABLE_PERFORMANCE_TRACKING = true;

/**
 * Default enable HTTP tracking
 */
export const DEFAULT_ENABLE_HTTP_TRACKING = true;

/**
 * Default enable user interaction tracking
 */
export const DEFAULT_ENABLE_INTERACTION_TRACKING = true;

/**
 * Default enable route change tracking
 */
export const DEFAULT_ENABLE_ROUTE_TRACKING = true;

/**
 * Default enable console tracking
 */
export const DEFAULT_ENABLE_CONSOLE_TRACKING = false;

/**
 * Default use image upload (vs XHR POST)
 */
export const DEFAULT_USE_IMAGE_UPLOAD = false;

/**
 * Default enable automatic error tracking
 */
export const DEFAULT_ENABLE_AUTO_TRACK = true;

/**
 * Default options interface (inline definition to avoid circular dependency)
 */
export interface DefaultOptions {
  maxBreadcrumbs?: number;
  throttleDelayTime?: number;
  useImageUpload?: boolean;
  enableErrorTracking?: boolean;
  enablePerformanceTracking?: boolean;
  enableHttpTracking?: boolean;
  silent?: boolean;
  debug?: boolean;
}

/**
 * Complete default options object
 */
export const DEFAULT_OPTIONS: DefaultOptions = {
  maxBreadcrumbs: DEFAULT_MAX_BREADCRUMBS,
  throttleDelayTime: DEFAULT_THROTTLE_DELAY,
  useImageUpload: DEFAULT_USE_IMAGE_UPLOAD,
  enableErrorTracking: DEFAULT_ENABLE_ERROR_TRACKING,
  enablePerformanceTracking: DEFAULT_ENABLE_PERFORMANCE_TRACKING,
  enableHttpTracking: DEFAULT_ENABLE_HTTP_TRACKING,
  silent: DEFAULT_SILENT_MODE,
  debug: DEFAULT_DEBUG_MODE,
};
