// node 环境没有 sessionStorage；errorId.ts 走 feature-detect，没有时降级纯内存。
// 这里手挂一个内存版 sessionStorage，让持久化路径可被测试观测（等价于浏览器的存储行为）。
const memStore: Record<string, string> = {}
;(globalThis as any).sessionStorage = {
  getItem: (k: string) => (k in memStore ? memStore[k] : null),
  setItem: (k: string, v: string) => {
    memStore[k] = v
  },
  removeItem: (k: string) => {
    delete memStore[k]
  },
  clear: () => {
    for (const k of Object.keys(memStore)) delete memStore[k]
  },
  key: (i: number) => Object.keys(memStore)[i] ?? null,
  get length() {
    return Object.keys(memStore).length
  },
}
import { describe, it, expect, beforeEach } from 'vitest'
import { createErrorId, clearDedup } from '@simple-monitor/core'
import { ErrorTypes, EventTypes } from '@simple-monitor/types'
import type { ReportDataType } from '@simple-monitor/types'

/**
 * createErrorId 错误指纹去重单测
 *
 * errorId.ts 用内存 cache + sessionStorage 双层累积计数。
 * 每个测试用独立 message + apikey 组合避免指纹互扰。
 */
describe('createErrorId 错误指纹去重', () => {
  it('JAVASCRIPT_ERROR：同错误达到 maxDuplicateCount(默认2) 后返回 null', () => {
    const data: ReportDataType = {
      type: ErrorTypes.JAVASCRIPT_ERROR,
      name: 'Error',
      message: 'unit-js-dedup',
      url: 'http://localhost/',
      level: 'normal',
    }
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).toBeNull()
  })

  it('PROMISE_ERROR（reason 非 Error，name=unhandledrejection）：同原因第 3 次返回 null', () => {
    const data: ReportDataType = {
      type: ErrorTypes.PROMISE_ERROR,
      name: EventTypes.UNHANDLEDREJECTION,
      message: 'unit-promise-str',
      url: 'http://localhost/',
      level: 'low',
    }
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).toBeNull()
  })

  it('PROMISE_ERROR（reason 为 Error，name=Error）：同原因第 3 次返回 null', () => {
    const data: ReportDataType = {
      type: ErrorTypes.PROMISE_ERROR,
      name: 'Error',
      message: 'unit-promise-err',
      url: 'http://localhost/',
      level: 'low',
    }
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).toBeNull()
  })

  it('不同 message 视为不同错误，各自独立计数', () => {
    const base = {
      type: ErrorTypes.JAVASCRIPT_ERROR,
      name: 'Error',
      url: 'http://localhost/',
      level: 'normal',
    }
    const a = { ...base, message: 'unit-distinct-a' }
    const b = { ...base, message: 'unit-distinct-b' }
    expect(createErrorId({ ...a }, 'k')).not.toBeNull()
    expect(createErrorId({ ...b }, 'k')).not.toBeNull()
    expect(createErrorId({ ...a }, 'k')).not.toBeNull()
    expect(createErrorId({ ...a }, 'k')).toBeNull()
    expect(createErrorId({ ...b }, 'k')).not.toBeNull()
  })

  it('apikey 参与指纹：同错误不同 apikey 视为不同来源', () => {
    const data: ReportDataType = {
      type: ErrorTypes.JAVASCRIPT_ERROR,
      name: 'Error',
      message: 'unit-apikey',
      url: 'http://localhost/',
      level: 'normal',
    }
    expect(createErrorId({ ...data }, 'key-A')).not.toBeNull()
    expect(createErrorId({ ...data }, 'key-B')).not.toBeNull()
    expect(createErrorId({ ...data }, 'key-A')).not.toBeNull()
    expect(createErrorId({ ...data }, 'key-A')).toBeNull()
  })
})

describe('createErrorId 会话级持久化（sessionStorage）', () => {
  beforeEach(() => clearDedup())

  const base: ReportDataType = {
    type: ErrorTypes.JAVASCRIPT_ERROR,
    name: 'Error',
    url: 'http://localhost/',
    level: 'normal',
  }

  it('clearDedup 清空后，之前已达上限的错误可重新上报', () => {
    const data = { ...base, message: 'unit-persist-reset' }
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).toBeNull()

    clearDedup()

    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).toBeNull()
  })

  it('计数写入 sessionStorage，值为 2', () => {
    const data = { ...base, message: 'unit-persist-survive' }

    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()

    const dedupKeys = Object.keys(memStore).filter((k) => k.startsWith('monitor:dedup:'))
    expect(dedupKeys.length).toBe(1)
    expect(memStore[dedupKeys[0]]).toBe('2')
  })
})
