/**
 * 错误处理工具模块
 *
 * 提供错误ID生成、去重、URL标准化、堆栈解析、错误分类等功能
 *
 * @module error
 */

// 导出哈希算法
export { hashCode } from './hashCode'

// 导出URL处理工具
export { getRealPath, removeHashPath } from './urlPath'

// 导出错误ID生成和去重
export {
  createErrorId,
  setMaxDuplicateCount,
  getMaxDuplicateCount,
  resetErrorCounts,
  getErrorCount,
  getAllErrorCounts,
} from './errorId'

// 导出堆栈解析
export {
  parseErrorStack,
  getFirstStackFrame,
  formatStackTrace,
  extractFileName,
  isNativeFrame,
  isThirdPartyFrame,
} from './stackParser'

// 导出错误类型识别和分类
export {
  parseErrorMessage,
  getErrorType,
  isErrorType,
  isNetworkError,
  isResourceError,
  isCorsError,
  isScriptError,
  inferErrorType,
  formatErrorMessage,
  shouldIgnoreError,
} from './errorType'

// 导出类型定义
export type { ParsedErrorInfo } from './errorType'
