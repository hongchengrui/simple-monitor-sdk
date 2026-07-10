/**
 * CLS（Cumulative Layout Shift）—— 累积布局偏移
 *
 * 【算法】采用 2021 年起的官方「会话窗口」算法（https://web.dev/articles/cls）：
 *  - 按时间把位移聚成「窗口」：两次位移间隔 < 1s 且窗口跨度 < 5s，归入同一窗口，
 *    否则开新窗口。
 *  - CLS = 所有窗口中累计位移值最大的那个。
 *
 * 【为什么不用全量累加】encode 旧实现把生命周期内所有 layout-shift.value 相加，
 * 导致：页面停留越久 CLS 越大（无界计数器）；两次无关抖动被叠加、夸大严重度。
 * session-window 反映「最严重的一次布局不稳定期」，跨长会话也稳定。
 *
 * 【排除 hadRecentInput】用户点击/输入引起的位移是预期行为，不计入。
 */
import { isPerformanceObserverSupported } from '../utils/isSupported'
import observe from '../lib/observe'
import type MetricsStore from '../lib/store'
import type { IReportHandler, LayoutShift, IMetrics, IScoreConfig } from '../types'
import { metricsName } from '../constants'
import { roundByFour } from '../utils'
import { onHidden } from '../lib/onHidden'
import calcScore from '../lib/calculateScore'

/** 会话窗口阈值（对齐 web-vitals 官方） */
const MAX_SESSION_GAP = 1000 // 同窗口内两次位移的最大间隔（ms）
const MAX_SESSION_DURATION = 5000 // 单个窗口的最大时长（ms）

export interface ClsAccumulator {
  /** 喂入一条 layout-shift entry（内部维护窗口状态） */
  process(entry: LayoutShift): void
  /** 当前 CLS = 历史最大窗口的累计值 */
  readonly value: number
}

/**
 * CLS 累加器（纯状态机，脱离浏览器即可单测）。
 * 维护「当前进行中的窗口」与「历史最大窗口」，逐条喂入 layout-shift entry。
 */
export const createClsAccumulator = (): ClsAccumulator => {
  let max = 0 // 历史最大窗口累计值（即最终 CLS）
  let sessionValue = 0 // 当前窗口累计位移
  let firstStart: number | undefined // 当前窗口首个位移时间
  let lastStart: number | undefined // 当前窗口上个位移时间

  return {
    process(entry: LayoutShift) {
      // 用户输入引起的位移是预期行为，不计入
      if (entry.hadRecentInput) return

      // 归入当前窗口：窗口已有值 + 距上次位移 < 1s + 窗口时长 < 5s
      const inSameSession =
        sessionValue > 0 &&
        firstStart !== undefined &&
        lastStart !== undefined &&
        entry.startTime - lastStart < MAX_SESSION_GAP &&
        entry.startTime - firstStart < MAX_SESSION_DURATION

      if (inSameSession) {
        sessionValue += entry.value
        lastStart = entry.startTime
      } else {
        // 开新窗口
        sessionValue = entry.value
        firstStart = entry.startTime
        lastStart = entry.startTime
      }

      // CLS = 所有窗口里的最大累计值
      if (sessionValue > max) max = sessionValue
    },
    get value() {
      return max
    },
  }
}

export const initCLS = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true,
  scoreConfig?: IScoreConfig
): void => {
  if (!isPerformanceObserverSupported()) {
    console.warn('browser do not support performanceObserver')
    return
  }

  const acc = createClsAccumulator()
  const po = observe('layout-shift', (entry: PerformanceEntry) => acc.process(entry as LayoutShift))

  const stopListening = (): void => {
    // 清空 observer 缓冲区里尚未回调的条目，避免漏采
    if (po?.takeRecords) {
      po.takeRecords().forEach((entry: PerformanceEntry) => acc.process(entry as LayoutShift))
    }
    po?.disconnect()

    const metrics = {
      name: metricsName.CLS,
      value: roundByFour(acc.value),
      score: calcScore(metricsName.CLS, acc.value, scoreConfig),
    } as IMetrics

    store.set(metricsName.CLS, metrics)
    if (immediately) report(metrics)
  }

  onHidden(stopListening, true)
}
