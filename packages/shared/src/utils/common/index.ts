/**
 * 通用工具函数模块
 *
 * 提供各种常用的工具函数：
 * - 节流函数
 * - 参数验证
 * - 字符串处理
 * - URL查询参数处理
 * - 错误解析
 * - HTTP工具
 * - 类型转换
 *
 * @module common
 */

// 导出节流函数
export { throttle } from './throttle'

// 导出参数验证
export {
  validateOption,
  isValidUrl,
  isValidEmail,
  isInRange,
  isEmptyString,
  isEmptyObject,
  isEmptyArray,
  isValidRegex,
} from './validation'

// 导出字符串处理
export { interceptStr, trim, toCamelCase, toKebabCase, randomString } from './string'

// 导出URL查询参数处理
export { splitObjToQuery, setUrlQuery, parseUrlQuery } from './query'

// 导出错误解析
export { parseErrorString, getErrorMessage, getErrorStack } from './errorParse'

// 导出HTTP工具
export {
  isHttpFail,
  isHttpSuccess,
  getHttpStatusCategory,
  isClientError,
  isServerError,
  isRedirect,
  HttpStatusCategory,
} from './http'

// 导出类型转换
export { unknownToString, toNumber, toBoolean, toArray } from './type'
