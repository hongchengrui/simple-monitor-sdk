import type { IMetrics, IMetricsObj } from '../types'
import { metricsName } from '../constants'

/** 指标存储：Map<name, {name, value, score}> */
class MetricsStore {
  state: Map<metricsName | string, IMetrics>

  constructor() {
    this.state = new Map<metricsName | string, IMetrics>()
  }

  set(key: metricsName | string, value: IMetrics): void {
    this.state.set(key, value)
  }

  get(key: metricsName | string): IMetrics {
    return this.state.get(key) as IMetrics
  }

  has(key: metricsName | string): boolean {
    return this.state.has(key)
  }

  clear(): void {
    this.state.clear()
  }

  getValues(): IMetricsObj {
    const obj: IMetricsObj = {}
    this.state.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }
}

export default MetricsStore
