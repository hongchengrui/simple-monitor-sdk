import { Logger } from './common'
import { IBreadcrumb } from './breadcrumb'
import { TrackDeviceInfo } from './track'
import { ITransportData } from './transportData'

/**
 * 全局监控支持对象
 */
export interface MonitorSupport {
  logger: Logger
  breadcrumb: IBreadcrumb
  transportData: ITransportData
  replaceFlag: { [key: string]: boolean | undefined }
  record?: any[]
  deviceInfo?: TrackDeviceInfo
  options?: any // Options 类在 core 包中，避免循环依赖
  track?: any
}
