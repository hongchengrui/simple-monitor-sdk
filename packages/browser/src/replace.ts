/**
 * 采集器（replace）
 *
 * 所有「包装/监听原生 API」的同质逻辑集中在此，只负责：
 * 拿到原生事件 → 解析出数据 → triggerHandlers 分发。
 * 不做 transform / send —— 那是 handleEvents.ts 的职责。
 */

import { EventTypes, HttpTypes } from '@simple-monitor/types'
import {
  on,
  getFlag,
  replaceOld,
  getTimestamp,
  generateUUID,
  throttle,
  htmlElementAsString,
  getLocationHref,
} from '@simple-monitor/utils'
import { triggerHandlers, transportData, options } from '@simple-monitor/core'
import { RESOURCE_ERROR_EVENT } from './handleEvents'

import type { ResourceErrorTarget, MonitorHttp, MonitorXMLHttpRequest } from '@simple-monitor/types'

/**
 * 判断 event.target 是否为资源元素（img/script/link 等）。
 * 资源加载失败时，target 是元素本身且不含 error 信息；代码错误时 target 是 window。
 */
function isResourceTarget(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement
}

/**
 * 监听全局 error 事件，分流「代码错误」与「资源错误」。
 */
export function listenError(): void {
  on(
    window,
    'error',
    (e: Event) => {
      const target = e.target as EventTarget | null

      // 资源错误：target 是元素
      if (isResourceTarget(target)) {
        if (getFlag(EventTypes.ERROR)) return
        const element = target as HTMLElement
        triggerHandlers(RESOURCE_ERROR_EVENT, {
          target: element,
          src: (element as HTMLImageElement).src || element.getAttribute('src') || '',
          href: element.getAttribute('href') || '',
          localName: element.localName,
        } as ResourceErrorTarget)
        return
      }

      // 代码错误：走通用 error 通道
      if (getFlag(EventTypes.ERROR)) return
      triggerHandlers(EventTypes.ERROR, e)
    },
    true // 捕获阶段 —— 资源错误必须在此阶段捕获
  )
}

/**
 * 监听未捕获的 Promise rejection。
 */
export function listenUnhandledRejection(): void {
  on(window, 'unhandledrejection', (e: Event) => {
    if (getFlag(EventTypes.UNHANDLEDREJECTION)) return
    const reason = (e as PromiseRejectionEvent).reason
    triggerHandlers(EventTypes.UNHANDLEDREJECTION, reason)
  })
}

/**
 * 包装 XMLHttpRequest：open 记录 method/url/traceId，send 记请求体，
 * 请求完成（readyState=4）时触发采集。
 *
 * 防自循环：open 时用 isSdkTransportUrl 判定是否为上报地址，
 * 是则在 monitor_xhr.isSdkUrl 打标，完成时跳过 triggerHandlers。
 */
export function xhrReplace(): void {
  if (typeof window === 'undefined' || typeof XMLHttpRequest === 'undefined') return
  const proto = XMLHttpRequest.prototype

  replaceOld(
    proto,
    'open',
    (originalOpen) =>
      function (this: MonitorXMLHttpRequest, ...args: any[]): void {
        const method = args[0]
        const rawUrl = args[1]
        const urlStr = typeof rawUrl === 'string' ? rawUrl : String(rawUrl ?? '')
        this.monitor_xhr = {
          type: HttpTypes.XHR,
          method,
          url: urlStr,
          sTime: getTimestamp(),
          traceId: generateUUID(),
          isSdkUrl: transportData.isSdkTransportUrl(urlStr),
        }
        originalOpen.apply(this, args)
      }
  )

  replaceOld(
    proto,
    'send',
    (originalSend) =>
      function (this: MonitorXMLHttpRequest, ...args: any[]): void {
        const monitorXhr = this.monitor_xhr
        if (monitorXhr) {
          const body = args[0]
          monitorXhr.reqData = typeof body === 'string' ? body : ''
          this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
              completeXhr(this)
            }
          })
        }
        originalSend.apply(this, args)
      }
  )
}

/** XHR 完成时补全 status/耗时/响应体，按 isSdkUrl 与静默开关决定是否分发。 */
function completeXhr(xhr: MonitorXMLHttpRequest): void {
  const monitorXhr = xhr.monitor_xhr
  if (!monitorXhr) return
  monitorXhr.status = xhr.status
  monitorXhr.elapsedTime = getTimestamp() - (monitorXhr.sTime ?? 0)
  monitorXhr.time = monitorXhr.sTime
  monitorXhr.responseText = xhr.responseText
  if (monitorXhr.isSdkUrl) return
  if (getFlag(EventTypes.XHR)) return
  triggerHandlers(EventTypes.XHR, monitorXhr)
}

