/**
 * HTTP Status Code Constants
 *
 * Constants for HTTP status codes and their categories.
 *
 * @module http-status
 */

// ========== 1xx Informational ==========

/**
 * HTTP 100 Continue
 */
export const HTTP_STATUS_CONTINUE = 100;

/**
 * HTTP 101 Switching Protocols
 */
export const HTTP_STATUS_SWITCHING_PROTOCOLS = 101;

/**
 * HTTP 102 Processing
 */
export const HTTP_STATUS_PROCESSING = 102;

/**
 * HTTP 103 Early Hints
 */
export const HTTP_STATUS_EARLY_HINTS = 103;

// ========== 2xx Success ==========

/**
 * HTTP 200 OK
 */
export const HTTP_STATUS_OK = 200;

/**
 * HTTP 201 Created
 */
export const HTTP_STATUS_CREATED = 201;

/**
 * HTTP 202 Accepted
 */
export const HTTP_STATUS_ACCEPTED = 202;

/**
 * HTTP 203 Non-Authoritative Information
 */
export const HTTP_STATUS_NON_AUTHORITATIVE_INFO = 203;

/**
 * HTTP 204 No Content
 */
export const HTTP_STATUS_NO_CONTENT = 204;

/**
 * HTTP 205 Reset Content
 */
export const HTTP_STATUS_RESET_CONTENT = 205;

/**
 * HTTP 206 Partial Content
 */
export const HTTP_STATUS_PARTIAL_CONTENT = 206;

// ========== 3xx Redirection ==========

/**
 * HTTP 300 Multiple Choices
 */
export const HTTP_STATUS_MULTIPLE_CHOICES = 300;

/**
 * HTTP 301 Moved Permanently
 */
export const HTTP_STATUS_MOVED_PERMANENTLY = 301;

/**
 * HTTP 302 Found
 */
export const HTTP_STATUS_FOUND = 302;

/**
 * HTTP 303 See Other
 */
export const HTTP_STATUS_SEE_OTHER = 303;

/**
 * HTTP 304 Not Modified
 */
export const HTTP_STATUS_NOT_MODIFIED = 304;

/**
 * HTTP 307 Temporary Redirect
 */
export const HTTP_STATUS_TEMPORARY_REDIRECT = 307;

/**
 * HTTP 308 Permanent Redirect
 */
export const HTTP_STATUS_PERMANENT_REDIRECT = 308;

// ========== 4xx Client Error ==========

/**
 * HTTP 400 Bad Request
 */
export const HTTP_STATUS_BAD_REQUEST = 400;

/**
 * HTTP 401 Unauthorized
 */
export const HTTP_STATUS_UNAUTHORIZED = 401;

/**
 * HTTP 402 Payment Required
 */
export const HTTP_STATUS_PAYMENT_REQUIRED = 402;

/**
 * HTTP 403 Forbidden
 */
export const HTTP_STATUS_FORBIDDEN = 403;

/**
 * HTTP 404 Not Found
 */
export const HTTP_STATUS_NOT_FOUND = 404;

/**
 * HTTP 405 Method Not Allowed
 */
export const HTTP_STATUS_METHOD_NOT_ALLOWED = 405;

/**
 * HTTP 406 Not Acceptable
 */
export const HTTP_STATUS_NOT_ACCEPTABLE = 406;

/**
 * HTTP 407 Proxy Authentication Required
 */
export const HTTP_STATUS_PROXY_AUTH_REQUIRED = 407;

/**
 * HTTP 408 Request Timeout
 */
export const HTTP_STATUS_REQUEST_TIMEOUT = 408;

/**
 * HTTP 409 Conflict
 */
export const HTTP_STATUS_CONFLICT = 409;

/**
 * HTTP 410 Gone
 */
export const HTTP_STATUS_GONE = 410;

/**
 * HTTP 411 Length Required
 */
export const HTTP_STATUS_LENGTH_REQUIRED = 411;

/**
 * HTTP 412 Precondition Failed
 */
export const HTTP_STATUS_PRECONDITION_FAILED = 412;

/**
 * HTTP 413 Payload Too Large
 */
export const HTTP_STATUS_PAYLOAD_TOO_LARGE = 413;

/**
 * HTTP 414 URI Too Long
 */
export const HTTP_STATUS_URI_TOO_LONG = 414;

/**
 * HTTP 415 Unsupported Media Type
 */
export const HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE = 415;

/**
 * HTTP 416 Range Not Satisfiable
 */
export const HTTP_STATUS_RANGE_NOT_SATISFIABLE = 416;

/**
 * HTTP 417 Expectation Failed
 */
export const HTTP_STATUS_EXPECTATION_FAILED = 417;

/**
 * HTTP 418 I'm a teapot
 */
export const HTTP_STATUS_IM_A_TEAPOT = 418;

/**
 * HTTP 422 Unprocessable Entity
 */
export const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

