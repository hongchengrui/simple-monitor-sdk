import { BreadcrumbPushData } from './breadcrumb'
import { EActionType } from './track'
import { DeviceInfo } from './device'
import { ErrorData } from './error'
import { InitOptions } from './options'

// 权限信息
export interface AuthInfo {
  apikey?: string
  trackKey?: string
  sdkVersion: string
  sdkName: string
  trackerId: string
}

export interface TransportDataType {
  authInfo: AuthInfo
  breadcrumb?: BreadcrumbPushData[]
  data?: FinalReportType
  record?: any[]
  deviceInfo?: DeviceInfo
}

export type FinalReportType = ReportDataType | TrackReportData

interface ICommonDataType {
  isTrackData?: boolean
}

export interface ReportDataType extends ICommonDataType {
  type?: string
  message?: string
  url: string
  name?: string
  stack?: any
  time?: number
  errorId?: number
  level: string
  // ajax
  elapsedTime?: number
  request?: {
    httpType?: string
    traceId?: string
    method: string
    url: string
    data: any
  }
  response?: {
    status: number
    data: string
  }
  // vue
  componentName?: string
  propsData?: any
  customTag?: string
}

export interface TrackReportData extends ICommonDataType {
  // uuid
  id?: string
  // 埋点code
  trackId?: string
  // 埋点类型
  actionType: EActionType
  // 埋点开始时间
  startTime?: number
  // 埋点停留时间
  durationTime?: number
  // 上报时间
  trackTime?: number
}

export function isReportDataType(data: ReportDataType | TrackReportData): data is ReportDataType {
  return (<TrackReportData>data).actionType === undefined && !data.isTrackData
}

/**
 * 上报数据类型 (新版)
 */
export type ReportData = ErrorReportData | PerformanceReportData | BehaviorReportData

/**
 * 错误上报数据
 */
export interface ErrorReportData {
  /** 事件类型标识 */
  eventType: 'error'

  /** 错误详情 */
  errorInfo: ErrorData
}

/**
 * 性能上报数据 (指标定义在 web-performance 包)
 */
export interface PerformanceReportData {
  /** 事件类型标识 */
  eventType: 'performance'

  /** 性能指标 */
  metrics: Record<string, number | undefined>
}

/**
 * 行为上报数据
 */
export interface BehaviorReportData {
  /** 事件类型标识 */
  eventType: 'behavior'

  /** 行为数据 */
  behavior: Record<string, unknown>
}

/**
 * TransportData 接口（类型定义）
 */
export interface ITransportData {
  queue: any
  beforeDataReport: unknown
  backTrackerId: unknown
  configReportXhr: unknown
  configReportUrl: unknown
  configReportWxRequest: unknown
  useImgUpload: boolean
  apikey: string
  trackKey: string
  errorDsn: string
  trackDsn: string

  send(data: any): Promise<void>
  bindOptions(options: InitOptions): void
  isSdkTransportUrl(targetUrl: string): boolean
}
