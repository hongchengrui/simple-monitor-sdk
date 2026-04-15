/**
 * API重写相关类型定义
 * 用于定义需要替换或重写的原生API的数据结构
 */

/**
 * 控制台触发数据
 * 用于重写 console.log/error/warn 等方法时的数据传递
 */
export interface ConsoleTriggerData {
  /** console 参数 */
  args: unknown[]
  /** 日志级别（log、info、warn、error） */
  level: string
}

/**
 * 路由信息
 * 用于重写 history.pushState/replaceState 时的数据传递
 */
export interface RouterInfo {
  /** 来源路由 */
  from: string
  /** 目标路由 */
  to: string
}

/**
 * 任意对象类型
 */
export interface IAnyObject {
  [key: string]: unknown
}

/**
 * 数字、字符串或对象类型
 */
export type TNumStrObj = number | string | Record<string, unknown>

/**
 * 本地存储值（支持过期时间）
 */
export interface LocalStorageValue<T = unknown> {
  /** 过期时间戳（毫秒） */
  expireTime?: number
  /** 存储的值 */
  value: T | string
}

/**
 * 空函数类型
 */
export type voidFun = () => void
