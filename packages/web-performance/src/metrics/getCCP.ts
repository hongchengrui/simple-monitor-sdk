/**
 * CCP（Custom Contentful Paint）—— 自定义内容绘制：页面关键远程 API 完成 + 图片加载完成的时刻。
 * 用于度量「业务可用首屏」时刻，区别于浏览器的 FCP/LCP。
 *
 * 注：资源流（RL）已从此处剥离，独立为 getResourceTiming（RT 指标）——
 * resource timing 是通用诊断能力，不属于自定义首屏，分离后 CCP 只管 ACT/CCP。
 */
import { proxyFetch, proxyXhr } from '../lib/proxyHandler'
import getFirstVisitedState from '../lib/getFirstVisitedState'
import type MetricsStore from '../lib/store'
import type { IReportHandler, IScoreConfig, IMetrics } from '../types'
import { getApiPath, isIncludeArr, isEqualArr, isExistPath, beforeUnload } from '../utils'
import getPath from '../utils/getPath'
import { isPerformanceSupported } from '../utils/isSupported'
import { metricsName } from '../constants'
import { onHidden } from '../lib/onHidden'
import { onPageChange } from '../lib/onPageChange'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'
import calcScore from '../lib/calculateScore'

const remoteQueue = { hasStoreMetrics: false, queue: [] as string[] }
const completeQueue: string[] = []
let isDone = false
let reportLock = true

/** CCP 派生指标的取值类型：ACT 为时间对象、CCP 为数值 */
type CcpValue = { time: number; remoteApis: string[] } | number

const storeMetrics = (
  name: string,
  value: CcpValue,
  store: MetricsStore,
  scoreConfig?: IScoreConfig
): void => {
  // RL 已剥离，storeMetrics 只处理 ACT / CCP
  const scoreValue =
    name === metricsName.ACT
      ? (value as { time: number; remoteApis: string[] }).time
      : (value as number)
  const metrics = { name, value, score: calcScore(name, scoreValue, scoreConfig) ?? undefined }
  store.set(name, metrics)
}

const computeCCP = (store: MetricsStore, scoreConfig?: IScoreConfig): void => {
  setTimeout(() => {
    const images = Array.from(document.querySelectorAll('img')).filter(
      (image) => !image.complete && image.src
    )
    if (images.length > 0) {
      let loadImages = 0
      const finish = (): void => {
        loadImages += 1
        if (loadImages === images.length) {
          storeMetrics(metricsName.CCP, performance.now(), store, scoreConfig)
        }
      }
      images.forEach((image) => {
        image.addEventListener('load', finish)
        image.addEventListener('error', finish)
      })
    } else {
      storeMetrics(metricsName.CCP, performance.now(), store, scoreConfig)
    }
  })
}

const beforeHandler = (
  url: string,
  apiConfig: { [prop: string]: string[] },
  hashHistory: boolean,
  excludeRemotePath: string[]
): void => {
  if (!isPerformanceSupported()) {
    console.warn('browser do not support performance')
    return
  }
  const path = getPath(location, hashHistory)
  const firstVisitedState = getFirstVisitedState().state
  if (firstVisitedState) {
    const remotePath = getApiPath(url)
    if (!isExistPath(excludeRemotePath, remotePath)) {
      if (apiConfig && apiConfig[path]) {
        if (apiConfig[path].some((o) => remotePath === o)) {
          remoteQueue.queue.push(remotePath)
        }
      } else if (!isDone) {
        remoteQueue.queue.push(remotePath)
      }
    }
  }
}

const afterHandler = (
  url: string,
  apiConfig: { [prop: string]: string[] },
  store: MetricsStore,
  hashHistory: boolean,
  excludeRemotePath: string[],
  scoreConfig?: IScoreConfig
): void => {
  if (!isPerformanceSupported()) {
    console.warn('browser do not support performance')
    return
  }
  const path = getPath(location, hashHistory)
  const firstVisitedState = getFirstVisitedState().state
  if (firstVisitedState) {
    const remotePath = getApiPath(url)
    if (!isExistPath(excludeRemotePath, remotePath)) {
      completeQueue.push(remotePath)
      const tryStoreACT = (): void => {
        if (!remoteQueue.hasStoreMetrics) {
          remoteQueue.hasStoreMetrics = true
          const now = performance.now()
          if (now < getFirstHiddenTime().timeStamp) {
            storeMetrics(
              metricsName.ACT,
              { time: now, remoteApis: remoteQueue.queue },
              store,
              scoreConfig
            )
            computeCCP(store, scoreConfig)
          }
        }
      }
      if (apiConfig && apiConfig[path]) {
        if (isIncludeArr(remoteQueue.queue, completeQueue)) tryStoreACT()
      } else if (isIncludeArr(remoteQueue.queue, completeQueue) && isDone) {
        tryStoreACT()
      }
    }
  }
}

const reportMetrics = (store: MetricsStore, report: IReportHandler): void => {
  if (reportLock) {
    const act = store.get(metricsName.ACT)
    const ccp = store.get(metricsName.CCP)

    // urgent=true：CCP 是一次性关键数据，且 reportMetrics 在卸载/隐藏/兜底超时触发，
    // 必须同步送达——走 requestIdleCallback 会在卸载时整批丢失（与 createReporter 同源问题）
    if (act && ccp) {
      if (act.value.time < ccp.value) {
        report(act, true)
        report(ccp, true)
      }
    } else if (ccp) {
      report(ccp, true)
    }
    reportLock = false
  }
}

export const initCCP = (
  store: MetricsStore,
  report: IReportHandler,
  isCustomEvent: boolean,
  apiConfig: { [prop: string]: string[] },
  hashHistory: boolean,
  excludeRemotePath: string[],
  maxWaitCCPDuration: number,
  immediately: boolean,
  scoreConfig?: IScoreConfig
): void => {
  const event = isCustomEvent ? 'custom-contentful-paint' : 'pageshow'
  addEventListener(
    event,
    () => {
      const firstVisitedState = getFirstVisitedState().state
      if (firstVisitedState) {
        isDone = true
        if (isPerformanceSupported()) {
          const now = performance.now()
          if (now < getFirstHiddenTime().timeStamp) {
            if (isEqualArr(remoteQueue.queue, completeQueue) && !remoteQueue.hasStoreMetrics) {
              remoteQueue.hasStoreMetrics = true
              storeMetrics(
                metricsName.ACT,
                { time: performance.now(), remoteApis: remoteQueue.queue },
                store,
                scoreConfig
              )
            }
            computeCCP(store, scoreConfig)
          }
        }
      }
    },
    { once: true, capture: true }
  )

  if (immediately) {
    beforeUnload(() => reportMetrics(store, report))
    onHidden(() => reportMetrics(store, report), true)
    onPageChange(() => reportMetrics(store, report))
    setTimeout(() => reportMetrics(store, report), maxWaitCCPDuration)
  }

  proxyXhr(
    (url) => beforeHandler(url, apiConfig, hashHistory, excludeRemotePath),
    (url) => afterHandler(url, apiConfig, store, hashHistory, excludeRemotePath, scoreConfig)
  )
  proxyFetch(
    (url) => beforeHandler(url, apiConfig, hashHistory, excludeRemotePath),
    (url) => afterHandler(url, apiConfig, store, hashHistory, excludeRemotePath, scoreConfig)
  )
}
