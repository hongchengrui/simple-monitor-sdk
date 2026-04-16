/**
 * 错误ID生成和去重模块
 *
 * 核心功能：
 * 1. 根据错误信息生成唯一ID
 * 2. 避免相同错误重复上报
 * 3. 限制每个错误的最大上报次数
 */

import { ErrorType } from '../../types'
import { EventTypes } from '../../types/base/constant'
import type { ReportDataType } from '../../types/base/transport'
import { hashCode } from './hashCode'
import { getRealPath } from './urlPath'

/**
 * 全局错误计数器
 * key: 错误ID（hashCode后的数字）
 * value: 上报次数
 */
const allErrorNumber: Record<number, number> = {}

/**
 * 最大重复上报次数（默认值，会被配置覆盖）
 */
let maxDuplicateCount = 2

/**
 * 设置最大重复上报次数
 *
 * @param count 最大重复次数
 */
export function setMaxDuplicateCount(count: number): void {
  if (count < 1) {
    console.warn('[Monitor] maxDuplicateCount 必须大于等于 1，已重置为 1')
    maxDuplicateCount = 1
  } else {
    maxDuplicateCount = count
  }
}

/**
 * 获取当前最大重复上报次数
 */
export function getMaxDuplicateCount(): number {
  return maxDuplicateCount
}

/**
 * 重置错误计数器（用于测试或手动清理）
 */
export function resetErrorCounts(): void {
  Object.keys(allErrorNumber).forEach((key) => {
    delete allErrorNumber[Number(key)]
  })
}

/**
 * 生成唯一错误ID并执行去重逻辑
 *
 * 根据不同的错误类型，拼接不同的字段来生成ID：
 * - HTTP_ERROR: type + method + status + getRealPath(url)
 * - JAVASCRIPT_ERROR/VUE_ERROR/REACT_ERROR: type + name + message
 * - PROMISE_ERROR: type + name + objectOrder(message) + getRealPath(url)
 * - 其他: type + message
 *
 * @param data 错误数据
 * @param apiKey 项目API密钥
 * @returns 错误ID | null（超过重复限制返回null）
 *
 * @example
 * const errorId = createErrorId(
 *   {
 *     type: ErrorType.HTTP_ERROR,
 *     request: { method: 'GET', url: 'http://example.com/api/123', data: null },
 *     response: { status: 500, data: '' }
 *   },
 *   'my-api-key'
 * )
 * // 返回: -123456789 (数字哈希值)
 */
export function createErrorId(data: ReportDataType, apiKey: string): number | null {
  let id: string

  // 根据错误类型拼接不同的字段
  switch (data.type) {
    case ErrorType.HTTP_ERROR:
      // HTTP 错误：type + method + status + getRealPath(url) + apiKey
      if (!data.request || !data.response) {
        console.warn('[Monitor] HTTP_ERROR 缺少 request 或 response 信息')
        return null
      }
      id =
        data.type +
        data.request.method +
        data.response.status +
        getRealPath(data.request.url) +
        apiKey
      break

    case ErrorType.JAVASCRIPT_ERROR:
    case ErrorType.VUE_ERROR:
    case ErrorType.REACT_ERROR:
      // JS 错误：type + name + message + apiKey
      id = data.type + (data.name || '') + (data.message || '') + apiKey
      break

    case ErrorType.PROMISE_ERROR:
      // Promise 错误：特殊处理（需要对象排序）
      id = generatePromiseErrorId(data, apiKey)
      break

    default:
      // 其他错误：type + message + apiKey
      id = (data.type || '') + (data.message || '') + apiKey
      break
  }

  // 转换为数字哈希
  const hashId = hashCode(id)

  // 去重检查
  if (allErrorNumber[hashId] >= maxDuplicateCount) {
    console.log(`[Monitor] 错误ID ${hashId} 已超过最大重复次数 ${maxDuplicateCount}，跳过上报`)
    return null
  }

  // 递增计数器
  if (typeof allErrorNumber[hashId] === 'number') {
    allErrorNumber[hashId]++
  } else {
    allErrorNumber[hashId] = 1
  }

  return hashId
}

/**
 * 生成 Promise 错误ID
 * Promise 错误需要特殊处理对象类型的 message
 *
 * @param data 错误数据
 * @param apiKey 项目API密钥
 * @returns 错误ID字符串
 */
function generatePromiseErrorId(data: ReportDataType, apiKey: string): string {
  const locationUrl = getRealPath(data.url)

  // unhandledrejection 事件
  if (data.name === EventTypes.UNHANDLEDREJECTION) {
    return data.type + objectOrder(data.message) + apiKey
  }

  // 其他 Promise 错误
  return data.type + (data.name || '') + objectOrder(data.message) + locationUrl
}

/**
 * 对象键排序 - 将对象的键按字母排序后序列化
 *
 * 作用：确保相同内容的对象生成相同的字符串
 * 例如：{b: 1, a: 2} 和 {a: 2, b: 1} 应该生成相同的ID
 *
 * @param reason 任何值（通常是字符串或对象）
 * @returns 排序后的字符串
 *
 * @example
 * objectOrder('{b: 1, a: 2}')  // 返回: '{"a":2,"b":1}'
 * objectOrder('simple string') // 返回: 'simple string'
 */
function objectOrder(reason: unknown): string {
  // 如果不是字符串，直接转字符串返回
  if (typeof reason !== 'string') {
    return String(reason)
  }

  /**
   * 递归排序函数
   */
  const sortFn = (obj: Record<string, unknown>): Record<string, unknown> => {
    return Object.keys(obj)
      .sort()
      .reduce((total: Record<string, unknown>, key: string) => {
        const value = obj[key]

        // 如果值是对象，递归排序
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          total[key] = sortFn(value as Record<string, unknown>)
        } else {
          total[key] = value
        }

        return total
      }, {})
  }

  try {
    // 尝试解析 JSON 对象
    if (/^\{.*\}$/.test(reason)) {
      const obj = JSON.parse(reason)
      const sortedObj = sortFn(obj)
      return JSON.stringify(sortedObj)
    }
  } catch (error) {
    // 解析失败，返回原始字符串
    console.warn('[Monitor] 对象排序失败，使用原始字符串:', error)
  }

  return reason
}

/**
 * 获取错误ID的上报次数
 * 用于调试和监控
 *
 * @param errorId 错误ID
 * @returns 上报次数
 */
export function getErrorCount(errorId: number): number {
  return allErrorNumber[errorId] || 0
}

/**
 * 获取所有错误ID的上报次数
 * 用于调试和监控
 */
export function getAllErrorCounts(): Record<number, number> {
  return { ...allErrorNumber }
}
