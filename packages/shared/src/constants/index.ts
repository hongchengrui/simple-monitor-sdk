/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  disabled: false,
  debug: false,
  batchSize: 10,
  batchTimeout: 5000,
  maxRetries: 3,
  retryDelay: 1000,
  maxBreadcrumbs: 20,
  sampleRate: {
    error: 1.0,
    performance: 0.1,
    behavior: 0.01,
  },
  traceIdFieldName: 'Trace-Id',
} as const

/**
 * 事件名称常量
 */
export const EVENT_NAMES = {
  ERROR: 'error',
  UNHANDLEDREJECTION: 'unhandledrejection',
  CLICK: 'click',
  INPUT: 'input',
  CHANGE: 'change',
  HASHCHANGE: 'hashchange',
  POPSTATE: 'popstate',
} as const

/**
 * HTTP 状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const
