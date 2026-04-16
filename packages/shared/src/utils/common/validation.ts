/**
 * 参数验证模块
 *
 * 提供各种参数类型验证函数
 * 用于配置项验证、运行时检查等
 *
 * @module validation
 */

/**
 * 验证选项类型
 *
 * @param value 要验证的值
 * @param key 参数名（用于错误提示）
 * @param type 期望的类型名称
 * @returns 是否验证通过
 *
 * @example
 * validateOption(123, 'maxDuplicateCount', 'number')
 * // 返回: true
 *
 * validateOption('abc', 'maxDuplicateCount', 'number')
 * // 返回: false
 * // 控制台警告: [Monitor] maxDuplicateCount 应该是 number 类型，当前为: string
 */
export function validateOption(value: unknown, key: string, type: string): boolean {
  // 获取值的实际类型
  const actualType = typeof value

  // 检查类型是否匹配
  if (actualType !== type) {
    console.warn(`[Monitor] ${key} 应该是 ${type} 类型，当前为: ${actualType}，值: ${value}`)
    return false
  }

  return true
}

/**
 * 验证是否为有效的URL
 *
 * @param url 要验证的URL
 * @returns 是否为有效URL
 *
 * @example
 * isValidUrl('https://example.com')
 * // 返回: true
 *
 * isValidUrl('not-a-url')
 * // 返回: false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证是否为有效的邮箱地址
 *
 * @param email 要验证的邮箱
 * @returns 是否为有效邮箱
 *
 * @example
 * isValidEmail('test@example.com')
 * // 返回: true
 *
 * isValidEmail('not-an-email')
 * // 返回: false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证数字是否在指定范围内
 *
 * @param value 要验证的数字
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 是否在范围内
 *
 * @example
 * isInRange(5, 1, 10)
 * // 返回: true
 *
 * isInRange(0, 1, 10)
 * // 返回: false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * 验证字符串是否为空
 *
 * @param str 要验证的字符串
 * @returns 是否为空字符串
 *
 * @example
 * isEmptyString('')
 * // 返回: true
 *
 * isEmptyString('  ')
 * // 返回: true（只包含空格）
 *
 * isEmptyString('hello')
 * // 返回: false
 */
export function isEmptyString(str: string | undefined | null): boolean {
  return !str || str.trim().length === 0
}

/**
 * 验证对象是否为空
 *
 * @param obj 要验证的对象
 * @returns 是否为空对象
 *
 * @example
 * isEmptyObject({})
 * // 返回: true
 *
 * isEmptyObject({ a: 1 })
 * // 返回: false
 */
export function isEmptyObject(obj: Record<string, unknown> | null | undefined): boolean {
  if (!obj) return true
  return Object.keys(obj).length === 0
}

/**
 * 验证数组是否为空
 *
 * @param arr 要验证的数组
 * @returns 是否为空数组
 *
 * @example
 * isEmptyArray([])
 * // 返回: true
 *
 * isEmptyArray([1, 2])
 * // 返回: false
 */
export function isEmptyArray(arr: unknown[] | null | undefined): boolean {
  return !arr || arr.length === 0
}

/**
 * 验证是否为有效的正则表达式
 *
 * @param regex 要验证的正则表达式
 * @returns 是否为有效正则
 *
 * @example
 * isValidRegex(/test/)
 * // 返回: true
 *
 * isValidRegex('[invalid')
 * // 返回: false
 */
export function isValidRegex(regex: RegExp): boolean {
  try {
    // 尝试使用正则表达式
    regex.test('')
    return true
  } catch {
    return false
  }
}
