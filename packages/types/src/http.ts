/**
 * HTTP Type Definitions
 * Defines types for HTTP request monitoring
 */

/**
 * HTTP request method types (标准枚举)
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * HTTP 方法枚举（首字母大写，用于兼容）
 */
export enum EMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH',
}

/**
 * HTTP 状态码常量
 */
export enum HttpCodes {
  /** 400 Bad Request */
  BAD_REQUEST = 400,

  /** 401 Unauthorized */
  UNAUTHORIZED = 401,

  /** 403 Forbidden */
  FORBIDDEN = 403,

  /** 404 Not Found */
  NOT_FOUND = 404,

  /** 408 Request Timeout */
  REQUEST_TIMEOUT = 408,

  /** 500 Internal Server Error */
  INTERNAL_EXCEPTION = 500,

  /** 502 Bad Gateway */
  BAD_GATEWAY = 502,

  /** 503 Service Unavailable */
  SERVICE_UNAVAILABLE = 503,

  /** 504 Gateway Timeout */
  GATEWAY_TIMEOUT = 504,
}

/**
 * HTTP request types being monitored
 */
export enum HttpTypes {
  /** XMLHttpRequest */
  XHR = 'xhr',

  /** Fetch API */
  FETCH = 'fetch',
}

/**
 * HTTP request data structure
 */
export interface HttpRequestData {
  /** Request method */
  method: HttpMethod | string

  /** Request URL */
  url: string

  /** Request start timestamp */
  startTime: number

  /** Request type (XHR or Fetch) */
  type: HttpTypes

  /** Request headers (optional) */
  headers?: Record<string, string>

  /** Request body (optional) */
  body?: any

  /** Request timeout setting (optional) */
  timeout?: number
}

/**
 * HTTP response data structure
 */
export interface HttpResponseData extends HttpRequestData {
  /** HTTP status code */
  status: number

  /** Status text */
  statusText: string

  /** Request duration in milliseconds */
  elapsedTime: number

  /** Response headers (optional) */
  responseHeaders?: Record<string, string>

  /** Response body (optional) */
  response?: any

  /** Whether the request timed out */
  isTimeout?: boolean

  /** Error message if request failed */
  error?: string

  /** Unique request ID for tracing */
  requestId?: string
}

/**
 * Request timing information
 */
export interface RequestTiming {
  /** DNS lookup time */
  dns?: number

  /** TCP connection time */
  tcp?: number

  /** TLS handshake time */
  tls?: number

  /** Time to first byte */
  ttfb?: number

  /** Content download time */
  download?: number

  /** Total request duration */
  total: number
}

/**
 * 监控的 HTTP 请求数据（用于上报）
 * 兼容文档要求的 MonitorHttp 接口
 */
export interface MonitorHttp {
  /** 请求类型 */
  type: HttpTypes

  /** HTTP 方法 */
  method: string

  /** 请求 URL */
  url: string

  /** 请求数据 */
  reqData?: any

  /** 响应文本 */
  responseText?: string

  /** 状态码 */
  status?: number

  /** 耗时（毫秒） */
  elapsedTime?: number

  /** 时间戳 */
  time?: number

  /** 追踪 ID */
  traceId?: string

  /** 是否为错误 */
  isError?: boolean
}

/**
 * 扩展的 XMLHttpRequest 接口
 * 用于存储监控数据
 */
export interface MonitorXMLHttpRequest extends XMLHttpRequest {
  /** 监控数据 */
  monitor_xhr?: MonitorHttp
}

/**
 * HTTP 监控配置选项
 */
export interface HttpMonitorOptions {
  /** 是否忽略 SDK 自己的上报请求 */
  ignoreSdkUrl?: boolean

  /** 需要忽略的 URL 列表（支持正则或字符串） */
  ignoreUrls?: Array<string | RegExp>

  /** 是否捕获请求体 */
  captureRequestBody?: boolean

  /** 是否捕获响应体 */
  captureResponseBody?: boolean

  /** 最大请求体长度 */
  maxBodyLength?: number

  /** 最大响应体长度 */
  maxResponseLength?: number
}
