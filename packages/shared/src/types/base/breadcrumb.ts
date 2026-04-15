/**
 * 用户行为栈数据定义
 */
import { Severity } from './common'

/**
 * 用户行为栈数据
 */
export interface BreadcrumbData {
  /** 类型 */
  type: string
  /** 类别 */
  category: string
  /** 数据 */
  data: unknown
  /** 级别 */
  level: Severity
  /** 时间戳 */
  time: number
}

/**
 * 面包屑配置
 */
export interface BreadcrumbConfig {
  /** 最大栈数量 */
  maxBreadcrumbs?: number
  /** 添加前的钩子函数 */
  beforeAddBreadcrumb?: (data: BreadcrumbData) => BreadcrumbData | null
}
