/**
 * 事件处理器（handleEvents）
 *
 * 每个 handler 通过 subscribeEvent 注册一条「订阅 + transform + send」的同质逻辑。
 * 只暴露处理入口，不直接绑定原生 API——那是 replace.ts 的职责。
 * 按事件类型（error / resourceError / unhandledrejection / xhr / fetch ...）拆分，互不干扰。
 */

import { EventTypes, ErrorTypes, Severity, BreadCrumbTypes, HttpTypes } from '@simple-monitor/types'
import { extractErrorStack, getFlag } from '@simple-monitor/utils'
import {
  breadcrumb,
  transportData,
  subscribeEvent,
  resourceTransform,
  httpTransform,
} from '@simple-monitor/core'

import type { ResourceErrorTarget, MonitorHttp } from '@simple-monitor/types'

/**
 * 资源错误的事件总线通道名。
 * EventTypes 只覆盖「被重写的原生事件」，资源错误由 addEventListener 的 error 捕获，
 * 没有对应原生枚举，故在此用独立常量与 replace.ts 约定一致。
 */
export const RESOURCE_ERROR_EVENT = 'resourceError'

/**
 * 订阅 JS 运行时错误（window.onerror / 资源 error 经分流后也走这里）
 */
export function handleError(): void {
  subscribeEvent({
    type: EventTypes.ERROR,
    callback: (data) => {
      // 静默开关：silentError 为真时跳过
      if (getFlag(EventTypes.ERROR)) return

      // data 是 window 上的 ErrorEvent：
      //   - 正常 JS 错误：event.error 是真正的 Error 对象（含 name/stack），优先用它
      //   - 跨域脚本错误：event.error 为 null，退而用 event 自带的 message
      const errorObj = (data && data.error) || data
      const parsed = extractErrorStack(errorObj, Severity.Normal)
      if (!parsed) return

      // extractErrorStack 不设 type，此处补齐为 JS 运行时错误
      parsed.type = ErrorTypes.JAVASCRIPT_ERROR

      // 错误进面包屑，还原用户操作链
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

      // reason 可能是 Error / 字符串 / 普通对象，规范化为 extractErrorStack 能吃的形态
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
 * httpTransform 规范化后：所有请求进面包屑（还原用户操作链），
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

  // dispatch 同时订阅 xhr / fetch 两个通道；flagKey 含 type，互不冲突
  subscribeEvent({ type: EventTypes.XHR, callback: dispatch })
  subscribeEvent({ type: EventTypes.FETCH, callback: dispatch })
}
