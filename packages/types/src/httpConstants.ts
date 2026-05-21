/**
 * HTTP 类型定义
 * 定义 HTTP 请求监控相关的类型
 */

/**
 * HTTP 请求方法类型 (标准枚举)
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * HTTP 方法枚举 (首字母大写，用于兼容)
 */
export enum EMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH',
}

/**
 * HTTP 状态码常量
 */
export enum HttpCodes {
  /** 400 错误请求 */
  BAD_REQUEST = 400,

  /** 401 未授权 */
  UNAUTHORIZED = 401,

  /** 403 禁止访问 */
  FORBIDDEN = 403,

  /** 404 未找到 */
  NOT_FOUND = 404,

  /** 408 请求超时 */
  REQUEST_TIMEOUT = 408,

  /** 500 内部服务器错误 */
  INTERNAL_EXCEPTION = 500,

  /** 502 网关错误 */
  BAD_GATEWAY = 502,

  /** 503 服务不可用 */
  SERVICE_UNAVAILABLE = 503,

  /** 504 网关超时 */
  GATEWAY_TIMEOUT = 504,
}

/**
 * HTTP 请求类型 (被监控的)
 */
export enum HttpTypes {
  /** XMLHttpRequest */
  XHR = 'xhr',

  /** Fetch API */
  FETCH = 'fetch',
}
