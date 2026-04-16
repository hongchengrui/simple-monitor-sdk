import { HttpTypes } from '../../../types/base/common'

/**
 * HTTP 监控数据接口（通用）
 * 存储在 XHR 实例上或 Fetch 闭包中，用于跨方法访问请求信息
 * XHR 和 Fetch 都可以使用这个接口
 */
export interface RequestMonitorData {
  /** 请求方法 */
  method: string
  /** 请求 URL */
  url: string
  /** 请求开始时间 */
  startTime: number
  /** 请求数据 */
  requestData?: unknown
  /** 追踪 ID */
  traceId: string
}

/**
 * HTTP 监控上报数据接口
 * 拦截器只负责收集完整数据，不做任何判断和过滤
 */
export interface HTTPMonitorData {
  /** 请求类型：xhr 或 fetch */
  type: HttpTypes
  /** 请求方法 */
  method: string
  /** 请求 URL */
  url: string
  /** HTTP 状态码 */
  status: number
  /** 状态文本 */
  statusText: string
  /** 请求耗时（毫秒） */
  elapsedTime: number
  /** 追踪 ID */
  traceId: string
  /** 请求信息 */
  request: {
    /** 请求体 */
    body?: unknown
  }
  /** 响应信息 */
  response: {
    /** 响应体（文本） */
    text?: string
    /** 响应类型 */
    responseType?: string
  }
}
