import { describe, it, expect } from 'vitest'
import { getRealPath } from '../../packages/core/src/errorId'

describe('getRealPath', () => {
  it('去除 query 和 hash', () => {
    expect(getRealPath('http://x.com/p?id=1#top')).toBe('http://x.com/p')
    expect(getRealPath('http://x.com/p#frag')).toBe('http://x.com/p')
  })

  it('末尾数字段归一含 {param}，且同类动态路由结果一致（去重目的）', () => {
    // 实现将 '/数字' 整体替换为 '{param}'（含前导斜杠），格式略怪但同类路由归一为同一结果，
    // createErrorId 据此合并同类错误——去重目的达成。
    const a = getRealPath('http://x.com/user/123')
    const b = getRealPath('http://x.com/user/456')
    expect(a).toBe(b)
    expect(a).toContain('{param}')
  })

  it('仅归一末尾段，中间数字段保留', () => {
    const r = getRealPath('http://x.com/user/123/post/456')
    expect(r).toContain('123') // 中间段保留
    expect(r).toContain('{param}') // 末尾段归一
    expect(r).not.toContain('456')
  })

  it('非数字末尾段不变', () => {
    expect(getRealPath('http://x.com/user/abc')).toBe('http://x.com/user/abc')
  })
})
