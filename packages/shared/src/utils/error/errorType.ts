/**
 * 错误类型识别和分类模块
 *
 * 提供错误消息解析、错误类型判断等功能
 *
 * @module errorType
 */

import { ErrorType } from '../../types/base/common'
import { ERROR_TYPE_RE } from '../../types/base/constant'

/**
 * 解析的错误信息
 */
export interface ParsedErrorInfo {
  /** 错误类型名称（如 'TypeError', 'ReferenceError'） */
  errorType: string
  /** 错误消息（去除类型前缀） */
  message: string
  /** 是否有 'Uncaught' 前缀 */
  isUncaught: boolean
}

/**
 * 解析错误消息，提取错误类型和消息
 *
 * @param errorMessage 原始错误消息
 * @returns 解析后的错误信息
 *
 * @example
 * parseErrorMessage('Uncaught TypeError: Cannot read property "x" of undefined')
 * // 返回:
 * // {
 * //   errorType: 'TypeError',
 * //   message: 'Cannot read property "x" of undefined',
 * //   isUncaught: true
 * // }
 *
 * parseErrorMessage('ReferenceError: xxx is not defined')
 * // 返回:
 * // {
 * //   errorType: 'ReferenceError',
 * //   message: 'xxx is not defined',
 * //   isUncaught: false
 * // }
 */
export function parseErrorMessage(errorMessage: string): ParsedErrorInfo {
  const matches = errorMessage.match(ERROR_TYPE_RE)

  if (!matches) {
    // 没有匹配到标准格式，返回原始消息
    return {
      errorType: ErrorType.UNKNOWN_ERROR,
      message: errorMessage,
      isUncaught: false,
    }
  }

  // matches[1]: 错误类型（如 'TypeError'）
  // matches[2]: 错误消息
  const errorType = matches[1] || ErrorType.UNKNOWN_ERROR
  const message = matches[2] || errorMessage
  const isUncaught = errorMessage.toLowerCase().startsWith('uncaught')

  return {
    errorType,
    message,
    isUncaught,
  }
}

/**
 * 从错误对象中提取错误类型
 *
 * @param error 错误对象
 * @returns 错误类型字符串
 */
export function getErrorType(error: Error): string {
  // 如果错误对象有 name 属性，直接使用
  if (error.name) {
    return error.name
  }

  // 否则尝试从消息中解析
  const parsed = parseErrorMessage(error.message)
  return parsed.errorType
}

/**
 * 判断是否为特定类型的错误
 *
 * @param error 错误对象
 * @param type 错误类型（如 'TypeError', 'ReferenceError'）
 * @returns 是否为该类型错误
 */
export function isErrorType(error: Error, type: string): boolean {
  const errorType = getErrorType(error)
  return errorType === type || errorType.endsWith(type)
}

/**
 * 判断是否为网络错误
 *
 * @param errorMessage 错误消息
 * @returns 是否为网络错误
 */
export function isNetworkError(errorMessage: string): boolean {
  const networkKeywords = [
    'network',
    'fetch',
    'xhr',
    'request',
    'connection',
    'timeout',
    'cors',
    'cross-origin',
  ]

  const lowerMessage = errorMessage.toLowerCase()
  return networkKeywords.some((keyword) => lowerMessage.includes(keyword))
}

/**
 * 判断是否为资源加载错误
 *
 * @param errorMessage 错误消息
 * @returns 是否为资源加载错误
 */
export function isResourceError(errorMessage: string): boolean {
  const resourceKeywords = ['loading', 'failed to load', '404', 'not found', 'resource']

  const lowerMessage = errorMessage.toLowerCase()
  return resourceKeywords.some((keyword) => lowerMessage.includes(keyword))
}

/**
 * 判断是否为跨域错误
 *
 * @param errorMessage 错误消息
 * @returns 是否为跨域错误
 */
