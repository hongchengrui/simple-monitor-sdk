/**
 * SDK 全局变量管理
 * 包含 SDK 特定的全局状态
 */

import { MonitorSupport } from '@simple-monitor/types'
import { getGlobal, logger } from '@simple-monitor/utils'

/**
 * 获取全局对象
 */
const _global = getGlobal<any>()

/**
 * 获取或初始化 SDK 全局支持对象
 */
export function getGlobalMonitorSupport(): MonitorSupport {
  _global.__Monitor__ = _global.__Monitor__ || ({} as MonitorSupport)
  return _global.__Monitor__
}

/**
 * SDK 全局支持对象
 */
export const _support = getGlobalMonitorSupport()

/**
 * 静默控制台作用域
 * 在回调执行期间禁用日志记录
 * @param callback 要执行的回调函数
 */
export function silentConsoleScope<T>(callback: () => T): T {
  const prevStatus = logger.getEnableStatus()
  logger.disable()
  try {
    return callback()
  } finally {
    if (prevStatus) {
      logger.enable()
    }
  }
}

// 重新导出 utils 中的函数
export { getGlobal } from '@simple-monitor/utils'
