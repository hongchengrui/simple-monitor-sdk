import { describe, it, expect } from 'vitest'
import { metricsName } from '../../packages/web-performance/src/constants'
import MetricsStore from '../../packages/web-performance/src/lib/store'
import calcScore from '../../packages/web-performance/src/lib/calculateScore'
import { QUANTILE_AT_VALUE } from '../../packages/web-performance/src/utils/math'
import getPath from '../../packages/web-performance/src/utils/getPath'
import generateUniqueID from '../../packages/web-performance/src/utils/generateUniqueID'

describe('MetricsStore', () => {
  it('set/get/has/clear/getValues', () => {
    const store = new MetricsStore()
    store.set(metricsName.LCP, { name: metricsName.LCP, value: 2500, score: 0.1 })
    expect(store.has(metricsName.LCP)).toBe(true)
    expect(store.get(metricsName.LCP).value).toBe(2500)
    const all = store.getValues()
    expect(all[metricsName.LCP].value).toBe(2500)
    store.clear()
    expect(store.has(metricsName.LCP)).toBe(false)
  })
})

describe('calcScore / QUANTILE_AT_VALUE（对数正态评分）', () => {
  it('值越小分数越高（越好——calcScore 返回好度分数）', () => {
    const good = calcScore(metricsName.LCP, 1200) // 远小于 median → 高分
    const poor = calcScore(metricsName.LCP, 8000) // 远大于 median → 低分
    expect(good).not.toBeNull()
    expect(poor).not.toBeNull()
    expect(good as number).toBeGreaterThan(poor as number)
  })

  it('INP 有评分配置', () => {
    expect(calcScore(metricsName.INP, 100)).not.toBeNull()
  })

  it('未配置的指标返回 null', () => {
    expect(calcScore('not-exist', 100)).toBeNull()
  })

  it('QUANTILE_AT_VALUE 直接调用', () => {
    const q = QUANTILE_AT_VALUE({ median: 4000, p10: 2500 }, 2500)
    expect(q).toBeGreaterThan(0)
    expect(q).toBeLessThan(1)
  })
})

describe('getPath', () => {
  it('history 模式取 pathname 并去掉尾部斜杠', () => {
    const loc = { pathname: '/detail/', href: '/detail/' } as Location
    expect(getPath(loc, false)).toBe('/detail')
  })

  it('hash 模式取 # 后路径', () => {
    const loc = { pathname: '/', href: 'http://x.com/#/user?id=1' } as Location
    expect(getPath(loc, true)).toBe('/user')
  })
})

describe('generateUniqueID', () => {
  it('生成 UUID v4 格式', () => {
    const id = generateUniqueID()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
})
