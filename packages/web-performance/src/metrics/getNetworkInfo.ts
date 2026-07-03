import { isNavigatorSupported } from '../utils/isSupported'
import { metricsName } from '../constants'
import type MetricsStore from '../lib/store'
import type { IReportHandler, INetworkInformation, IMetrics } from '../types'

/** 采集网络信息：navigator.connection（Network Information API，非标准、Chrome 系） */
export const getNetworkInfo = (): INetworkInformation => {
  const info: INetworkInformation = {}
  if (isNavigatorSupported()) {
    const connection = (navigator as Navigator & { connection?: any }).connection
    if (connection) {
      info.downlink = connection.downlink
      info.effectiveType = connection.effectiveType
      info.rtt = connection.rtt
    }
  }
  return info
}

export const initNetworkInfo = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true
): void => {
  const metrics = { name: metricsName.NI, value: getNetworkInfo() } as IMetrics
  store.set(metricsName.NI, metrics)
  if (immediately) {
    report(metrics)
  }
}
