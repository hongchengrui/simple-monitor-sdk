/**
 * 上报事件级别
 */
export enum Severity {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Low = 'low',
  Normal = 'normal',
}
/**
 * 错误类型
 */
export enum ErrorType {
  JAVASCRIPT_ERROR = 'javascript_error',
  PROMISE_ERROR = 'promise_error',
  RESOURCE_ERROR = 'resource_error',
  HTTP_ERROR = 'http_error',
  VUE_ERROR = 'vue_error',
}

/**
 * 事件类型
 */
export enum EventType {
  ERROR = 'error',
  PERFORMANCE = 'performance',
  BEHAVIOR = 'behavior',
}

/**
 * 上报数据格式
 */
export interface ReportData {
  /** 事件类型 */
  type: EventType
  /** 错误类型 */
  errorType?: ErrorType
  /** 级别 */
  level: Severity
  /** 时间戳 */
  time: number
  /** 数据 */
  data: any
  /** 用户 ID */
  userId?: string
  /** 会话 ID */
  sessionId?: string
  /** 页面 URL */
  url?: string
}

/**
 * 用户行为栈数据
 */
export interface BreadcrumbData {
  /** 类型 */
  type: string
  /** 类别 */
  category: string
  /** 数据 */
  data: any
  /** 级别 */
  level: Severity
  /** 时间戳 */
  time: number
}
