/**
 * Error Message Constants
 *
 * Standardized error messages used across the SDK.
 *
 * @module messages
 */

// ========== Initialization Errors ==========

/**
 * Error: SDK not initialized
 */
export const ERROR_NOT_INITIALIZED = 'SimpleMonitor SDK is not initialized. Call init() first.';

/**
 * Error: SDK already initialized
 */
export const ERROR_ALREADY_INITIALIZED = 'SimpleMonitor SDK is already initialized.';

/**
 * Error: Invalid DSN provided
 */
export const ERROR_INVALID_DSN = 'Invalid DSN provided. DSN must be a valid URL.';

/**
 * Error: Missing required option
 */
export const ERROR_MISSING_REQUIRED_OPTION = 'Missing required option: ';

/**
 * Error: Invalid option type
 */
export const ERROR_INVALID_OPTION_TYPE = 'Invalid type for option: ';

// ========== Configuration Errors ==========

/**
 * Error: Invalid configuration
 */
export const ERROR_INVALID_CONFIG = 'Invalid SDK configuration.';

/**
 * Error: Configuration parse failed
 */
export const ERROR_CONFIG_PARSE_FAILED = 'Failed to parse SDK configuration.';

/**
 * Error: Sample rate out of range
 */
export const ERROR_SAMPLE_RATE_OUT_OF_RANGE = 'Sample rate must be between 0 and 1.';

// ========== Upload Errors ==========

/**
 * Error: Upload failed
 */
export const ERROR_UPLOAD_FAILED = 'Failed to upload data to server.';

/**
 * Error: Network error
 */
export const ERROR_NETWORK_ERROR = 'Network error occurred.';

/**
 * Error: Request timeout
 */
export const ERROR_REQUEST_TIMEOUT = 'Request timed out.';

/**
 * Error: Server responded with error
 */
export const ERROR_SERVER_ERROR = 'Server responded with error.';

/**
 * Error: Rate limited
 */
export const ERROR_RATE_LIMITED = 'Request rate limited.';

/**
 * Error: Payload too large
 */
export const ERROR_PAYLOAD_TOO_LARGE = 'Upload payload too large.';

/**
 * Error: Unauthorized
 */
export const ERROR_UNAUTHORIZED = 'Unauthorized access. Check your API key.';

// ========== Data Processing Errors ==========

/**
 * Error: Invalid data format
 */
export const ERROR_INVALID_DATA_FORMAT = 'Invalid data format.';

/**
 * Error: Missing required field
 */
export const ERROR_MISSING_REQUIRED_FIELD = 'Missing required field: ';

/**
 * Error: Data transformation failed
 */
export const ERROR_TRANSFORM_FAILED = 'Failed to transform data.';

/**
 * Error: Data serialization failed
 */
export const ERROR_SERIALIZATION_FAILED = 'Failed to serialize data.';

/**
 * Error: Stack trace parsing failed
 */
export const ERROR_STACK_PARSE_FAILED = 'Failed to parse stack trace.';

// ========== Breadcrumb Errors ==========

/**
 * Error: Breadcrumb limit exceeded
 */
export const ERROR_BREADCRUMB_LIMIT_EXCEEDED = 'Breadcrumb limit exceeded.';

/**
 * Error: Invalid breadcrumb data
 */
export const ERROR_INVALID_BREADCRUMB = 'Invalid breadcrumb data.';

// ========== Event Handling Errors ==========

/**
 * Error: Event handler not found
 */
export const ERROR_HANDLER_NOT_FOUND = 'Event handler not found: ';

/**
 * Error: Event handler registration failed
 */
export const ERROR_HANDLER_REGISTRATION_FAILED = 'Failed to register event handler.';

/**
 * Error: Event type not supported
 */
export const ERROR_EVENT_TYPE_NOT_SUPPORTED = 'Event type not supported: ';

/**
 * Error: Too many event handlers
 */
export const ERROR_TOO_MANY_HANDLERS = 'Too many event handlers registered.';

// ========== Performance Errors ==========

/**
 * Error: Performance API not supported
 */
export const ERROR_PERFORMANCE_NOT_SUPPORTED = 'Performance API not supported in this environment.';

/**
 * Error: Performance entry not found
 */
export const ERROR_PERFORMANCE_ENTRY_NOT_FOUND = 'Performance entry not found: ';

/**
 * Error: Performance timing invalid
 */
export const ERROR_PERFORMANCE_TIMING_INVALID = 'Invalid performance timing data.';

// ========== Interceptor Errors ==========

/**
 * Error: Method replacement failed
 */
export const ERROR_METHOD_REPLACEMENT_FAILED = 'Failed to replace method: ';

