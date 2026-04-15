/**
 * 用户行为栈事件类型（详细分类）
 */
export enum BreadCrumbTypes {
  /** 路由变化 */
  ROUTE = 'Route',
  /** 用户点击事件 */
  CLICK = 'Click',
  /** 控制台输出 */
  CONSOLE = 'Console',
  /** XMLHTTPRequest 请求 */
  XHR = 'Xhr',
  /** Fetch 请求 */
  FETCH = 'Fetch',
  /** 未处理的 Promise 拒绝 */
  UNHANDLEDREJECTION = 'Unhandledrejection',
  /** Vue 错误 */
  VUE = 'Vue',
  /** 资源加载错误 */
  RESOURCE = 'Resource',
  /** 代码错误 */
  CODE_ERROR = 'Code Error',
  /** 用户自定义行为 */
  CUSTOMER = 'Customer',
}

/**
 * 用户行为整合类型
 */
export enum BreadCrumbCategory {
  /** HTTP 请求类行为（包括 XHR、Fetch 等） */
  HTTP = 'http',
  /** 用户交互类行为（包括点击、触摸等） */
  USER = 'user',
  /** 调试类行为（包括控制台输出等） */
  DEBUG = 'debug',
  /** 异常类行为（包括各类错误、未处理的 Promise 等） */
  EXCEPTION = 'exception',
  /** 生命周期类行为（包括 APP、页面的生命周期事件） */
  LIFECYCLE = 'lifecycle',
}

/**
 * 重写的事件类型
 */
export enum EventTypes {
  /** XMLHTTPRequest 请求事件（需重写） */
  XHR = 'xhr',
  /** Fetch 请求事件（需重写） */
  FETCH = 'fetch',
  /** Console 控制台事件（需重写） */
  CONSOLE = 'console',
  /** DOM 事件（需重写） */
  DOM = 'dom',
  /** 路由 History 事件（需重写） */
  HISTORY = 'history',
  /** 错误事件（需重写） */
  ERROR = 'error',
  /** Hash 变化事件（需重写） */
  HASHCHANGE = 'hashchange',
  /** 未处理的 Promise 拒绝事件（需重写） */
  UNHANDLEDREJECTION = 'unhandledrejection',
  /** 监控 SDK 自定义事件 */
  MONITOR = 'monitor',
  /** Vue 框架错误事件 */
  VUE = 'Vue',
  /** 配置初始化事件 */
  CONFIG_INIT = 'config_init',
}

/**
 * HTTP 状态码
 */
export enum HttpCodes {
  /** 请求错误 - 请求参数有误或不完整 */
  BAD_REQUEST = 400,
  /** 未授权 - 需要身份验证 */
  UNAUTHORIZED = 401,
  /** 服务器内部错误 */
  INTERNAL_EXCEPTION = 500,
}

/**
 * 错误类型正则表达式
 * 用于解析 JavaScript 错误消息，提取错误类型和错误信息
 * 匹配格式：Uncaught Error: error message
 */
export const ERROR_TYPE_RE =
  /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/
