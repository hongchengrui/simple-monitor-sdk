import { describe, it, expect } from 'vitest'
import { createClsAccumulator } from '../../packages/web-performance/src/metrics/getCLS'
import type { LayoutShift } from '../../packages/web-performance/src/types'

/** 构造一条 layout-shift entry 的最小替身（startTime/value/hadRecentInput） */
const shift = (startTime: number, value: number, hadRecentInput = false): LayoutShift =>
  ({ startTime, value, hadRecentInput }) as unknown as LayoutShift

describe('createClsAccumulator（session-window 算法）', () => {
  it('单次位移：CLS = 该位移值', () => {
    const acc = createClsAccumulator()
    acc.process(shift(0, 0.1))
    expect(acc.value).toBeCloseTo(0.1)
  })

  it('用户输入引起的位移不计入', () => {
    const acc = createClsAccumulator()
    acc.process(shift(0, 0.5, true))
    expect(acc.value).toBe(0)
  })

  it('两次位移间隔 < 1s：同窗口累加', () => {
    const acc = createClsAccumulator()
    acc.process(shift(0, 0.1))
    acc.process(shift(500, 0.2)) // 间隔 500ms < 1s
    expect(acc.value).toBeCloseTo(0.3)
  })

  it('两次位移间隔 > 1s：开新窗口，取较大者而非累加', () => {
    const acc = createClsAccumulator()
    acc.process(shift(0, 0.1))
    acc.process(shift(2000, 0.2)) // 间隔 2000ms > 1s → 新窗口
    expect(acc.value).toBeCloseTo(0.2) // max(0.1, 0.2)，不是 0.3
  })

  it('窗口跨度超过 5s：开新窗口', () => {
    const acc = createClsAccumulator()
    acc.process(shift(0, 0.1))
    acc.process(shift(6000, 0.2)) // 距窗口首个 6000ms > 5s → 新窗口
    expect(acc.value).toBeCloseTo(0.2)
  })

  it('连续小位移 + 中途一次大窗口：CLS 取最大窗口', () => {
    const acc = createClsAccumulator()
    acc.process(shift(0, 0.05))
    acc.process(shift(300, 0.05)) // 0~300ms 同窗口 → 0.1
    acc.process(shift(5000, 0.4)) // 新窗口 → 0.4
    acc.process(shift(5300, 0.1)) // 5~5.3s 同窗口 → 0.5（最大）
    expect(acc.value).toBeCloseTo(0.5)
  })
})
