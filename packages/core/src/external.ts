/**
 * 手动上报 API
 * 提供给业务方的主动监控接口，允许开发者手动上报错误和日志
 */

import { ErrorTypes, BreadCrumbTypes, Severity, SeverityUtils } from '@simple-monitor/types'
import type { LogTypes } from '@simple-monitor/types'
import {
  isError,
  extractErrorStack,
  getLocationHref,
  getTimestamp,
  unknownToString,
  isWxMiniEnv,
  getCurrentRoute,
} from '@simple-monitor/utils'
import { transportData } from './transportData'
import { breadcrumb } from './breadcrumb'

/**
 * 手动上报日志
 *
 * @param options 日志配置
 * @param options.message 日志内容
 * @param options.tag 自定义标签，用于分类筛选
 * @param options.level 日志级别（默认 Critical）
 * @param options.ex 异常对象，会提取堆栈信息
 * @param options.type 错误类型（默认 LOG_ERROR）
 *
 * @example
 * ```typescript
 * import { log } from 'simple-monitor'
 * import { Severity } from '@simple-monitor/types'
 *
 * // 捕获业务异常并上报
 * try {
 *   processPayment()
 * } catch (err) {
 *   log({
 *     message: '支付处理失败',
 *     tag: 'payment',
 *     level: Severity.Critical,
 *     ex: err,
 *   })
 * }
 *
 * // 记录业务状态
 * if (userBalance < 0) {
 *   log({
 *     message: '用户余额异常',
 *     tag: 'balance_check',
 *     level: Severity.Warning,
 *   })
 * }
 * ```
 */
export function log({
  message = 'emptyMsg',
  tag = '',
  level = Severity.Critical,
  ex = '',
  type = ErrorTypes.LOG_ERROR,
}: LogTypes): void {
  // 如果是 Error 对象，提取堆栈信息
  let errorInfo: any = {}
  if (isError(ex)) {
    const stackResult = extractErrorStack(ex, level)
    if (stackResult) {
      errorInfo = stackResult
    }
  }

  // 组装错误数据
  const error = {
    type,
    level,
    message: unknownToString(message),
    name: 'Monitor.log',
    customTag: unknownToString(tag),
    time: getTimestamp(),
    url: isWxMiniEnv ? getCurrentRoute() : getLocationHref(),
    ...errorInfo,
  }

  // 添加到用户行为栈
  breadcrumb.push({
    type: BreadCrumbTypes.CUSTOMER,
    category: breadcrumb.getCategory(BreadCrumbTypes.CUSTOMER),
    data: message,
    level: SeverityUtils.fromString(level.toString()),
  })

  // 发送到服务端
  transportData.send(error)
}
