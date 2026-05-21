import { variableTypeDetection } from './is'

/**
 * 用&分割对象，返回a=1&b=2
 * @param obj 需要拼接的对象
 */
export function splitObjToQuery(obj: Record<string, unknown>): string {
  return Object.entries(obj).reduce((result, [key, value], index) => {
    if (index !== 0) {
      result += '&'
    }
    const valueStr =
      variableTypeDetection.isObject(value) || variableTypeDetection.isArray(value)
        ? JSON.stringify(value)
        : value
    result += `${key}=${valueStr}`
    return result
  }, '')
}

/**
 * 截取字符串，超出长度时添加提示
 * @param str 原字符串
 * @param interceptLength 截取长度
 */
export function interceptStr(str: string, interceptLength: number): string {
  if (!variableTypeDetection.isString(str)) {
    return ''
  }
  return (
    str.slice(0, interceptLength) +
    (str.length > interceptLength ? `:截取前${interceptLength}个字符` : '')
  )
}

/**
 * 将任意值转换为字符串
 * @param target 要转换的值
 */
export function unknownToString(target: unknown): string {
  if (variableTypeDetection.isString(target)) {
    return target as string
  }
  if (variableTypeDetection.isUndefined(target)) {
    return 'undefined'
  }
  return JSON.stringify(target)
}

/**
 * 给url添加query
 * @param url 原URL
 * @param query 查询参数对象
 */
export function setUrlQuery(url: string, query: Record<string, any>): string {
  const queryArr: string[] = []
  Object.keys(query).forEach((k) => {
    queryArr.push(`${k}=${query[k]}`)
  })
  if (url.indexOf('?') !== -1) {
    url = `${url}&${queryArr.join('&')}`
  } else {
    url = `${url}?${queryArr.join('&')}`
  }
  return url
}
