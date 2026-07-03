import { Curve } from '../types'

/**
 * Gauss 误差函数 erf（Abramowitz & Stegun formula 7.1.26）。
 * 标准正态分布随机变量落在 [-x, x] 的概率。
 */
function internalErf_(x: number): number {
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * x)
  const y = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))))
  return sign * (1 - y * Math.exp(-x * x))
}

/**
 * 对数正态分布：返回 value 处的互补分位数（1-percentile）。
 * Chrome 评分模型核心——把原始耗时换算为 0~1 的好度分数（越高越好；= P 随机指标比当前更差）。
 */
export function QUANTILE_AT_VALUE(curve: Curve, value: number): number {
  const { podr, median, p10 } = curve
  const _podr = podr || derivePodrFromP10(median, p10)

  const location = Math.log(median)
  const logRatio = Math.log(_podr / median)
  const shape = Math.sqrt(1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)) / 2

  const standardizedX = (Math.log(value) - location) / (Math.SQRT2 * shape)
  return (1 - internalErf_(standardizedX)) / 2
}

/** 逆误差函数 erfInv（Winitzki 近似） */
function internalErfInv_(x: number): number {
  const sign = x < 0 ? -1 : 1
  const a = 0.147
  const log1x = Math.log(1 - x * x)
  const p1 = 2 / (Math.PI * a) + log1x / 2
  const sqrtP1Log = Math.sqrt(p1 * p1 - log1x / a)
  return sign * Math.sqrt(sqrtP1Log - p1)
}

/** 给定分位数求对应的值 */
export function VALUE_AT_QUANTILE(curve: Curve, quantile: number): number {
  const { podr, median, p10 } = curve
  const _podr = podr || derivePodrFromP10(median, p10)

  const location = Math.log(median)
  const logRatio = Math.log(_podr / median)
  const shape = Math.sqrt(1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)) / 2

  return Math.exp(location + shape * Math.SQRT2 * internalErfInv_(1 - 2 * quantile))
}

/** 由 median / p10 推导 podr（对数正态分布小三阶导较小正根位置） */
function derivePodrFromP10(median: number, p10?: number): number {
  const u = Math.log(median)
  const _p10 = p10 ?? median
  const shape = Math.abs(Math.log(_p10) - u) / (Math.SQRT2 * 0.9061938024368232)
  const inner1 = -3 * shape - Math.sqrt(4 + shape * shape)
  return Math.exp(u + (shape / 2) * inner1)
}
