import { describe, it, expect } from 'vitest'
import { createErrorId } from '@simple-monitor/core'
import { ErrorTypes, EventTypes } from '@simple-monitor/types'
import type { ReportDataType } from '@simple-monitor/types'

/**
 * createErrorId 错误指纹去重单测
 *
 * errorId.ts 内部用模块级 allErrorNumber 单例累积计数（跨 test 不重置）。
 * 因此每个 test 使用独立的 message + apikey 组合，确保 errorId 指纹互不干扰。
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
    // 第 1、2 次正常返回 errorId
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    expect(createErrorId({ ...data }, 'k')).not.toBeNull()
    // 第 3 次被去重丢弃
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
    // 对应 handleUnhandledRejection 中 reason instanceof Error 的路径
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
    expect(createErrorId({ ...b }, 'k')).not.toBeNull() // b 第 1 次，独立
    expect(createErrorId({ ...a }, 'k')).not.toBeNull() // a 第 2 次
    expect(createErrorId({ ...a }, 'k')).toBeNull() // a 第 3 次 -> 去重
    expect(createErrorId({ ...b }, 'k')).not.toBeNull() // b 第 2 次，不受 a 影响
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
    expect(createErrorId({ ...data }, 'key-B')).not.toBeNull() // 不同 apikey，新指纹
    expect(createErrorId({ ...data }, 'key-A')).not.toBeNull() // key-A 第 2 次
    expect(createErrorId({ ...data }, 'key-A')).toBeNull() // key-A 第 3 次 -> 去重
  })
})
