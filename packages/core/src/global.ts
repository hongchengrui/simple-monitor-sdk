/**
 * SDK 全局变量管理
 * 包含 SDK 特定的全局状态
 */

import { MonitorSupport, EventTypes, WxAppEvents, WxPageEvents, InitOptions } from '@simple-monitor/types'
import { getGlobal, logger, setFlag } from '@simple-monitor/utils'

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

/**
 * 设置静默标志
 * 根据用户配置控制各类事件是否静默
 */
export function setSilentFlag(paramOptions: InitOptions = {}): void {
  setFlag(EventTypes.XHR, !!paramOptions.silentXhr)
  setFlag(EventTypes.FETCH, !!paramOptions.silentFetch)
  setFlag(EventTypes.CONSOLE, !!paramOptions.silentConsole)
  setFlag(EventTypes.DOM, !!paramOptions.silentDom)
  setFlag(EventTypes.HISTORY, !!paramOptions.silentHistory)
  setFlag(EventTypes.ERROR, !!paramOptions.silentError)
  setFlag(EventTypes.HASHCHANGE, !!paramOptions.silentHashchange)
  setFlag(EventTypes.UNHANDLEDREJECTION, !!paramOptions.silentUnhandledrejection)
  setFlag(EventTypes.VUE, !!paramOptions.silentVue)
  // wx App
  setFlag(WxAppEvents.AppOnError, !!paramOptions.silentWxOnError)
  setFlag(WxAppEvents.AppOnUnhandledRejection, !!paramOptions.silentUnhandledrejection)
  setFlag(WxAppEvents.AppOnPageNotFound, !!paramOptions.silentWxOnPageNotFound)
  // wx Page
  setFlag(WxPageEvents.PageOnShareAppMessage, !!paramOptions.silentWxOnShareAppMessage)
  // mini Route
  setFlag(EventTypes.MINI_ROUTE, !!paramOptions.silentMiniRoute)
}
