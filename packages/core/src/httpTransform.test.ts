import { describe, it, expect } from 'vitest'
import { httpTransform } from '@simple-monitor/core'
import { HttpTypes, ErrorTypes } from '@simple-monitor/types'
import type { MonitorHttp } from '@simple-monitor/types'

const base = (over: Partial<MonitorHttp> = {}): MonitorHttp => ({
  type: HttpTypes.XHR,
  method: 'GET',
  url: 'http://localhost:3000/api/x',
  status: 200,
  time: 1000,
  elapsedTime: 100,
  ...over,
})

describe('httpTransform 状态码映射', () => {
  it('2xx → message=ok，name=type--method，type=FETCH_ERROR', () => {
    const r = httpTransform(base({ type: HttpTypes.XHR, method: 'GET', status: 200 }))
    expect(r.type).toBe(ErrorTypes.FETCH_ERROR) // 'HTTP_ERROR'
    expect(r.name).toBe('xhr--GET')
    expect(r.message).toBe('ok')
    expect(r.level).toBe('low')
  })

  it('404 → message 含 not_found', () => {
    const r = httpTransform(base({ status: 404 }))
    expect(r.message).toContain('not_found')
  })

  it('500 → message 含 internal_error', () => {
    const r = httpTransform(base({ status: 500 }))
    expect(r.message).toContain('internal_error')
  })

  it('status 0 且耗时短 → 跨域限制', () => {
    const r = httpTransform(base({ status: 0, elapsedTime: 200 }))
    expect(r.message).toContain('跨域')
  })

  it('status 0 且耗时长 → 超时', () => {
    const r = httpTransform(base({ status: 0, elapsedTime: 2000 }))
    expect(r.message).toContain('超时')
  })

  it('fetch 类型 → name=fetch--method', () => {
    const r = httpTransform(base({ type: HttpTypes.FETCH, method: 'POST' }))
    expect(r.name).toBe('fetch--POST')
  })
})
