/**
 * 数据传输相关类型定义
 */
import { BreadcrumbData } from './breadcrumb'
import { DeviceInfo, TrackReportData } from '../monitoring/track'

/**
 * 认证信息
 */
export interface AuthInfo {
  /** API 密钥 */
  apikey?: string
  /** 埋点密钥 */
  trackKey?: string
  /** SDK 版本号 */
  sdkVersion: string
  /** SDK 名称 */
  sdkName: string
  /** 追踪器 ID */
  trackerId: string
}

/**
 * 通用数据类型
 */
interface ICommonDataType {
  /** 是否为埋点数据 */
  isTrackData?: boolean
}

/**
 * 错误上报数据
 */
export interface ReportDataType extends ICommonDataType {
  /** 错误类型 */
  type?: string
  /** 错误信息 */
  message?: string
  /** 错误发生的页面 URL */
  url: string
  /** 错误名称 */
  name?: string
  /** 错误堆栈 */
  stack?: unknown
  /** 错误发生时间 */
  time?: number
  /** 错误 ID */
  errorId?: number
  /** 错误级别 */
  level: string
  /** HTTP 请求耗时 */
  elapsedTime?: number
  /** HTTP 请求数据 */
  request?: {
    /** HTTP 类型 */
    httpType?: string
    /** 追踪 ID */
    traceId?: string
    /** 请求方法 */
    method: string
    /** 请求 URL */
    url: string
    /** 请求数据 */
    data: unknown
  }
  /** HTTP 响应数据 */
  response?: {
    /** 响应状态码 */
    status: number
    /** 响应数据 */
    data: string
  }
  /** Vue 组件名称 */
  componentName?: string
  /** Vue 组件 props 数据 */
  propsData?: unknown
  /** 自定义标签 */
  customTag?: string
}

/**
 * 最终上报类型（错误数据或埋点数据）
 */
export type FinalReportType = ReportDataType | TrackReportData

/**
 * 数据传输格式
 */
export interface TransportDataType {
  /** 认证信息 */
  authInfo: AuthInfo
  /** 用户行为栈（面包屑）数据 */
  breadcrumb?: BreadcrumbData[]
  /** 上报数据（错误或埋点） */
  data?: FinalReportType
  /** 录屏数据 */
  record?: unknown[]
  /** 设备信息 */
  deviceInfo?: DeviceInfo
}

/**
 * 类型守卫：判断是否为错误上报数据
 */
export function isReportDataType(data: ReportDataType | TrackReportData): data is ReportDataType {
  return (data as TrackReportData).actionType === undefined && !data.isTrackData
}
