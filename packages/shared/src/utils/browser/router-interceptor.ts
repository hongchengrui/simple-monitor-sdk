/**
 * Router 拦截器
 * 监听路由变化，记录用户导航行为
 */
import { replaceOld } from './replace'
import { EventTypes } from '../../types/base/constant'
import type { RouterInfo } from '../../types/base/replace'

/**
 * 初始化全局钩子
 */
function initHooks(): void {
  if (!window.__MONITOR_HOOKS__) {
    ;(window.__MONITOR_HOOKS__ as any) = {
      router: [],
    }
  }
}

/**
 * 注册 Router 钩子
 * @param hook - 钩子函数，接收路由信息
 * @returns 取消注册的函数
 */
export function onRouter(hook: (data: RouterInfo) => void): () => void {
  initHooks()

  const hooks = (window.__MONITOR_HOOKS__!.router ||= []) as any[]
  hooks.push(hook)

  // 返回一个取消注册的函数
  return () => {
    const index = hooks.indexOf(hook)
    if (index > -1) {
      hooks.splice(index, 1)
    }
  }
}

/**
 * 重写 history.pushState 和 history.replaceState
 */
export function historyReplace(): void {
  if (!window.history) {
    console.warn('[Monitor] 当前浏览器不支持 history API')
    return
  }

  // 使用 replaceOld 重写 pushState
  replaceOld(window.history, 'pushState', (originalPushState) => {
    return function (this: History, ...args: any[]) {
      // 1. 先调用原始方法，让 URL 真的改变
      const result = originalPushState.apply(this, args)

      // 2. 提取路由信息
      const to = args[2]?.toString() || ''
      const routerInfo: RouterInfo = {
        type: EventTypes.HISTORY,
        from: window.location.href,
        to: to || window.location.href,
      }

      // 3. 触发钩子，添加我们的监控逻辑
      if (window.__MONITOR_HOOKS__?.router) {
        const hooks = window.__MONITOR_HOOKS__.router as Array<(data: RouterInfo) => void>
        hooks.forEach((hook) => {
          try {
            hook(routerInfo)
          } catch (e) {
            console.error('[Monitor Router Hook Error]', e)
          }
        })
      }

      return result
    }
  })

  // 使用 replaceOld 重写 replaceState
  replaceOld(window.history, 'replaceState', (originalReplaceState) => {
    return function (this: History, ...args: any[]) {
      const result = originalReplaceState.apply(this, args)

      const to = args[2]?.toString() || ''
      const routerInfo: RouterInfo = {
        type: EventTypes.HISTORY,
        from: window.location.href,
        to: to || window.location.href,
      }

      if (window.__MONITOR_HOOKS__?.router) {
        const hooks = window.__MONITOR_HOOKS__.router as Array<(data: RouterInfo) => void>
        hooks.forEach((hook) => {
          try {
            hook(routerInfo)
          } catch (e) {
            console.error('[Monitor Router Hook Error]', e)
          }
        })
      }

      return result
    }
  })
}

/**
 * 监听 hashchange 和 popstate 事件
 */
export function listenRouterEvents(): void {
  // hashchange 事件
  window.addEventListener('hashchange', () => {
    const routerInfo: RouterInfo = {
      type: EventTypes.HASHCHANGE,
      from: document.referrer || window.location.href,
      to: window.location.href,
    }

    if (window.__MONITOR_HOOKS__?.router) {
      const hooks = window.__MONITOR_HOOKS__.router as Array<(data: RouterInfo) => void>
      hooks.forEach((hook) => {
        try {
          hook(routerInfo)
        } catch (e) {
          console.error('[Monitor Router Hook Error]', e)
        }
      })
    }
  })

  // popstate 事件
  window.addEventListener('popstate', () => {
    const routerInfo: RouterInfo = {
      type: EventTypes.HISTORY,
      from: document.referrer || window.location.href,
      to: window.location.href,
    }

    if (window.__MONITOR_HOOKS__?.router) {
      const hooks = window.__MONITOR_HOOKS__.router as Array<(data: RouterInfo) => void>
      hooks.forEach((hook) => {
        try {
          hook(routerInfo)
        } catch (e) {
          console.error('[Monitor Router Hook Error]', e)
        }
      })
    }
  })
}

/**
 * 统一的 Router 拦截器入口
 */
export function routerReplace(): void {
  historyReplace()
  listenRouterEvents()
}
