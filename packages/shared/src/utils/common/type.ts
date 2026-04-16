/**
 * 类型转换模块
 *
 * 提供各种类型安全转换的工具函数
 *
 * @module type
 */

/**
 * 将未知类型转换为字符串
 *
 * @param value 未知类型的值
 * @returns 字符串
 *
 */
export function unknownToString(value: unknown): string {
  if (value === null) {
    return 'null'
  }

  if (value === undefined) {
    return 'undefined'
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (value instanceof Error) {
    return value.toString()
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/**
 * 将值转换为数字
 *
 * @param value 要转换的值
 * @param defaultValue 转换失败时的默认值
 * @returns 数字
 *
 * @example
 * toNumber('123')
 * // 返回: 123
 *
 * toNumber('abc', 0)
 * // 返回: 0（转换失败，使用默认值）
 *
 * toNumber(null, 0)
 * // 返回: 0
 */
export function toNumber(value: unknown, defaultValue = 0): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }

  return defaultValue
}

/**
 * 将值转换为布尔值
 *
 * @param value 要转换的值
 * @returns 布尔值
 */
export function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  return false
}

/**
 * 将值转换为数组
 *
 * @param value 要转换的值
 * @returns 数组
 *
 * @example
 * toArray('abc')
 * // 返回: ['abc']
 *
 * toArray(['a', 'b'])
 * // 返回: ['a', 'b']
 *
 * toArray(null)
 * // 返回: []
 */
export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value === null || value === undefined) {
    return []
  }

  return [value]
}
