import { isPerformanceSupported } from '../utils/isSupported'

/** 用 performance.measure 计算 ${markName}_start → ${markName}_end 的耗时 */
export const measure = (customMetrics: string, markName: string): PerformanceEntry | undefined => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance')
    return
  }
  performance.measure(customMetrics, `${markName}_start`, `${markName}_end`)
  return performance.getEntriesByName(customMetrics).pop()
}
