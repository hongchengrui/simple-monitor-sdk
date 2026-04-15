/**
 * 错误监控相关类型定义
 */

/**
 * 错误堆栈帧信息
 */
export interface ErrorStack {
  /** 函数参数 */
  args: unknown[]
  /** 函数名 */
  func: string
  /** 列号 */
  column: number
  /** 行号 */
  line: number
  /** 文件URL */
  url: string
}

/**
 * 集成的错误对象
 */
export interface IntegrationError {
  /** 错误信息 */
  message: string
  /** 错误名称 */
  name: string
  /** 错误堆栈 */
  stack: ErrorStack[]
}

/**
 * 资源加载错误的目标元素信息
 */
export interface ResourceErrorTarget {
  /** 资源的src属性（如script、img） */
  src?: string
  /** 资源的href属性（如link） */
  href?: string
  /** 元素的标签名 */
  localName?: string
}

/**
 * 错误数据结构
 */
export interface ErrorData {
  /** 错误消息 */
  message: string
  /** 错误堆栈 */
  stack?: string
  /** 错误文件名 */
  filename?: string
  /** 错误行号 */
  lineno?: number
  /** 错误列号 */
  colno?: number
  /** 错误名称 */
  errorName?: string
  /** 资源URL */
  resourceUrl?: string
  /** 资源类型 */
  resourceType?: string
  /** Promise rejection原因 */
  reason?: unknown
}
