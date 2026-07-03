import { QUANTILE_AT_VALUE } from '../utils/math'
import scoreDefaultConfig from '../config/scoreDefaultConfig'
import type { IScoreConfig } from '../types'

/**
 * 计算指标分数：用用户 scoreConfig 覆盖默认配置后，调对数正态分位数。
 * @return 0~1 的好度分数（越高越好）；无对应配置返回 null
 */
const calcScore = (
  metricsName: string,
  value: number,
  config: IScoreConfig = {}
): number | null => {
  const mergeConfig = { ...scoreDefaultConfig, ...config }
  const metricsConfig = mergeConfig[metricsName]
  if (metricsConfig) {
    return QUANTILE_AT_VALUE(metricsConfig, value)
  }
  return null
}

export default calcScore
