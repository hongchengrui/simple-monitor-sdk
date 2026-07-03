import { isPerformanceObserverSupported, isPerformanceSupported } from '../utils/isSupported'
import type { IMetrics, IReportHandler, IScoreConfig } from '../types'
import { roundByFour } from '../utils'
import { metricsName } from '../constants'
import type MetricsStore from '../lib/store'
import observe from '../lib/observe'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'
import calcScore from '../lib/calculateScore'

const getFCP = (): Promise<PerformanceEntry> => {
  return new Promise((resolve, reject) => {
    if (!isPerformanceObserverSupported()) {
      if (!isPerformanceSupported()) {
        reject(new Error('browser do not support performance'))
      } else {
        const [entry] = performance.getEntriesByName('first-contentful-paint')
        if (entry) resolve(entry)
        reject(new Error('browser has no fcp'))
      }
    } else {
      const poRef: { current: PerformanceObserver | undefined } = { current: undefined }
      const entryHandler = (entry: PerformanceEntry) => {
        if (entry.name === 'first-contentful-paint') {
          poRef.current?.disconnect()
          if (entry.startTime < getFirstHiddenTime().timeStamp) resolve(entry)
        }
      }
      poRef.current = observe('paint', entryHandler)
    }
  })
}

export const initFCP = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true,
  scoreConfig?: IScoreConfig
): void => {
  getFCP()
    .then((entry: PerformanceEntry) => {
      const metrics = {
        name: metricsName.FCP,
        value: roundByFour(entry.startTime, 2),
        score: calcScore(metricsName.FCP, entry.startTime, scoreConfig),
      } as IMetrics
      store.set(metricsName.FCP, metrics)
      if (immediately) report(metrics)
    })
    .catch((error) => {
      console.error(error)
    })
}
