/**
 * 字符串处理模块
 *
 * 提供字符串截取、格式化等工具函数
 *
 * @module string
 */

/**
 * 截取字符串到指定长度
 *
 * @param str 原始字符串
 * @param maxLength 最大长度
 * @param suffix 后缀（默认 '...'）
 * @returns 截取后的字符串
 *
 * @example
 * interceptStr('这是一段很长的文本', 5)
 * // 返回: '这是一...'
 *
 * interceptStr('hello', 10)
 * // 返回: 'hello'（未超过长度，不截取）
 */
export function interceptStr(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) {
    return str
  }

  return str.substring(0, maxLength) + suffix
}

/**
 * 移除字符串首尾空格
 *
 * @param str 原始字符串
 * @returns 处理后的字符串
 *
 * @example
 * trim('  hello  ')
 * // 返回: 'hello'
 */
export function trim(str: string): string {
  return str.trim()
}

/**
 * 转换为驼峰命名
 *
 * @param str 下划线或短横线分隔的字符串
 * @returns 驼峰命名的字符串
 *
 * @example
 * toCamelCase('hello_world')
 * // 返回: 'helloWorld'
 *
 * toCamelCase('hello-world')
 * // 返回: 'helloWorld'
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase())
}

/**
 * 转换为短横线命名
 *
 * @param str 驼峰命名的字符串
 * @returns 短横线命名的字符串
 *
 * @example
 * toKebabCase('helloWorld')
 * // 返回: 'hello-world'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

/**
 * 生成随机字符串
 *
 * @param length 字符串长度
 * @param charset 字符集（默认字母+数字）
 * @returns 随机字符串
 *
 * @example
 * randomString(8)
 * // 返回: 'aB3xY9zQ'（8位随机字符串）
 */
export function randomString(
  length = 8,
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}
