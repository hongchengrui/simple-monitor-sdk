/**
 * 错误数据类型定义
 */

export interface ErrorData {
  /** 错误类型 */
  type?: string
  /** 错误消息 */
  message?: string
  /** 错误堆栈 */
  stack?: string
  /** 错误文件名 */
  filename?: string
  /** 错误行号 */
  lineno?: number
  /** 错误列号 */
  colno?: number
  /** 错误名称 */
  name?: string
  /** 错误时间 */
  time?: number
  /** 错误ID */
  errorId?: string
}
