/**
 * Global Configuration Constants
 *
 * Global constants used across the SDK configuration.
 *
 * @module config
 */

/**
 * Default DSN (Data Source Name) placeholder
 */
export const DEFAULT_DSN = '';

/**
 * Default track DSN placeholder
 */
export const DEFAULT_TRACK_DSN = '';

/**
 * Default API key placeholder
 */
export const DEFAULT_API_KEY = '';

/**
 * Default track key placeholder
 */
export const DEFAULT_TRACK_KEY = '';

/**
 * Maximum number of events to queue before forcing a flush
 */
export const MAX_QUEUE_SIZE = 100;

/**
 * Maximum number of breadcrumbs to store
 */
export const MAX_BREADCRUMB_LIMIT = 50;

/**
 * Maximum number of stack frames to capture
 */
export const MAX_STACK_FRAMES = 50;

/**
 * Maximum number of event handlers per event type
 */
export const MAX_HANDLERS_PER_EVENT = 100;

/**
 * Maximum retry attempts for failed uploads
 */
export const MAX_UPLOAD_RETRIES = 3;

/**
 * Maximum size of upload payload in bytes (roughly 5MB)
 */
export const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024;

/**
 * Minimum interval between auto-flushes (milliseconds)
 */
export const MIN_FLUSH_INTERVAL = 1000;

/**
 * Maximum interval between auto-flushes (milliseconds)
 */
export const MAX_FLUSH_INTERVAL = 60000;

/**
 * Page visibility change debounce time (milliseconds)
 */
export const VISIBILITY_CHANGE_DEBOUNCE = 250;

/**
 * Click event debounce time (milliseconds)
 */
export const CLICK_DEBOUNCE_TIME = 500;

/**
 * Scroll throttle time (milliseconds)
 */
export const SCROLL_THROTTLE_TIME = 200;

/**
 * Resize throttle time (milliseconds)
 */
export const RESIZE_THROTTLE_TIME = 200;

/**
 * Maximum length for console message logging
 */
export const MAX_CONSOLE_MESSAGE_LENGTH = 10000;

/**
 * Maximum number of console history entries to keep
 */
export const MAX_CONSOLE_HISTORY = 50;

/**
 * Maximum number of performance entries to collect
 */
export const MAX_PERFORMANCE_ENTRIES = 100;

/**
 * Maximum number of resource timing entries to collect
 */
export const MAX_RESOURCE_ENTRIES = 100;

/**
 * Default timeout for page load performance collection (milliseconds)
 */
export const PAGE_LOAD_TIMEOUT = 10000;

/**
 * Default timeout for resource timing collection (milliseconds)
 */
export const RESOURCE_TIMING_TIMEOUT = 5000;

/**
 * Maximum URL length for reporting
 */
export const MAX_URL_LENGTH = 2000;

/**
 * Maximum query string length for reporting
 */
export const MAX_QUERY_STRING_LENGTH = 500;

/**
 * Truncation indicator for truncated values
 */
export const TRUNCATION_INDICATOR = '...';

/**
 * Mask for sensitive data in headers
 */
export const SENSITIVE_HEADER_MASK = '[REDACTED]';

/**
 * List of sensitive HTTP headers that should be masked
 */
export const SENSITIVE_HEADERS: readonly string[] = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-csrf-token',
  'x-xsrf-token',
] as const;

/**
 * List of sensitive query parameters that should be masked
 */
export const SENSITIVE_QUERY_PARAMS: readonly string[] = [
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'access_token',
  'refresh_token',
  'session_token',
  'auth',
] as const;

/**
 * User-agent strings to identify as
 */
export const USER_AGENTS = {
  DEFAULT: 'SimpleMonitor/1.0',
  JAVA: 'SimpleMonitor-Java/1.0',
  NODE: 'SimpleMonitor-Node/1.0',
  PYTHON: 'SimpleMonitor-Python/1.0',
  PHP: 'SimpleMonitor-PHP/1.0',
  RUBY: 'SimpleMonitor-Ruby/1.0',
  GO: 'SimpleMonitor-Go/1.0',
} as const;

/**
 * Content type headers
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  MULTIPART_FORM_DATA: 'multipart/form-data',
  TEXT_PLAIN: 'text/plain',
  OCTET_STREAM: 'application/octet-stream',
} as const;

/**
 * HTTP method constants
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  CONNECT: 'CONNECT',
  TRACE: 'TRACE',
} as const;

/**
 * Request header names
 */
export const HEADERS = {
  ACCEPT: 'Accept',
  ACCEPT_ENCODING: 'Accept-Encoding',
  ACCEPT_LANGUAGE: 'Accept-Language',
  AUTHORIZATION: 'Authorization',
  CONNECTION: 'Connection',
  CONTENT_ENCODING: 'Content-Encoding',
  CONTENT_LENGTH: 'Content-Length',
  CONTENT_TYPE: 'Content-Type',
  COOKIE: 'Cookie',
  HOST: 'Host',
  ORIGIN: 'Origin',
  REFERER: 'Referer',
  USER_AGENT: 'User-Agent',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_MONITOR_SDK: 'X-Monitor-SDK',
} as const;
