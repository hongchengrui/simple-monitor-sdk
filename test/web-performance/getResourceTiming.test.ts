import { describe, it, expect } from 'vitest'
import {
  buildResourceStages,
  buildResourceEntry,
  pickSlowResources,
} from '../../packages/web-performance/src/metrics/getResourceTiming'

/** 构造一个 PerformanceResourceTiming 替身 */
const mkEntry = (overrides: Partial<PerformanceResourceTiming> = {}): PerformanceResourceTiming =>
  ({
    name: 'https://x.com/app.js',
    initiatorType: 'script',
    startTime: 100,
    duration: 350,
    fetchStart: 100,
    domainLookupStart: 100,
    domainLookupEnd: 120,
    connectStart: 120,
    connectEnd: 150,
    secureConnectionStart: 125,
    requestStart: 150,
    responseStart: 200,
    responseEnd: 450,
    transferSize: 50000,
    ...overrides,
  }) as unknown as PerformanceResourceTiming

describe('buildResourceStages', () => {
  it('同源：拆解各阶段', () => {
    const s = buildResourceStages(mkEntry())
    expect(s).not.toBeNull()
    expect(s!.dnsLookup).toBe(20)
    expect(s!.connection).toBe(30)
    expect(s!.ssl).toBe(25)
    expect(s!.ttfb).toBe(50)
    expect(s!.download).toBe(250)
  })

  it('跨域无 TAO（responseStart=0 且 startTime>0）→ null', () => {
    const s = buildResourceStages(
      mkEntry({ responseStart: 0, requestStart: 0, domainLookupStart: 0, connectStart: 0 })
    )
    expect(s).toBeNull()
  })

  it('secureConnectionStart=0 → ssl 为 0', () => {
    const s = buildResourceStages(mkEntry({ secureConnectionStart: 0 }))
    expect(s!.ssl).toBe(0)
  })
})

describe('buildResourceEntry', () => {
  it('url 脱敏：去掉 query/hash', () => {
    const e = buildResourceEntry(mkEntry({ name: 'https://x.com/app.js?v=1&token=abc#/detail' }))
    expect(e.url).toBe('https://x.com/app.js')
  })

  it('transferSize < 0 → -1', () => {
    const e = buildResourceEntry(mkEntry({ transferSize: -1 }))
    expect(e.transferSize).toBe(-1)
  })
})

describe('pickSlowResources', () => {
  it('筛 duration >= threshold，降序，截 topN', () => {
    const slow = pickSlowResources(
      [
        mkEntry({ name: 'a', duration: 100 }),
        mkEntry({ name: 'b', duration: 500 }),
        mkEntry({ name: 'c', duration: 350 }),
        mkEntry({ name: 'd', duration: 200 }),
      ],
      300,
      2
    )
    expect(slow).toHaveLength(2)
    expect(slow[0].duration).toBe(500)
    expect(slow[1].duration).toBe(350)
  })

  it('无慢资源 → 空', () => {
    const slow = pickSlowResources([mkEntry({ duration: 100 })], 300, 10)
    expect(slow).toHaveLength(0)
  })
})
