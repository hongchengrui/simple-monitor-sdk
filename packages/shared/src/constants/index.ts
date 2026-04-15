/**
 * 运行时常量定义
 * 注意：类型枚举请使用 types/base/constant.ts 中的 HttpCodes、BreadCrumbTypes 等
 */

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
 * 浏览器原生事件名称常量
 * 用于避免硬编码事件名，减少拼写错误
 */
export const BROWSER_EVENTS = {
  // 错误事件
  ERROR: 'error',
  UNHANDLEDREJECTION: 'unhandledrejection',

  // 用户交互事件
  CLICK: 'click',
  INPUT: 'input',
  CHANGE: 'change',

  // 路由事件
  HASHCHANGE: 'hashchange',
  POPSTATE: 'popstate',

  // 生命周期
  LOAD: 'load',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
  BEFORE_UNLOAD: 'beforeunload',
} as const

/**
 * SDK 内部使用的限制常量
 */
export const LIMITS = {
  /** 最大面包屑数量 */
  MAX_BREADCRUMBS: 100,
  /** 最大错误堆栈深度 */
  MAX_STACK_SIZE: 50,
  /** 最大字符串长度 */
  MAX_STRING_LENGTH: 1000,
  /** 最大重试次数 */
  MAX_RETRIES: 10,
} as const

/**
 * 时间相关常量（毫秒）
 */
export const TIME = {
  /** 默认上报超时 */
  REPORT_TIMEOUT: 5000,
  /** 默认重试延迟 */
  RETRY_DELAY: 1000,
  /** 跨域阈值 */
  CROSS_ORIGIN_THRESHOLD: 1000,
  /** 性能监控最小时间 */
  MIN_PERFORMANCE_TIME: 0,
} as const

/**
 * SDK 元数据
 */
export const SDK_INFO = {
  NAME: 'simple-monitor-sdk',
  VERSION: '0.0.1',
} as const
