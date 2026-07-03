/**
 * RT（Resource Timing）—— 资源加载耗时采集
 *
 * 目标：定位「哪些资源文件加载慢、慢在哪个阶段」。
 * 判定：单个资源 duration >= threshold（默认 300ms，可配）即视为慢，进入 slowTop。
 * 不依赖 DNS/网络判定——DNS 是 NavigationTiming 页面级独立采集，网络仅作快照上下文。
 *
 * 采集时机：页面 hidden/unload 时 getEntriesByType('resource') 快照
 * （资源 entry 累积不清，一次性覆盖整会话）。
 */
import type MetricsStore from '../lib/store'
import type {
  IReportHandler,
  ResourceStages,
  ResourceTimingEntry,
  ResourceTimingReport,
} from '../types'
import { metricsName } from '../constants'
import { roundByFour, beforeUnload, unload } from '../utils'
import { isPerformanceSupported } from '../utils/isSupported'
import { getNetworkInfo } from './getNetworkInfo'
import { onHidden } from '../lib/onHidden'

const DEFAULT_THRESHOLD = 300
const DEFAULT_TOP_N = 10

/** 脱敏：去掉 query/hash，保留 host + path */
const sanitizeUrl = (url: string): string => {
  if (!url) return ''
  return url.split('#')[0].split('?')[0]
}

/**
 * 拆解单个资源的阶段耗时；跨域无 Timing-Allow-Origin 时返回 null。
 * 跨域无 TAO 时 domainLookupStart/connectStart/requestStart/responseStart 全为 0，
 * 判定：responseStart === 0 且 startTime > 0（同源 responseStart 必 > startTime）。
 */
export const buildResourceStages = (entry: PerformanceResourceTiming): ResourceStages | null => {
  if (entry.responseStart === 0 && entry.startTime > 0) return null
  return {
    dnsLookup: roundByFour(entry.domainLookupEnd - entry.domainLookupStart),
    connection: roundByFour(entry.connectEnd - entry.connectStart),
    ssl: entry.secureConnectionStart
      ? roundByFour(entry.connectEnd - entry.secureConnectionStart)
      : 0,
    ttfb: roundByFour(entry.responseStart - entry.requestStart),
    download: roundByFour(entry.responseEnd - entry.responseStart),
  }
}

/** 构建单个资源 entry（纯函数，可单测） */
export const buildResourceEntry = (entry: PerformanceResourceTiming): ResourceTimingEntry => ({
  url: sanitizeUrl(entry.name),
  initiatorType: entry.initiatorType,
  duration: roundByFour(entry.duration, 2),
  transferSize: entry.transferSize >= 0 ? entry.transferSize : -1,
  stages: buildResourceStages(entry),
})

/** 筛选慢资源 Top-N：duration >= threshold，降序，截 topN（纯函数，可单测） */
export const pickSlowResources = (
  entries: PerformanceResourceTiming[],
  threshold: number,
  topN: number
): ResourceTimingEntry[] =>
  entries
    .map(buildResourceEntry)
    .filter((e) => e.duration >= threshold)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, topN)

export const initResourceTiming = (
  store: MetricsStore,
  report: IReportHandler,
  threshold: number = DEFAULT_THRESHOLD,
  topN: number = DEFAULT_TOP_N
): void => {
  // 资源 entry 累积不清，hidden/unload 时快照一次即可覆盖整会话；
  // done 保证只采报一次，避免 hidden 来回触发导致重复上报
  let done = false
  const collect = (): void => {
    if (done || !isPerformanceSupported()) return
    done = true

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const reportData: ResourceTimingReport = {
      total: resources.length,
      threshold,
      network: getNetworkInfo(),
      slowTop: pickSlowResources(resources, threshold, topN),
    }
    const metrics = { name: metricsName.RT, value: reportData }
    store.set(metricsName.RT, metrics)
    // unload/hidden 路径，必须同步送达（urgent）
    report(metrics, true)
  }

  ;[beforeUnload, unload, onHidden].forEach((fn) => fn(collect))
}
