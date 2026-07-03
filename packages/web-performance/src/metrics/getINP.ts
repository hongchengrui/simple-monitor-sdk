/**
 * INP（Interaction to Next Paint）—— 2024-03-12 取代 FID 成为 Core Web Vital。
 *
 * 测量整个页面生命周期内，用户交互（点击/按键/触摸）的「输入到下一帧绘制」全链路延迟，
 * 取最差交互的 duration。FID 只测首次输入延迟，INP 覆盖所有交互，更准确。
 *
 */
import { isPerformanceObserverSupported } from '../utils/isSupported'
import observe from '../lib/observe'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'
import { onHidden } from '../lib/onHidden'
import type MetricsStore from '../lib/store'
import type { IReportHandler, IScoreConfig, IMetrics, PerformanceEventTiming } from '../types'
import { metricsName } from '../constants'
import { roundByFour } from '../utils'
import calcScore from '../lib/calculateScore'

export const initINP = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true,
  scoreConfig?: IScoreConfig
): void => {
  if (!isPerformanceObserverSupported()) {
    console.warn('browser do not support performanceObserver')
    return
  }

  const firstHiddenTime = getFirstHiddenTime()
  let worst = 0
  let eventName = ''
  let target: Element | undefined

  const entryHandler = (entry: PerformanceEntry): void => {
    const e = entry as PerformanceEventTiming
    if (e.interactionId && e.startTime < firstHiddenTime.timeStamp) {
      if (e.duration > worst) {
        worst = e.duration
        eventName = e.name
        target = e.target
      }
    }
  }

  const po = observe('event', entryHandler)

  const stopListening = (): void => {
    if (po?.takeRecords) {
      po.takeRecords().map(entryHandler)
    }
    po?.disconnect()

    if (worst > 0 && !store.has(metricsName.INP)) {
      const value = roundByFour(worst, 2)
      const metrics = {
        name: metricsName.INP,
        value: {
          eventName,
          targetCls: (target as HTMLElement)?.className,
          duration: value,
        },
        score: calcScore(metricsName.INP, value, scoreConfig),
      } as IMetrics

      store.set(metricsName.INP, metrics)
      if (immediately) report(metrics)
    }
  }

  onHidden(stopListening, true)
}
