/**
 * 错误数据转换工具
 */
import type { ErrorData, Severity } from '../../types'

/**
 * 提取错误消息
 */
export function extractMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return String(error)
}

/**
 * 格式化错误对象为 ErrorData
 */
export function formatError(error: Error, url?: string): ErrorData {
  return {
    message: error.message,
    stack: error.stack,
    errorName: error.name,
    filename: (error as any).fileName || '',
    lineno: (error as any).lineNumber || undefined,
    colno: (error as any).columnNumber || undefined,
  }
}
