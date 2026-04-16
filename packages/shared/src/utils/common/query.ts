/**
 * URL 查询参数处理模块
 *
 * 提供对象与查询字符串相互转换的工具函数
 *
 * @module query
 */

/**
 * 将对象转换为查询字符串
 *
 * @param obj 要转换的对象
 * @returns 查询字符串
 *
 * @example
 * splitObjToQuery({ a: 1, b: 2 })
 * // 返回: 'a=1&b=2'
 *
 * splitObjToQuery({ name: '张三', age: 18 })
 * // 返回: 'name=%E5%BC%A0%E4%B8%89&age=18'（自动编码）
 */
export function splitObjToQuery(obj: Record<string, unknown>): string {
  return Object.keys(obj)
    .map((key) => {
      const value = obj[key]
      // 处理 null 和 undefined
      if (value === null || value === undefined) {
        return `${encodeURIComponent(key)}=`
      }
      // 转换为字符串并编码
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    })
    .join('&')
}

/**
 * 设置 URL 的查询参数
 *
 * @param url 原始URL
 * @param query 查询参数（对象或字符串）
 * @returns 带查询参数的URL
 *
 * @example
 * setUrlQuery('https://example.com', { a: 1, b: 2 })
 * // 返回: 'https://example.com?a=1&b=2'
 *
 * setUrlQuery('https://example.com?x=1', { y: 2 })
 * // 返回: 'https://example.com?x=1&y=2'（保留原有参数）
 */
export function setUrlQuery(url: string, query: Record<string, unknown> | string): string {
  // 转换为查询字符串
  const queryString = typeof query === 'string' ? query : splitObjToQuery(query)

  // 检查URL是否已有查询参数
  const separator = url.includes('?') ? '&' : '?'

  return `${url}${separator}${queryString}`
}

/**
 * 解析 URL 的查询参数为对象
 *
 * @param url URL字符串
 * @returns 查询参数对象
 *
 * @example
 * parseUrlQuery('https://example.com?a=1&b=2')
 * // 返回: { a: '1', b: '2' }
 */
export function parseUrlQuery(url: string): Record<string, string> {
  const queryString = url.split('?')[1]
  if (!queryString) return {}

  const params: Record<string, string> = {}
  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=')
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '')
    }
  })

  return params
}
