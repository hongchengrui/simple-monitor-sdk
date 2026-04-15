/**
 * 通用枚举类型定义
 */

/**
 * 上报事件级别
 */
export enum Severity {
  /** 调试 */
  Debug = 'debug',
  /** 信息 */
  Info = 'info',
  /** 警告 */
  Warning = 'warning',
  /** 错误 */
  Error = 'error',
  /** 低级别 */
  Low = 'low',
  /** 正常 */
  Normal = 'normal',
  /** 高级别 */
  High = 'high',
  /** 严重 */
  Critical = 'critical',
}

/**
 * 事件类型
 */
export enum EventType {
  /** 错误事件 */
  ERROR = 'error',
  /** 性能事件 */
  PERFORMANCE = 'performance',
  /** 行为事件 */
  BEHAVIOR = 'behavior',
}

/**
 * HTTP请求类型
 */
export enum HttpTypes {
  /** XMLHTTPRequest 请求 */
  XHR = 'xhr',
  /** Fetch API 请求 */
  FETCH = 'fetch',
}

/**
 * 错误类型
 */
export enum ErrorType {
  /** JavaScript运行时错误 */
  JAVASCRIPT_ERROR = 'javascript_error',
  /** Promise未捕获异常 */
  PROMISE_ERROR = 'promise_error',
  /** 资源加载错误 */
  RESOURCE_ERROR = 'resource_error',
  /** HTTP请求错误 */
  HTTP_ERROR = 'http_error',
  /** Vue组件错误 */
  VUE_ERROR = 'vue_error',
  /** React组件错误 */
  REACT_ERROR = 'react_error',
  /** 未知错误 */
  UNKNOWN_ERROR = 'unknown_error',
  /** 跨域错误 */
  CORS_ERROR = 'cors_error',
  /** 超时错误 */
  TIMEOUT_ERROR = 'timeout_error',
}
