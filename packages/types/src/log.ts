/**
 * 手动上报日志类型定义
 */

import { Severity } from './Severity'
import { TNumStrObj } from './common'

/**
 * 日志上报参数
 */
export interface LogTypes {
  /** 日志内容 */
  message: TNumStrObj
  /** 自定义标签，用于分类筛选 */
  tag?: TNumStrObj
  /** 日志级别 */
  level?: Severity
  /** 异常对象，会提取堆栈信息 */
  ex?: Error | any
  /** 错误类型 */
  type?: string
}
