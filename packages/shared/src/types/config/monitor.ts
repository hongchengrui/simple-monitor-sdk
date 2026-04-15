/**
 * 监控配置项
 */
import { ReportData } from '../base/report'
import { BreadcrumbData } from '../base/breadcrumb'
import { TransportDataType } from '../base/transport'

export interface MonitorConfig {
  // ========== 基础配置 ==========
  /** 上报地址 */
  dsn: string
  /** 应用唯一标识 */
  apiKey: string
  /** 是否禁用监控 */
  disabled?: boolean
  /** 用户ID */
  userId?: string
  /** 用户名 */
  userName?: string

  // ========== 上报配置 ==========
  /** 批量上报大小（默认 10） */
  batchSize?: number
  /** 批量上报超时时间（默认 5000ms） */
  batchTimeout?: number
  /** 失败重试次数（默认 3） */
  maxRetries?: number
  /** 重试延迟（默认 1000ms） */
  retryDelay?: number
  /** 使用图片上报的方式，默认为false，默认是xhr的上报方式 */
  useImgUpload?: boolean

  // ========== 过滤配置 ==========
  /** 过滤 XHR URL 的正则 */
  filterXhrUrlRegExp?: RegExp
  /** 忽略错误的正则列表 */
  ignoreErrors?: RegExp[]
  /** 最多可重复上报同一个错误的次数 */
  maxDuplicateCount?: number

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

  // ========== 用戶行为棧配置 ==========
  /** 最大栈数量（默认 20） */
  maxBreadcrumbs?: number

  // ========== 埋点配置 ==========
  /** 每个项目有一个唯一trackKey，给埋点的dsn用的 */
  trackKey?: string
  /** 开启埋点追踪功能 */
  enableTrack?: boolean
  /** 在开启enableTrack后，将所有埋点信息上报到该服务端地址，如果该属性有值时才会启动无痕埋点 */
  trackDsn?: string

  // ========== 节流配置 ==========
  /** 按钮点击和微信触摸事件节流时间，默认是0 */
  throttleDelayTime?: number

  // ========== 钩子函数 ==========
  hooks?: {
    /** 发送前钩子 */
    beforeSend?: (data: ReportData) => ReportData | null
    /** 添加面包屑前钩子 */
    beforeAddBreadcrumb?: (data: BreadcrumbData) => BreadcrumbData | null
    /** 钩子函数，配置发送到服务端的xhr，可以对当前xhr实例做一些配置：xhr.setRequestHeader()、xhr.withCredentials */
    configReportXhr?: (xhr: XMLHttpRequest, reportData: TransportDataType) => void
    /** 钩子函数，在每次发送事件前会调用，如果返回 null | undefined | boolean 时，将忽略本次上传 */
    beforeDataReport?: (
      event: TransportDataType
    ) => Promise<TransportDataType | null | boolean> | TransportDataType | null | boolean
    /** 钩子函数，每次发送前都会调用，返回空时不上报 */
    configReportUrl?: (event: TransportDataType, url: string) => string
    /** 钩子函数，拦截用户页面的ajax请求，并在ajax请求发送前执行该hook，可以对用户发送的ajax请求做xhr.setRequestHeader */
    beforeAppAjaxSend?: (
      config: { method: string; url: string },
      setRequestHeader: (key: string, value: string) => void
    ) => void
    /** 钩子函数，在beforeDataReport后面调用，在整合上报数据和本身SDK信息数据前调用，当前函数执行完后立即将数据错误信息上报至服务端，trackerId表示用户唯一键（可以理解成userId），需要trackerId的意义可以区分每个错误影响的用户数量 */
    backTrackerId?: () => string | number
  }

  // ========== 浏览器钩子 ==========
  browserHooks?: {
    /** 路由变化时的回调函数，在 SPA 应用路由改变时触发 */
    onRouteChange?: (from: string, to: string) => unknown
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
    /** 静默 Hashchange 监控 */
    hashchange?: boolean
    /** 静默 Error 监控 */
    error?: boolean
    /** 静默 Promise 监控 */
    unhandledrejection?: boolean
    /** 静默 Vue 监控 */
    vue?: boolean
  }

  // ========== 调试配置 ==========
  /** 默认为关闭，为true是会打印一些信息：breadcrumb */
  debug?: boolean
}
