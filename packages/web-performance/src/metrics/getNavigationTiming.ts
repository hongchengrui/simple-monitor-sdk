import type { IMetrics, IPerformanceNavigationTiming, IReportHandler } from '../types'
import { isPerformanceSupported, isPerformanceObserverSupported } from '../utils/isSupported'
import { metricsName } from '../constants'
import type MetricsStore from '../lib/store'
import observe from '../lib/observe'
import { roundByFour, validNumber } from '../utils'

const resolveNavigationTiming = (
  entry: PerformanceNavigationTiming,
  resolve: (v: IPerformanceNavigationTiming) => void
): void => {
  const {
    domainLookupStart,
    domainLookupEnd,
    connectStart,
    connectEnd,
    secureConnectionStart,
    requestStart,
    responseStart,
    responseEnd,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    loadEventStart,
    fetchStart,
  } = entry

  resolve({
    dnsLookup: roundByFour(domainLookupEnd - domainLookupStart),
    initialConnection: roundByFour(connectEnd - connectStart),
    ssl: secureConnectionStart ? roundByFour(connectEnd - secureConnectionStart) : 0,
    ttfb: roundByFour(responseStart - requestStart),
    contentDownload: roundByFour(responseEnd - responseStart),
    domParse: roundByFour(domInteractive - responseEnd),
    deferExecuteDuration: roundByFour(domContentLoadedEventStart - domInteractive),
    domContentLoadedCallback: roundByFour(domContentLoadedEventEnd - domContentLoadedEventStart),
    resourceLoad: roundByFour(loadEventStart - domContentLoadedEventEnd),
    domReady: roundByFour(domContentLoadedEventEnd - fetchStart),
    pageLoad: roundByFour(loadEventStart - fetchStart),
  })
}

const getNavigationTiming = (): Promise<IPerformanceNavigationTiming> | undefined => {
  if (!isPerformanceSupported()) {
    console.warn('browser do not support performance')
    return
  }

  return new Promise((resolve) => {
    if (
      isPerformanceObserverSupported() &&
      PerformanceObserver.supportedEntryTypes?.includes('navigation')
    ) {
      const poRef: { current: PerformanceObserver | undefined } = { current: undefined }
      const entryHandler = (entry: PerformanceEntry) => {
        if (entry.entryType === 'navigation') {
          poRef.current?.disconnect()
          resolveNavigationTiming(entry as PerformanceNavigationTiming, resolve)
        }
      }
      poRef.current = observe('navigation', entryHandler)
    } else {
      const navigation =
        performance.getEntriesByType('navigation').length > 0
          ? (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)
          : (performance.timing as unknown as PerformanceNavigationTiming)
      resolveNavigationTiming(navigation, resolve)
    }
  })
}

export const initNavigationTiming = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true
): void => {
  getNavigationTiming()?.then((navigationTiming) => {
    const metrics = { name: metricsName.NT, value: navigationTiming } as IMetrics
    if (validNumber(Object?.values(metrics.value))) {
      store.set(metricsName.NT, metrics)
      if (immediately) {
        report(metrics)
      }
    }
  })
}