/**
 * Error: Method not found
 */
export const ERROR_METHOD_NOT_FOUND = 'Method not found: ';

/**
 * Error: Method already replaced
 */
export const ERROR_METHOD_ALREADY_REPLACED = 'Method already replaced: ';

// ========== Queue Errors ==========

/**
 * Error: Queue is full
 */
export const ERROR_QUEUE_FULL = 'Event queue is full.';

/**
 * Error: Queue flush failed
 */
export const ERROR_QUEUE_FLUSH_FAILED = 'Failed to flush event queue.';

/**
 * Error: Queue processing error
 */
export const ERROR_QUEUE_PROCESSING_ERROR = 'Error processing queued events.';

// ========== Storage Errors ==========

/**
 * Error: Storage not available
 */
export const ERROR_STORAGE_NOT_AVAILABLE = 'Storage not available in this environment.';

/**
 * Error: Storage quota exceeded
 */
export const ERROR_STORAGE_QUOTA_EXCEEDED = 'Storage quota exceeded.';

/**
 * Error: Storage access denied
 */
export const ERROR_STORAGE_ACCESS_DENIED = 'Storage access denied.';

/**
 * Error: Storage read failed
 */
export const ERROR_STORAGE_READ_FAILED = 'Failed to read from storage.';

/**
 * Error: Storage write failed
 */
export const ERROR_STORAGE_WRITE_FAILED = 'Failed to write to storage.';

// ========== Validation Errors ==========

/**
 * Error: Invalid URL
 */
export const ERROR_INVALID_URL = 'Invalid URL: ';

/**
 * Error: Invalid timestamp
 */
export const ERROR_INVALID_TIMESTAMP = 'Invalid timestamp: ';

/**
 * Error: Invalid user ID
 */
export const ERROR_INVALID_USER_ID = 'Invalid user ID.';

/**
 * Error: Invalid tracker ID
 */
export const ERROR_INVALID_TRACKER_ID = 'Invalid tracker ID.';

// ========== Warning Messages ==========

/**
 * Warning: Debug mode enabled
 */
export const WARNING_DEBUG_MODE = 'SimpleMonitor debug mode is enabled.';

/**
 * Warning: Deprecation notice
 */
export const WARNING_DEPRECATED = 'Feature is deprecated and will be removed in a future version: ';

/**
 * Warning: Silent mode enabled
 */
export const WARNING_SILENT_MODE = 'SimpleMonitor is running in silent mode.';

/**
 * Warning: Sample rate will drop data
 */
export const WARNING_SAMPLE_RATE = 'Sample rate is less than 1, some data will be dropped.';

/**
 * Warning: Auto-track disabled
 */
export const WARNING_AUTO_TRACK_DISABLED = 'Automatic tracking is disabled.';

/**
 * Warning: Feature not supported
 */
export const WARNING_FEATURE_NOT_SUPPORTED = 'Feature not supported in current environment: ';

// ========== Info Messages ==========

/**
 * Info: SDK initialized
 */
export const INFO_SDK_INITIALIZED = 'SimpleMonitor SDK initialized successfully.';

/**
 * Info: SDK destroyed
 */
export const INFO_SDK_DESTROYED = 'SimpleMonitor SDK destroyed.';

/**
 * Info: Data uploaded
 */
export const INFO_DATA_UPLOADED = 'Data uploaded successfully.';

/**
 * Info: Event captured
 */
export const INFO_EVENT_CAPTURED = 'Event captured: ';

/**
 * Info: User identified
 */
export const INFO_USER_IDENTIFIED = 'User identified: ';

/**
 * Info: Session started
 */
export const INFO_SESSION_STARTED = 'Session started.';

/**
 * Info: Session ended
 */
export const INFO_SESSION_ENDED = 'Session ended.';

// ========== Error Categories ==========

/**
 * Error category: Initialization
 */
export const ERROR_CATEGORY_INIT = 'init';

/**
 * Error category: Configuration
 */
export const ERROR_CATEGORY_CONFIG = 'config';

/**
 * Error category: Network
 */
export const ERROR_CATEGORY_NETWORK = 'network';

/**
 * Error category: Data
 */
export const ERROR_CATEGORY_DATA = 'data';

/**
 * Error category: Validation
 */
export const ERROR_CATEGORY_VALIDATION = 'validation';

/**
 * Error category: Storage
 */
export const ERROR_CATEGORY_STORAGE = 'storage';

/**
 * Error category: Performance
 */
export const ERROR_CATEGORY_PERFORMANCE = 'performance';

/**
 * Error category: Unknown
 */
export const ERROR_CATEGORY_UNKNOWN = 'unknown';
