/**
 * HTTP状态码处理工具
 */

/**
 * 判断是否为HTTP错误
 */
export function isHttpError(status: number): boolean {
  return status >= 400 && status < 600
}

/**
 * 判断是否为客户端错误
 */
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500
}

/**
 * 判断是否为服务器错误
 */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600
}

/**
 * 获取HTTP错误分类
 */
export function getHttpCategory(status: number): 'success' | 'client' | 'server' {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 400 && status < 500) return 'client'
  if (status >= 500) return 'server'
  return 'client'
}

/**
 * 判断请求是否超时
 */
export function isTimeout(elapsedTime?: number, threshold = 10000): boolean {
  if (!elapsedTime) return false
  return elapsedTime > threshold
}
