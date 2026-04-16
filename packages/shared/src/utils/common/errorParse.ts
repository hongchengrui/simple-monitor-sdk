/**
 * 错误解析模块
 *
 * 提供错误对象解析、格式化等工具函数
 *
 * @module errorParse
 */

/**
 * 将错误对象转换为字符串
 *
 * @param err 错误对象（任意类型）
 * @returns 错误字符串
 *
 */
export function parseErrorString(err: unknown): string {
  if (!err) {
    return ''
  }

  // Error 对象
  if (err instanceof Error) {
    return err.message ? err.toString() : String(err)
  }

  // 字符串
  if (typeof err === 'string') {
    return err
  }

  // 对象
  if (typeof err === 'object') {
    try {
      return JSON.stringify(err)
    } catch {
      return String(err)
    }
  }

  // 其他类型
  return String(err)
}

/**
 * 从错误对象中提取错误消息
 *
 * @param err 错误对象
 * @returns 错误消息
 *
 * @example
 * getErrorMessage(new Error('test error'))
 * // 返回: 'test error'
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message
  }

  return parseErrorString(err)
}

/**
 * 从错误对象中提取错误堆栈
 *
 * @param err 错误对象
 * @returns 错误堆栈
 *
 * @example
 * const error = new Error('test')
 * console.log(getErrorStack(error))
 * // 返回: 堆栈信息
 */
export function getErrorStack(err: unknown): string | undefined {
  if (err instanceof Error) {
    return err.stack
  }

  return undefined
}
