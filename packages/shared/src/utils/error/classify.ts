/**
 * 错误分类工具
 */
import { ErrorType } from '../../types'

/**
 * 获取错误类型
 */
export function getErrorType(error: Error): ErrorType {
  const message = error.message.toLowerCase()
  const name = error.name.toLowerCase()

  // 网络相关
  if (message.includes('network') || message.includes('fetch')) {
    return ErrorType.HTTP_ERROR
  }

  // Promise 相关
  if (name.includes('promise')) {
    return ErrorType.PROMISE_ERROR
  }

  // 资源加载
  if (message.includes('loading') || message.includes('load')) {
    return ErrorType.RESOURCE_ERROR
  }

  // 跨域
  if (message.includes('cors') || message.includes('cross-origin')) {
    return ErrorType.CORS_ERROR
  }

  // 超时
  if (message.includes('timeout')) {
    return ErrorType.TIMEOUT_ERROR
  }

  // 默认 JS 错误
  return ErrorType.JAVASCRIPT_ERROR
}

/**
 * 根据HTTP状态码获取错误消息
 */
export function fromHttpStatus(status: number): string {
  switch (status) {
    case 400:
      return '请求参数错误'
    case 401:
      return '未授权，请重新登录'
    case 403:
      return '拒绝访问'
    case 404:
      return '请求资源不存在'
    case 408:
      return '请求超时'
    case 500:
      return '服务器内部错误'
    case 501:
      return '服务未实现'
    case 502:
      return '网关错误'
    case 503:
      return '服务不可用'
    case 504:
      return '网关超时'
    default:
      if (status >= 400 && status < 500) return '客户端错误'
      if (status >= 500) return '服务器错误'
      return '请求成功'
  }
}