export function isCorsError(errorMessage: string): boolean {
  const corsKeywords = ['cors', 'cross-origin', 'cross origin', 'access-control']

  const lowerMessage = errorMessage.toLowerCase()
  return corsKeywords.some((keyword) => lowerMessage.includes(keyword))
}

/**
 * 判断是否为脚本错误（Script error）
 *
 * 脚本错误通常是跨域错误的表现
 *
 * @param errorMessage 错误消息
 * @returns 是否为脚本错误
 */
export function isScriptError(errorMessage: string): boolean {
  return /^script error\.?$/i.test(errorMessage.trim())
}

/**
 * 根据错误消息推断错误类型
 *
 * @param errorMessage 错误消息
 * @returns 推断的错误类型枚举
 */
export function inferErrorType(errorMessage: string): ErrorType {
  // 1. 检查是否为脚本错误（跨域）
  if (isScriptError(errorMessage)) {
    return ErrorType.CORS_ERROR
  }

  // 2. 检查是否为跨域错误
  if (isCorsError(errorMessage)) {
    return ErrorType.CORS_ERROR
  }

  // 3. 检查是否为网络错误
  if (isNetworkError(errorMessage)) {
    return ErrorType.TIMEOUT_ERROR
  }

  // 4. 检查是否为资源加载错误
  if (isResourceError(errorMessage)) {
    return ErrorType.RESOURCE_ERROR
  }

  // 5. 尝试从消息中解析标准错误类型
  const parsed = parseErrorMessage(errorMessage)

  // 映射到我们的错误类型枚举
  const typeMapping: Record<string, ErrorType> = {
    EvalError: ErrorType.JAVASCRIPT_ERROR,
    InternalError: ErrorType.JAVASCRIPT_ERROR,
    RangeError: ErrorType.JAVASCRIPT_ERROR,
    ReferenceError: ErrorType.JAVASCRIPT_ERROR,
    SyntaxError: ErrorType.JAVASCRIPT_ERROR,
    TypeError: ErrorType.JAVASCRIPT_ERROR,
    URIError: ErrorType.JAVASCRIPT_ERROR,
    Error: ErrorType.JAVASCRIPT_ERROR,
  }

  return typeMapping[parsed.errorType] || ErrorType.UNKNOWN_ERROR
}

/**
 * 格式化错误消息（去除前缀和多余信息）
 *
 * @param error 错误对象
 * @returns 格式化后的错误消息
 */
export function formatErrorMessage(error: Error): string {
  const parsed = parseErrorMessage(error.message)

  // 如果是 'Uncaught' 错误，可以去掉前缀
  if (parsed.isUncaught) {
    return parsed.message
  }

  return parsed.message
}

/**
 * 判断错误是否应该被忽略（根据配置）
 *
 * @param error 错误对象
 * @param ignoreRules 忽略规则
 * @returns 是否应该忽略该错误
 */
export function shouldIgnoreError(
  error: Error,
  ignoreRules: {
    /** 忽略的错误类型列表 */
    errorTypes?: string[]
    /** 忽略的错误消息正则列表 */
    messagePatterns?: RegExp[]
    /** 忽略的URL正则列表 */
    urlPatterns?: RegExp[]
  } = {}
): boolean {
  const { errorTypes, messagePatterns, urlPatterns } = ignoreRules

  // 1. 检查错误类型
  if (errorTypes && errorTypes.length > 0) {
    const errorType = getErrorType(error)
    if (errorTypes.some((type) => errorType === type || errorType.endsWith(type))) {
      return true
    }
  }

  // 2. 检查错误消息
  if (messagePatterns && messagePatterns.length > 0) {
    if (messagePatterns.some((pattern) => pattern.test(error.message))) {
      return true
    }
  }

  // 3. 检查堆栈中的URL（如果有）
  if (urlPatterns && urlPatterns.length > 0 && error.stack) {
    if (urlPatterns.some((pattern) => pattern.test(error.stack ?? ''))) {
      return true
    }
  }

  return false
}
