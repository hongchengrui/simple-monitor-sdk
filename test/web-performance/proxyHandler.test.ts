import { describe, it, expect } from 'vitest'
import { normalizeResource } from '../../packages/web-performance/src/lib/proxyHandler'

describe('normalizeResource（fetch resource 归一化）', () => {
  it('string 透传', () => {
    expect(normalizeResource('/api/list')).toBe('/api/list')
    expect(normalizeResource('https://x.com/api/list')).toBe('https://x.com/api/list')
  })

  it('Request 对象取 .url（修复 #2：getApiPath 之前需先拿到 string）', () => {
    // 模拟 Request 对象结构（含 url 字段）
    expect(normalizeResource({ url: 'https://x.com/api/list' })).toBe('https://x.com/api/list')
  })

  it('null / undefined / 非对象 / 无 url → 空串', () => {
    expect(normalizeResource(null)).toBe('')
    expect(normalizeResource(undefined)).toBe('')
    expect(normalizeResource(123)).toBe('')
    expect(normalizeResource({})).toBe('')
  })
})