/**
 * 包装 window.fetch：记录请求信息，响应/失败时触发采集。
 */
export function fetchReplace(): void {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return

  replaceOld(
    window,
    'fetch',
    (originalFetch) =>
      function (this: unknown, input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = resolveFetchUrl(input)
        const sTime = getTimestamp()
        const method = resolveFetchMethod(input, init)
        const traceId = generateUUID()
        const isSdkUrl = transportData.isSdkTransportUrl(url)

        return (originalFetch as (...a: any[]) => Promise<Response>)
          .apply(window, [input, init])
          .then(
            (res: Response) => {
              res
                .clone()
                .text()
                .then((text: string) => {
                  triggerFetch({
                    type: HttpTypes.FETCH,
                    url,
                    method,
                    status: res.status,
                    reqData: init?.body,
                    sTime,
                    elapsedTime: getTimestamp() - sTime,
                    time: sTime,
                    responseText: text,
                    traceId,
                    isSdkUrl,
                  })
                })
              return res
            },
            (err: unknown) => {
              triggerFetch({
                type: HttpTypes.FETCH,
                url,
                method,
                status: 0,
                reqData: init?.body,
                sTime,
                elapsedTime: getTimestamp() - sTime,
                time: sTime,
                traceId,
                isSdkUrl,
              })
              throw err
            }
          )
      }
  )
}

function resolveFetchUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  return (input as Request).url || ''
}

function resolveFetchMethod(input: RequestInfo | URL, init?: RequestInit): string {
  if (init?.method) return String(init.method)
  if (typeof input !== 'string' && !(input instanceof URL) && input.method) {
    return input.method
  }
  return 'GET'
}

function triggerFetch(data: MonitorHttp): void {
  if (data.isSdkUrl) return
  if (getFlag(EventTypes.FETCH)) return
  triggerHandlers(EventTypes.FETCH, data)
}

/**
 * 包装 console.log/info/warn/error/debug：每次调用先分发到面包屑，
 * 再执行原方法（保证业务日志正常输出）。
 * 受 silentConsole 控制；是否真正写入面包屑由 core handleConsole 内部决定。
 */
export function consoleReplace(): void {
  if (typeof console === 'undefined' || !console) return
  const levels = ['log', 'info', 'warn', 'error', 'debug']
  levels.forEach((level) => {
    replaceOld(
      console,
      level,
      (original) =>
        function (...args: unknown[]): void {
          triggerHandlers(EventTypes.CONSOLE, { level, args })
          if (typeof original === 'function') {
            original.apply(console, args)
          }
        }
    )
  })
}

/**
 * DOM 点击采集：节流后把目标节点序列化为字符串 → 面包屑（还原用户操作链）。
 * 节流间隔取 options.throttleDelayTime（默认 200ms）。
 */
export function domReplace(): void {
  if (typeof document === 'undefined') return
  const handler = throttle((e: Event): void => {
    if (getFlag(EventTypes.DOM)) return
    const target = e.target as HTMLElement
    const html = htmlElementAsString(target)
    if (html) {
      triggerHandlers(EventTypes.DOM, { category: 'click', data: html })
    }
  }, options.throttleDelayTime ?? 200)
  on(document, 'click', handler as EventListener, true)
}

/**
 * 路由采集：重写 history.pushState/replaceState + 监听 hashchange/popstate，
 * 统一触发 onRouteChange 钩子并写入面包屑。
 */
let lastHref = ''

export function historyReplace(): void {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') return
  lastHref = getLocationHref()

  const wrap = (method: 'pushState' | 'replaceState'): void => {
    replaceOld(
      history,
      method,
      (original) =>
        function (...args: any[]): void {
          const url = args[2]
          original.apply(history, args)
          triggerRoute(url)
        }
    )
  }
  wrap('pushState')
  wrap('replaceState')

  on(window, 'hashchange', (e) => {
    const ev = e as HashChangeEvent
    triggerRoute(ev.newURL, ev.oldURL)
  })
  on(window, 'popstate', () => {
    triggerRoute(getLocationHref())
  })
}

/** 规范化目标地址（补全相对路径），去重相同路由，再按静默开关决定是否分发。 */
function triggerRoute(to?: string | null, from?: string | null): void {
  const fromUrl = from || lastHref
  let toUrl = to || getLocationHref()
  if (toUrl && !/^https?:\/\//.test(toUrl)) {
    try {
      toUrl = new URL(toUrl, getLocationHref()).href
    } catch {
      /* 解析失败保持原值 */
    }
  }
  if (fromUrl === toUrl) {
    lastHref = toUrl
    return
  }
  lastHref = toUrl
  if (getFlag(EventTypes.HISTORY)) return
  triggerHandlers(EventTypes.HISTORY, { from: fromUrl, to: toUrl })
}
