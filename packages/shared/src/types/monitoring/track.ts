/**
 * 埋点监控相关类型定义
 */

/**
 * 埋点行为类型
 */
export enum EActionType {
  /** 页面曝光 */
  PAGE = 'PAGE',
  /** 事件埋点 */
  EVENT = 'EVENT',
  /** 区域曝光 */
  VIEW = 'VIEW',
  /** 时长埋点 */
  DURATION = 'DURATION',
  /** 区域曝光的时长埋点 */
  DURATION_VIEW = 'DURATION_VIEW',
  /** 其他埋点类型 */
  OTHER = 'OTHER',
}

/**
 * 设备信息
 */
export interface DeviceInfo {
  /** 网络类型：4g、3g、5g、wifi 等 */
  netType: string
  /** 客户端宽度 */
  clientWidth: number
  /** 客户端高度 */
  clientHeight: number
  /** 设备像素比 */
  ratio: number
}

/**
 * 埋点基础参数
 */
export interface ITrackBaseParam {
  /** 追踪 ID */
  trackId?: string
  /** 自定义参数 */
  custom?: string | { [prop: string]: string | number | boolean }
  /** 其他任意属性 */
  [key: string]: unknown
}

/**
 * 埋点上报数据
 */
export interface TrackReportData {
  /** 唯一标识 UUID */
  id?: string
  /** 埋点 code（一般由人为传入，可以自定义规范） */
  trackId?: string
  /** 埋点类型 */
  actionType: EActionType
  /** 埋点开始时间 */
  startTime?: number
  /** 埋点停留时长 */
  durationTime?: number
  /** 埋点上报时间 */
  trackTime?: number
  /** 是否为埋点数据 */
  isTrackData?: true
}
