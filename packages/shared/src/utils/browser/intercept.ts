/**
 * API拦截器实现
 * 导入具体的拦截器实现
 */

// ============================================
// 统一的钩子系统类型定义
// ============================================

/**
 * Router 钩子数据类型
 */
import type { RouterInfo } from '../../types/base/replace'

/**
 * Console 钩子数据类型
 */
import type { ConsoleTriggerData } from '../../types/base/replace'

/**
 * 全局监控钩子类型
 * 统一管理所有拦截器的钩子
 */
export interface MonitorHooks {
  console?: Array<(data: ConsoleTriggerData) => void>
  router?: Array<(data: RouterInfo) => void>
  // 未来可以添加更多钩子类型
}

// 扩展 Window 接口，添加全局钩子容器
declare global {
  interface Window {
    __MONITOR_HOOKS__?: MonitorHooks
  }
}

// ============================================
// 导出拦截器实现
// ============================================

// 导出 HTTP 拦截器
export { xhrReplace, fetchReplace } from '../intercept'

// 导出 Console 拦截器
export { consoleReplace, onConsole } from './console-interceptor'

// 导出 Router 拦截器
export { routerReplace, onRouter } from './router-interceptor'
