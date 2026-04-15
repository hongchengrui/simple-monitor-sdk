/**
 * HTTP监控相关类型定义
 */
import { HttpTypes } from '../base/common'

/**
 * HTTP监控数据接口
 */
export interface MonitorHttp {
  /** 请求类型 */
  type: HttpTypes
  /** 追踪ID，用于关联请求 */
  traceId?: string
  /** 请求方法 */
  method?: string
  /** 请求URL */
  url?: string
  /** 响应状态码 */
  status?: number
  /** 请求数据 */
  reqData?: unknown
  /** 请求开始时间 */
  sTime?: number
  /** 请求耗时（毫秒） */
  elapsedTime?: number
  /** 响应文本 */
  responseText?: string
  /** 时间戳 */
  time?: number
  /** 是否为SDK内部的请求 */
  isSdkUrl?: boolean
  /** 错误信息 */
  errMsg?: string
}

/**
 * 增强型的XMLHttpRequest对象
 */
export interface MonitorXMLHttpRequest extends XMLHttpRequest {
  /** 监控数据 */
  monitor_xhr?: MonitorHttp
}

/**
 * HTTP数据上报格式
 */
export interface HTTPData {
  /** 请求URL */
  url: string
  /** 请求方法 */
  method: string
  /** 响应状态 */
  status: number
  /** 请求耗时(毫秒) */
  duration: number
  /** 追踪ID */
  traceId: string
  /** 请求类型 */
  type?: string
}
