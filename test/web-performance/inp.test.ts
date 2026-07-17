import { describe, it, expect } from 'vitest'
import { computeINPFromInteractions } from '../../packages/web-performance/src/lib/computeINP'

/** 构造一条交互记录的最小替身 */
const interaction = (duration: number, name = 'click'): { duration: number; name: string } => ({
  duration,
  name,
})

describe('computeINPFromInteractions（INP 终值算法）', () => {
  it('空交互：返回 0', () => {
    expect(computeINPFromInteractions([]).value).toBe(0)
  })

  it('单次交互：INP = 该交互延迟', () => {
    const r = computeINPFromInteractions([interaction(120)])
    expect(r.value).toBe(120)
    expect(r.record?.name).toBe('click')
  })

  it('交互数 ≤ 50：取 worst-case（最大延迟）', () => {
    // 恰好 50 条（不超 P98 阈值），最大值 300 应被取作 INP
    const records = Array.from({ length: 49 }, (_, i) => interaction(i + 10))
    records.push(interaction(300)) // 最大值
    const r = computeINPFromInteractions(records)
    expect(r.value).toBe(300)
    expect(r.record?.duration).toBe(300)
  })

  it('交互数 > 50：取 P98，忽略 top 2%（过滤系统抖动）', () => {
    // 100 条交互，延迟从 10 到 109 线性递增
    const records = Array.from({ length: 100 }, (_, i) => interaction(i + 10))
    // 再加 2 条极端值（模拟 GC/IO 抖动）——P98 应忽略它们
    records.push(interaction(9999))
    records.push(interaction(9998))
    const r = computeINPFromInteractions(records)

    // 总共 102 条，P98 idx = floor(102 * 0.98) - 1 = 98（0-based）
    // 排序后跳过 top 2%（9999、9998），第 98 位（0-based）= 原来的 109
    expect(r.value).toBeLessThan(9998)
    expect(r.record).toBeDefined()
    // 落在 109 附近（确切值取决于排序，但绝不能是抖动值）
    expect(r.value).toBeGreaterThan(100)
  })

  it('附带的 record 永远是值最大的那条（worst-case 场景）', () => {
    const records = [
      interaction(50, 'pointerdown'),
      interaction(200, 'click'),
      interaction(80, 'keydown'),
    ]
    const r = computeINPFromInteractions(records)
    expect(r.value).toBe(200)
    expect(r.record?.name).toBe('click')
  })
})
