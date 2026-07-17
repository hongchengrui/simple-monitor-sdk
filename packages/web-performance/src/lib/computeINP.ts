/**
 * INP 终值计算（纯函数，脱离浏览器即可单测）。
 *
 * 与 getINP.ts 的浏览器胶水分离：纯算法不依赖 PerformanceObserver / document，
 * 单测时直接 import 本文件，不会拉入浏览器全局。
 *
 * 规则（对齐 Google web-vitals 官方定义）：
 *  - 输入：已按 interactionId 聚合好的交互记录（每条 = 一次交互的最大 duration）。
 *  - ≤ 50 交互：取 worst-case（最大延迟）。
 *  - > 50 交互：取 P98（忽略 top 2%，过滤 GC/IO 等系统抖动噪声）。
 */
export interface InteractionRecord {
  duration: number
  name: string
  target?: Element
}

/** P98 阈值：交互数超过此值时用百分位近似，否则取 worst-case（对齐官方 web-vitals） */
export const P98_INTERACTION_THRESHOLD = 50

export function computeINPFromInteractions(records: InteractionRecord[]): {
  value: number
  record?: InteractionRecord
} {
  const sorted = [...records].sort((a, b) => a.duration - b.duration)
  const n = sorted.length
  if (n === 0) return { value: 0 }
  if (n <= P98_INTERACTION_THRESHOLD) {
    return { value: sorted[n - 1].duration, record: sorted[n - 1] }
  }
  // P98：忽略 top 2% 后的最大值
  const idx = Math.min(n - 1, Math.floor(n * 0.98) - 1)
  return { value: sorted[idx].duration, record: sorted[idx] }
}
