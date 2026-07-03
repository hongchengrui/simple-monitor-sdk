/**
 * 事件处理器（handleEvents）
 *
 * 每个 handler 通过 subscribeEvent 注册一条「订阅 + transform + send」的同质逻辑。
 * 只暴露处理入口，不直接绑定原生 API——那是 replace.ts 的职责。
 */

import { EventTypes, ErrorTypes, Severity, BreadCrumbTypes, HttpTypes } from '@simple-monitor/types'
import { extractErrorStack, getFlag, getTimestamp } from '@simple-monitor/utils'
import {
  breadcrumb,
  transportData,
  subscribeEvent,
  resourceTransform,
  httpTransform,
  handleConsole,
  options,
} from '@simple-monitor/core'

import type { ResourceErrorTarget, MonitorHttp } from '@simple-monitor/types'

/**
 * 资源错误的事件总线通道名。
 */
export const RESOURCE_ERROR_EVENT = 'resourceError'

/**
 * 订阅 JS 运行时错误（window.onerror / 资源 error 经分流后也走这里）
 */
export function handleError(): void {
  subscribeEvent({
    type: EventTypes.ERROR,
    callback: (data) => {
      if (getFlag(EventTypes.ERROR)) return

      const errorObj = (data && data.error) || data
      const parsed = extractErrorStack(errorObj, Severity.Normal)
      if (!parsed) return

      parsed.type = ErrorTypes.JAVASCRIPT_ERROR

      breadcrumb.push({
        type: BreadCrumbTypes.CODE_ERROR,
        category: breadcrumb.getCategory(BreadCrumbTypes.CODE_ERROR),
        data: parsed,
        level: Severity.Normal,
        time: parsed.time,
      })

      transportData.send(parsed)
    },
  })
}

/**
 * 订阅资源加载错误（<img>/<script>/<link> 的 error 事件）
 */
export function handleResourceError(): void {
  subscribeEvent({
    type: RESOURCE_ERROR_EVENT,
    callback: (data: ResourceErrorTarget) => {
      if (getFlag(EventTypes.ERROR)) return

      const parsed = resourceTransform(data)

      breadcrumb.push({
        type: BreadCrumbTypes.RESOURCE,
        category: breadcrumb.getCategory(BreadCrumbTypes.RESOURCE),
        data: parsed,
        level: Severity.Low,
        time: parsed.time,
      })

      transportData.send(parsed)
    },
  })
}

/**
 * 订阅未捕获的 Promise rejection。
 */
export function handleUnhandledRejection(): void {
  subscribeEvent({
    type: EventTypes.UNHANDLEDREJECTION,
    callback: (reason: unknown) => {
      if (getFlag(EventTypes.UNHANDLEDREJECTION)) return

      const source =
        reason instanceof Error
          ? reason
          : { name: 'unhandledrejection', message: stringifyReason(reason) }

      const parsed = extractErrorStack(source, Severity.Low)
      if (!parsed) return

      parsed.type = ErrorTypes.PROMISE_ERROR

      breadcrumb.push({
        type: BreadCrumbTypes.UNHANDLEDREJECTION,
        category: breadcrumb.getCategory(BreadCrumbTypes.UNHANDLEDREJECTION),
        data: parsed,
        level: Severity.Low,
        time: parsed.time,
      })

      transportData.send(parsed)
    },
  })
}

/**
 * 把非 Error 的 reject 原因转成可读字符串。
 */
function stringifyReason(reason: unknown): string {
  if (typeof reason === 'string') return reason
  if (reason == null) return String(reason)
  try {
    return JSON.stringify(reason)
  } catch {
    return String(reason)
  }
}

/**
 * 订阅 XHR / Fetch 请求事件。
 * httpTransform 规范化后：所有请求进面包屑，
 * 仅失败请求（status===0 跨域/超时，或 status>=400）才上报为 FETCH_ERROR。
 */
export function handleHttp(): void {
  const dispatch = (data: MonitorHttp): void => {
    const silent = data.type === HttpTypes.XHR ? getFlag(EventTypes.XHR) : getFlag(EventTypes.FETCH)
    if (silent) return

    const parsed = httpTransform(data)
    const isError = data.status === 0 || (data.status ?? 0) >= 400
    const crumbType = data.type === HttpTypes.XHR ? BreadCrumbTypes.XHR : BreadCrumbTypes.FETCH

    breadcrumb.push({
      type: crumbType,
      category: breadcrumb.getCategory(crumbType),
      data: parsed,
      level: isError ? Severity.Error : Severity.Info,
      time: data.time,
    })

    if (isError) {
      transportData.send(parsed)
    }
  }

  subscribeEvent({ type: EventTypes.XHR, callback: dispatch })
  subscribeEvent({ type: EventTypes.FETCH, callback: dispatch })
}

/**
 * 订阅 console 调用 → 写入面包屑（core handleConsole 决定是否记录）。
 */
export function handleConsoleEvent(): void {
  subscribeEvent({
    type: EventTypes.CONSOLE,
    callback: (data: { level: string; args: unknown[] }) => {
      if (getFlag(EventTypes.CONSOLE)) return
      handleConsole(data)
    },
  })
}

/**
 * 订阅 DOM 点击 → 写入面包屑（还原用户操作链）。
 */
export function handleDomEvent(): void {
  subscribeEvent({
    type: EventTypes.DOM,
    callback: (data: { category: string; data: string }) => {
      breadcrumb.push({
        type: BreadCrumbTypes.CLICK,
        category: breadcrumb.getCategory(BreadCrumbTypes.CLICK),
        data,
        level: Severity.Info,
        time: getTimestamp(),
      })
    },
  })
}

/**
 * 订阅路由变化 → 触发 onRouteChange 钩子 + 写入面包屑。
 */
export function handleHistoryEvent(): void {
  subscribeEvent({
    type: EventTypes.HISTORY,
    callback: (data: { from: string; to: string }) => {
      const hook = (options as { onRouteChange?: (from: string, to: string) => unknown })
        .onRouteChange
      if (typeof hook === 'function') {
        try {
          hook(data.from, data.to)
        } catch {
          // 用户钩子报错不影响采集流程
        }
      }

      breadcrumb.push({
        type: BreadCrumbTypes.ROUTE,
        category: breadcrumb.getCategory(BreadCrumbTypes.ROUTE),
        data,
        level: Severity.Info,
        time: getTimestamp(),
      })
    },
  })
}
