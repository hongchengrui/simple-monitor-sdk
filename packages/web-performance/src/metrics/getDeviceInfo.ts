import { isPerformanceSupported, isNavigatorSupported } from '../utils/isSupported'
import { metricsName } from '../constants'
import type MetricsStore from '../lib/store'
import type { IReportHandler, IDeviceInformation, IMetrics } from '../types'
import { convertToMB } from '../utils'

/** 采集设备信息：deviceMemory / hardwareConcurrency / performance.memory（best-effort，非标准降级） */
const getDeviceInfo = (): IDeviceInformation => {
  const info: IDeviceInformation = {}
  if (isNavigatorSupported()) {
    const nav = navigator as Navigator & { deviceMemory?: number }
    info.deviceMemory = nav.deviceMemory
    info.hardwareConcurrency = nav.hardwareConcurrency
  }
  if (isPerformanceSupported()) {
    const memory = (performance as Performance & { memory?: any }).memory
    if (memory) {
      info.jsHeapSizeLimit = convertToMB(memory.jsHeapSizeLimit) ?? undefined
      info.totalJSHeapSize = convertToMB(memory.totalJSHeapSize) ?? undefined
      info.usedJSHeapSize = convertToMB(memory.usedJSHeapSize) ?? undefined
    }
  }
  return info
}

export const initDeviceInfo = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true
): void => {
  const metrics = { name: metricsName.DI, value: getDeviceInfo() } as IMetrics
  store.set(metricsName.DI, metrics)
  if (immediately) {
    report(metrics)
  }
}
