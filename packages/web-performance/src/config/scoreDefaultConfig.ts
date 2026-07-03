import { metricsName } from '../constants'

/**
 * 各指标评分曲线（对数正态分布的 median / p10）。
 * INP 阈值对齐 web.dev：good ≤ 200ms（p10=100, median=200）。
 */
const config: Record<string, { median: number; p10: number }> = {
  [metricsName.FP]: { median: 3000, p10: 1800 },
  [metricsName.FCP]: { median: 3000, p10: 1800 },
  [metricsName.ACT]: { median: 3500, p10: 2300 },
  [metricsName.LCP]: { median: 4000, p10: 2500 },
  [metricsName.CCP]: { median: 4000, p10: 2500 },
  [metricsName.INP]: { median: 200, p10: 100 },
  [metricsName.CLS]: { median: 0.25, p10: 0.1 },
}

export default config
