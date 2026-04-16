/**
 * HTTP 工具模块
 *
 * 提供 HTTP 状态码判断、分类等工具函数
 *
 * @module http
 */

/**
 * HTTP 状态码分类
 */
export enum HttpStatusCategory {
  /** 信息响应 */
  INFORMATIONAL = 'informational',
  /** 成功响应 */
  SUCCESS = 'success',
  /** 重定向 */
  REDIRECT = 'redirect',
  /** 客户端错误 */
  CLIENT_ERROR = 'client_error',
  /** 服务器错误 */
  SERVER_ERROR = 'server_error',
}

/**
 * 判断 HTTP 状态码是否表示失败
 *
 * @param status HTTP 状态码
 * @returns 是否为失败状态码
 *
 * @example
 * isHttpFail(200)
 * // 返回: false（成功）
 *
 * isHttpFail(404)
 * // 返回: true（失败）
 *
 * isHttpFail(500)
 * // 返回: true（失败）
 */
export function isHttpFail(status: number): boolean {
  return status < 200 || status >= 400
}

/**
 * 判断 HTTP 状态码是否表示成功
 *
 * @param status HTTP 状态码
 * @returns 是否为成功状态码
 *
 * @example
 * isHttpSuccess(200)
 * // 返回: true
 *
 * isHttpSuccess(304)
 * // 返回: true
 *
 * isHttpSuccess(404)
 * // 返回: false
 */
export function isHttpSuccess(status: number): boolean {
  return status >= 200 && status < 400
}

/**
 * 获取 HTTP 状态码的分类
 *
 * @param status HTTP 状态码
 * @returns 状态码分类
 *
 * @example
 * getHttpStatusCategory(200)
 * // 返回: HttpStatusCategory.SUCCESS
 *
 * getHttpStatusCategory(404)
 * // 返回: HttpStatusCategory.CLIENT_ERROR
 *
 * getHttpStatusCategory(500)
 * // 返回: HttpStatusCategory.SERVER_ERROR
 */
export function getHttpStatusCategory(status: number): HttpStatusCategory {
  if (status >= 100 && status < 200) {
    return HttpStatusCategory.INFORMATIONAL
  }
  if (status >= 200 && status < 300) {
    return HttpStatusCategory.SUCCESS
  }
  if (status >= 300 && status < 400) {
    return HttpStatusCategory.REDIRECT
  }
  if (status >= 400 && status < 500) {
    return HttpStatusCategory.CLIENT_ERROR
  }
  if (status >= 500) {
    return HttpStatusCategory.SERVER_ERROR
  }

  return HttpStatusCategory.SERVER_ERROR // 默认为服务器错误
}

/**
 * 判断是否为客户端错误（4xx）
 *
 * @param status HTTP 状态码
 * @returns 是否为客户端错误
 */
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500
}

/**
 * 判断是否为服务器错误（5xx）
 *
 * @param status HTTP 状态码
 * @returns 是否为服务器错误
 */
export function isServerError(status: number): boolean {
  return status >= 500
}

/**
 * 判断是否为重定向（3xx）
 *
 * @param status HTTP 状态码
 * @returns 是否为重定向
 */
export function isRedirect(status: number): boolean {
  return status >= 300 && status < 400
}
