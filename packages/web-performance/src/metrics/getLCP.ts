import { isPerformanceObserverSupported } from '../utils/isSupported'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'
import { onHidden } from '../lib/onHidden'
import { metricsName } from '../constants'
import type { IMetrics, IReportHandler, IScoreConfig } from '../types'
import type MetricsStore from '../lib/store'
import { roundByFour } from '../utils'
import observe from '../lib/observe'
import calcScore from '../lib/calculateScore'

const getLCP = (lcp: { value: PerformanceEntry | undefined }): PerformanceObserver | undefined => {
  if (!isPerformanceObserverSupported()) {
    console.warn('browser do not support performanceObserver')
    return
  }
  const firstHiddenTime = getFirstHiddenTime()
  const entryHandler = (entry: PerformanceEntry) => {
    // 只接受「页面在前台时」发生的 LCP：后台加载时浏览器节流，测得的 LCP 不准
    if (entry.startTime < firstHiddenTime.timeStamp) {
      lcp.value = entry
    }
  }
  return observe('largest-contentful-paint', entryHandler)
}

export const initLCP = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true,
  scoreConfig?: IScoreConfig
): void => {
  // undefined 明确表示「尚未采到有效 LCP」，取代 encode 的 {} as PerformanceEntry
  // ——后者会让未命中分支时 value.startTime 为 undefined，最终上报 value=NaN、score=NaN
  const lcp = { value: undefined as PerformanceEntry | undefined }
  const po = getLCP(lcp)

  const stopListening = (): void => {
    // 清空 observer 缓冲区里尚未回调的条目，避免漏采
    if (po?.takeRecords) {
      po.takeRecords().forEach((entry: PerformanceEntry) => {
        const firstHiddenTime = getFirstHiddenTime()
        if (entry.startTime < firstHiddenTime.timeStamp) {
          lcp.value = entry
        }
      })
    }
    po?.disconnect()

    // 未采到有效 LCP（页面秒卸载 / 后台加载 / 无内容）→ 跳过，避免 NaN 污染上报数据
    const value = lcp.value
    if (!value || value.startTime == null) return

    if (!store.has(metricsName.LCP)) {
      const metrics = {
        name: metricsName.LCP,
        value: roundByFour(value.startTime, 2),
        score: calcScore(metricsName.LCP, value.startTime, scoreConfig),
      } as IMetrics
      store.set(metricsName.LCP, metrics)
      if (immediately) report(metrics)
    }
  }

  // LCP 定义为「用户首次交互前的最大内容绘制」，交互或页面隐藏即定格
  onHidden(stopListening, true)
  ;['click', 'keydown'].forEach((event: string) => {
    addEventListener(event, stopListening, { once: true, capture: true })
  })
}
