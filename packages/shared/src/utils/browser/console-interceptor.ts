/**
 * Console 拦截器
 * 拦截 console.log/warn/error/info 调用，用于记录用户行为
 */

import { replaceOld } from './replace'
import type { ConsoleTriggerData } from '../../types/base/replace'
import type { RouterInfo } from '../../types/base/replace'

/**
 * 全局监控钩子类型
 * 统一管理所有拦截器的钩子
 */
export interface MonitorHooks {
  console?: Array<(data: ConsoleTriggerData) => void>
  router?: Array<(data: RouterInfo) => void>
}

// 扩展 Window 接口，添加钩子管理
declare global {
  interface Window {
    __MONITOR_HOOKS__?: MonitorHooks
  }
}

/**
 * 初始化全局钩子
 */
function initHooks(): void {
  if (!window.__MONITOR_HOOKS__) {
    window.__MONITOR_HOOKS__ = {
      console: undefined,
    }
  }
}

/**
 * 注册 Console 钩子
 * @param hook - 钩子函数，接收 Console 数据
 */
export function onConsole(hook: (data: ConsoleTriggerData) => void): () => void {
  initHooks()

  // 将钩子添加到数组
  const hooks = (window.__MONITOR_HOOKS__!.console ||= []) as any
  hooks.push(hook)

  // 返回取消注册函数
  return () => {
    const index = hooks.indexOf(hook)
    if (index > -1) {
      hooks.splice(index, 1)
    }
  }
}

/**
 * 安全地将参数转换为字符串
 */
function safeStringify(arg: unknown): string {
  try {
    if (arg === null) return 'null'
    if (arg === undefined) return 'undefined'
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg)
      } catch {
        return '[Object]'
      }
    }
    return String(arg)
  } catch {
    return '[Unable to stringify]'
  }
}

/**
 * 拦截 console 方法
 */
export function consoleReplace(): void {
  const consoleMethods = ['log', 'warn', 'error', 'info'] as const

  consoleMethods.forEach((method) => {
    replaceOld(console, method, (originalConsole) => {
      return function (...args: unknown[]) {
        // 1. 准备 Console 数据
        const data: ConsoleTriggerData = {
          level: method,
          args: args.map(safeStringify),
        }

        // 2. 触发钩子（如果已注册）
        if (window.__MONITOR_HOOKS__?.console) {
          const hooks = window.__MONITOR_HOOKS__.console as any[]
          hooks.forEach((hook) => {
            try {
              hook(data)
            } catch (e) {
              // 钩子执行出错不应影响 console 功能
              console.error('[Monitor Console Hook Error]', e)
            }
          })
        }

        // 3. 调用原始 console 方法
        return originalConsole.apply(console, args)
      }
    })
  })
}
