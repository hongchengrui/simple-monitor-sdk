import type { PerformanceEntryHandler } from '../types'

/**
 * PerformanceObserver 封装：
 *  - 先检测 supportedEntryTypes（避免不支持的类型抛错）
 *  - buffered:true 捕获脚本加载前已产生的条目
 */
const observe = (
  type: string,
  callback: PerformanceEntryHandler
): PerformanceObserver | undefined => {
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const po = new PerformanceObserver((list) => list.getEntries().forEach(callback))
    po.observe({ type, buffered: true })
    return po
  }
}

export default observe
