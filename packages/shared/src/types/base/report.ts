/**
 * 上报数据格式定义
 */
import { EventType, Severity } from './common'
import { ErrorData } from '../monitoring/error'
import { PerformanceData } from '../monitoring/performance'
import { BehaviorData } from '../monitoring/behavior'
import { BreadcrumbData } from './breadcrumb'

/**
 * 基础上报数据格式
 */
export interface BaseReportData {
  /** 事件ID */
  eventId?: string
  /** 事件类型 */
  type: EventType
  /** 级别 */
  level: Severity
  /** 时间戳 */
  time: number
  /** 用户ID */
  userId?: string
  /** 会话ID */
  sessionId?: string
  /** 页面URL */
  url?: string
  /** 用户代理 */
  userAgent?: string
  /** 屏幕分辨率 */
  screen?: string
  /** 视口大小 */
  viewport?: string
}

/**
 * 完整上报数据格式
 */
export interface ReportData extends BaseReportData {
  /** 错误类型（当type为ERROR时） */
  errorType?: string
  /** 数据（强类型） */
  data: ErrorData | PerformanceData | BehaviorData
  /** 面包屑 */
  breadcrumbs?: BreadcrumbData[]
}

/**
 * 数据类型联合
 */
export type EventData = ErrorData | PerformanceData | BehaviorData
