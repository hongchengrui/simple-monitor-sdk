/**
 * 监控配置项
 */

export interface MonitorConfig {
  // ========== 基础配置 ==========
  /** 上报地址 */
  dsn: string
  /** 应用唯一标识 */
  apiKey: string
  /** 是否禁用监控 */
  disabled?: boolean

  // ========== 上报配置 ==========
  /** 批量上报大小（默认 10） */
  batchSize?: number
  /** 批量上报超时时间（默认 5000ms） */
  batchTimeout?: number
  /** 失败重试次数（默认 3） */
  maxRetries?: number
  /** 重试延迟（默认 1000ms） */
  retryDelay?: number

  // ========== 过滤配置 ==========
  /** 过滤 XHR URL 的正则 */
  filterXhrUrlRegExp?: RegExp
  /** 忽略错误的正则列表 */
  ignoreErrors?: RegExp[]

  // ========== 采样配置 ==========
  /** 采样率配置 */
  sampleRate?: {
    /** 错误采样率（默认 1.0） */
    error?: number
    /** 性能采样率（默认 0.1） */
    performance?: number
    /** 行为采样率（默认 0.01） */
    behavior?: number
  }
  // ========== TraceId 配置 ==========
  /** 开启 TraceId */
  enableTraceId?: boolean
  /** TraceId 字段名（默认 'Trace-Id'） */
  traceIdFieldName?: string
  /** 需要添加 TraceId 的 URL 正则 */
  includeHttpUrlTraceIdRegExp?: RegExp

  // ========== 用戶行為棧配置 ==========
  /** 最大栈数量（默认 20） */
  maxBreadcrumbs?: number

  // ========== 钩子函数 ==========
  hooks?: {
    /** 发送前钩子 */
    beforeSend?: (data: any) => any | null
    /** 添加面包屑前钩子 */
    beforeAddBreadcrumb?: (data: any) => any | null
  }

  // ========== 静默配置 ==========
  silent?: {
    /** 静默 XHR 监控 */
    xhr?: boolean
    /** 静默 Fetch 监控 */
    fetch?: boolean
    /** 静默 Console 监控 */
    console?: boolean
    /** 静默 DOM 监控 */
    dom?: boolean
    /** 静默 History 监控 */
    history?: boolean
    /** 静默 Error 监控 */
    error?: boolean
    /** 静默 Promise 监控 */
    unhandledrejection?: boolean
  }
}