/**
 * HTTP 423 Locked
 */
export const HTTP_STATUS_LOCKED = 423;

/**
 * HTTP 424 Failed Dependency
 */
export const HTTP_STATUS_FAILED_DEPENDENCY = 424;

/**
 * HTTP 425 Too Early
 */
export const HTTP_STATUS_TOO_EARLY = 425;

/**
 * HTTP 426 Upgrade Required
 */
export const HTTP_STATUS_UPGRADE_REQUIRED = 426;

/**
 * HTTP 428 Precondition Required
 */
export const HTTP_STATUS_PRECONDITION_REQUIRED = 428;

/**
 * HTTP 429 Too Many Requests
 */
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429;

// ========== 5xx Server Error ==========

/**
 * HTTP 500 Internal Server Error
 */
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

/**
 * HTTP 501 Not Implemented
 */
export const HTTP_STATUS_NOT_IMPLEMENTED = 501;

/**
 * HTTP 502 Bad Gateway
 */
export const HTTP_STATUS_BAD_GATEWAY = 502;

/**
 * HTTP 503 Service Unavailable
 */
export const HTTP_STATUS_SERVICE_UNAVAILABLE = 503;

/**
 * HTTP 504 Gateway Timeout
 */
export const HTTP_STATUS_GATEWAY_TIMEOUT = 504;

/**
 * HTTP 505 HTTP Version Not Supported
 */
export const HTTP_STATUS_HTTP_VERSION_NOT_SUPPORTED = 505;

/**
 * HTTP 506 Variant Also Negotiates
 */
export const HTTP_STATUS_VARIANT_ALSO_NEGOTIATES = 506;

/**
 * HTTP 507 Insufficient Storage
 */
export const HTTP_STATUS_INSUFFICIENT_STORAGE = 507;

/**
 * HTTP 508 Loop Detected
 */
export const HTTP_STATUS_LOOP_DETECTED = 508;

/**
 * HTTP 510 Not Extended
 */
export const HTTP_STATUS_NOT_EXTENDED = 510;

/**
 * HTTP 511 Network Authentication Required
 */
export const HTTP_STATUS_NETWORK_AUTH_REQUIRED = 511;

// ========== Status Code Categories ==========

/**
 * Minimum status code for informational responses
 */
export const HTTP_STATUS_INFO_MIN = 100;

/**
 * Maximum status code for informational responses
 */
export const HTTP_STATUS_INFO_MAX = 199;

/**
 * Minimum status code for success responses
 */
export const HTTP_STATUS_SUCCESS_MIN = 200;

/**
 * Maximum status code for success responses
 */
export const HTTP_STATUS_SUCCESS_MAX = 299;

/**
 * Minimum status code for redirection responses
 */
export const HTTP_STATUS_REDIRECT_MIN = 300;

/**
 * Maximum status code for redirection responses
 */
export const HTTP_STATUS_REDIRECT_MAX = 399;

/**
 * Minimum status code for client error responses
 */
export const HTTP_STATUS_CLIENT_ERROR_MIN = 400;

/**
 * Maximum status code for client error responses
 */
export const HTTP_STATUS_CLIENT_ERROR_MAX = 499;

/**
 * Minimum status code for server error responses
 */
export const HTTP_STATUS_SERVER_ERROR_MIN = 500;

/**
 * Maximum status code for server error responses
 */
export const HTTP_STATUS_SERVER_ERROR_MAX = 599;

/**
 * Checks if status code is informational (1xx)
 */
export function isInfoStatus(status: number): boolean {
  return status >= HTTP_STATUS_INFO_MIN && status <= HTTP_STATUS_INFO_MAX;
}

/**
 * Checks if status code is successful (2xx)
 */
export function isSuccessStatus(status: number): boolean {
  return status >= HTTP_STATUS_SUCCESS_MIN && status <= HTTP_STATUS_SUCCESS_MAX;
}

/**
 * Checks if status code is redirection (3xx)
 */
export function isRedirectStatus(status: number): boolean {
  return status >= HTTP_STATUS_REDIRECT_MIN && status <= HTTP_STATUS_REDIRECT_MAX;
}

/**
 * Checks if status code is client error (4xx)
 */
export function isClientErrorStatus(status: number): boolean {
  return status >= HTTP_STATUS_CLIENT_ERROR_MIN && status <= HTTP_STATUS_CLIENT_ERROR_MAX;
}

/**
 * Checks if status code is server error (5xx)
 */
export function isServerErrorStatus(status: number): boolean {
  return status >= HTTP_STATUS_SERVER_ERROR_MIN && status <= HTTP_STATUS_SERVER_ERROR_MAX;
}

/**
 * Checks if status code is an error (4xx or 5xx)
 */
export function isErrorStatus(status: number): boolean {
  return status >= HTTP_STATUS_CLIENT_ERROR_MIN && status <= HTTP_STATUS_SERVER_ERROR_MAX;
}
