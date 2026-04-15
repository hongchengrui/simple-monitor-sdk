/**
 * 用户行为监控相关类型定义
 */

/**
 * 行为数据结构
 */
export interface BehaviorData {
  /** 行为动作 */
  action: string
  /** 元素信息 */
  element?: {
    /** 元素标签名 */
    tag: string
    /** 元素ID */
    id?: string
    /** 元素类名 */
    className?: string
    /** 元素文本内容 */
    text?: string
    /** XPath选择器 */
    xpath?: string
    /** CSS选择器 */
    selector?: string
  }
  /** 路由信息 */
  route?: {
    /** 来源页面 */
    from: string
    /** 目标页面 */
    to: string
    /** 路由类型 */
    type: 'history' | 'hash' | 'popstate'
  }
  /** 额外数据 */
  extra?: Record<string, unknown>
}

/**
 * DOM元素信息
 */
export interface DOMElementInfo {
  /** 元素标签名 */
  tagName: string
  /** 元素ID */
  id?: string
  /** 元素类名 */
  className?: string
  /** 元素文本内容 */
  text?: string
  /** XPath选择器 */
  xpath?: string
  /** CSS选择器 */
  selector?: string
  /** 元素属性 */
  attributes?: Record<string, string>
  /** 元素位置信息 */
  position?: {
    /** 距离顶部距离 */
    top: number
    /** 距离左侧距离 */
    left: number
    /** 元素宽度 */
    width: number
    /** 元素高度 */
    height: number
  }
}

/**
 * 路由变化信息
 */
export interface RouteChangeInfo {
  /** 来源页面 */
  from: string
  /** 目标页面 */
  to: string
  /** 路由类型 */
  type: 'history' | 'hash' | 'popstate'
  /** 变化时间 */
  timestamp?: number
}
