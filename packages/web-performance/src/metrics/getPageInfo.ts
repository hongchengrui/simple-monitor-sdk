import { metricsName } from '../constants'
import type MetricsStore from '../lib/store'
import type { IReportHandler, IPageInformation, IMetrics } from '../types'

/** 采集页面信息：location 各字段 + UA + 屏幕分辨率 */
const getPageInfo = (): IPageInformation => {
  const { host, hostname, href, protocol, origin, port, pathname, search, hash } = location
  return {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
  }
}

export const initPageInfo = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true
): void => {
  const metrics = { name: metricsName.PI, value: getPageInfo() } as IMetrics
  store.set(metricsName.PI, metrics)
  if (immediately) {
    report(metrics)
  }
}
