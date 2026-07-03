import { isPerformanceObserverSupported, isPerformanceSupported } from '../utils/isSupported'
import type { IMetrics, IReportHandler, IScoreConfig } from '../types'
import { roundByFour } from '../utils'
import { metricsName } from '../constants'
import type MetricsStore from '../lib/store'
import observe from '../lib/observe'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'
import calcScore from '../lib/calculateScore'

const getFP = (): Promise<PerformanceEntry> | undefined => {
  return new Promise((resolve, reject) => {
    if (!isPerformanceObserverSupported()) {
      if (!isPerformanceSupported()) {
        reject(new Error('browser do not support performance'))
      } else {
        const [entry] = performance.getEntriesByName('first-paint')
        if (entry) resolve(entry)
        reject(new Error('browser has no fp'))
      }
    } else {
      const poRef: { current: PerformanceObserver | undefined } = { current: undefined }
      const entryHandler = (entry: PerformanceEntry) => {
        if (entry.name === 'first-paint') {
          poRef.current?.disconnect()
          if (entry.startTime < getFirstHiddenTime().timeStamp) resolve(entry)
        }
      }
      poRef.current = observe('paint', entryHandler)
    }
  })
}

export const initFP = (
  store: MetricsStore,
  report: IReportHandler,
  immediately = true,
  scoreConfig?: IScoreConfig
): void => {
  getFP()
    ?.then((entry: PerformanceEntry) => {
      const metrics = {
        name: metricsName.FP,
        value: roundByFour(entry.startTime, 2),
        score: calcScore(metricsName.FP, entry.startTime, scoreConfig),
      } as IMetrics
      store.set(metricsName.FP, metrics)
      if (immediately) report(metrics)
    })
    .catch((error) => {
      console.error(error)
    })
}
