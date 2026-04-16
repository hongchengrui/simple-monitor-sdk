/**
 * HTTP 拦截器
 * 拦截 XHR 和 Fetch 请求，收集完整的请求和响应数据
 */

import { replaceOld } from '../browser/replace'
import { HttpTypes } from '../../types/base/common'
import type { RequestMonitorData, HTTPMonitorData } from '../transform/http'
import {
  generateTraceId,
  safeStringifyRequestData,
  truncateResponseText,
  safeGetResponseText,
} from '../transform/http'

/**
 * WeakMap 用于存储 XHR 实例的监控数据
 * 使用 WeakMap 避免内存泄漏，当 XHR 实例被回收时，监控数据也会被自动回收
 */
const xhrMonitorMap = new WeakMap<XMLHttpRequest, RequestMonitorData>()

/**
 * SDK 监控数据上报接口白名单
 * 这些接口是 SDK 自己的上报接口，需要被过滤掉，防止死循环
 */
const SDK_API_WHITELIST: string[] = []

/**
 * 请求过滤器函数类型
 * @param url - 请求 URL
 * @param method - 请求方法
 * @returns true 表示需要拦截，false 表示不拦截
 */
type RequestFilter = (url: string, method: string) => boolean

/**
 * 默认的请求过滤器
 * 过滤掉 SDK 自己的上报请求，防止死循环
 */
const defaultRequestFilter: RequestFilter = (url: string): boolean => {
  // 如果 URL 包含监控上报的路径，则不拦截
  return !SDK_API_WHITELIST.some((apiUrl) => url.includes(apiUrl))
}

/**
 * 当前使用的请求过滤器
 * 可以通过 setRequestFilter 自定义
 */
let currentRequestFilter: RequestFilter = defaultRequestFilter

/**
 * 设置 SDK 上报接口白名单
 * @param apiUrls - SDK 上报接口的 URL 数组
 */
export function setSdkApiWhitelist(apiUrls: string[]): void {
  SDK_API_WHITELIST.length = 0
  SDK_API_WHITELIST.push(...apiUrls)
}

/**
 * 设置自定义请求过滤器
 * @param filter - 自定义过滤器函数，返回 true 表示需要拦截，false 表示不拦截
 */
export function setRequestFilter(filter: RequestFilter): void {
  currentRequestFilter = filter
}

/**
 * traceId 的 HTTP 头名称（可变）
 */
let TRACE_ID_HEADER = 'X-Trace-Id'

/**
 * 设置 traceId 的 HTTP 头名称
 * @param headerName - 自定义头名称，默认为 'X-Trace-Id'
 */
export function setTraceIdHeader(headerName: string): void {
  TRACE_ID_HEADER = headerName
}

/**
 * 上报回调函数类型
 */
type ReportCallback = (data: HTTPMonitorData) => void

/**
 * beforeAppAjaxSend 钩子函数类型
 * 在请求发送前调用，可以添加请求头、修改数据或阻止请求
 *
 * @param xhr - XMLHttpRequest 对象
 * @param config - 请求配置
 * @returns boolean - 返回 false 可阻止请求发送
 *
 * @example
 * // 添加自定义请求头
 * beforeAppAjaxSend: (xhr, config) => {
 *   xhr.setRequestHeader('X-Custom-Header', 'value')
 * }
 *
 * @example
 * // 阻止包含敏感信息的请求
 * beforeAppAjaxSend: (xhr, config) => {
 *   if (config.body?.includes('password')) {
 *     return false // 阻止发送
 *   }
 * }
 */
type BeforeAppAjaxSendHook = (
  xhr: XMLHttpRequest,
  config: {
    method: string
    url: string
    headers?: Record<string, string>
    body?: string | FormData | Blob
    async?: boolean
  }
) => boolean | void

/**
 * 当前的 beforeAppAjaxSend 钩子函数
 */
let currentBeforeAppAjaxSendHook: BeforeAppAjaxSendHook | undefined

/**
 * 设置 beforeAppAjaxSend 钩子
 * @param hook - 钩子函数
 */
export function setBeforeAppAjaxSendHook(hook: BeforeAppAjaxSendHook): void {
  currentBeforeAppAjaxSendHook = hook
}

/**
 * 当前的上报回调函数
 * 可以通过 setHttpReportCallback 自定义
 */
let currentReportCallback: ReportCallback = function defaultReportCallback(
  data: HTTPMonitorData
): void {
  // 默认使用 console.log 输出
  const safeData = {
    ...data,
    request: {
      ...data.request,
      body: data.request.body ? safeStringifyRequestData(data.request.body) : undefined,
    },
    response: {
      ...data.response,
      text: data.response.text ? truncateResponseText(data.response.text) : undefined,
    },
  }

  console.log('[Monitor HTTP]', JSON.stringify(safeData, null, 2))
}

/**
 * 设置自定义上报回调函数
 * @param callback - 自定义上报函数
 */
export function setHttpReportCallback(callback: ReportCallback): void {
  currentReportCallback = callback
}

/**
 * 上报 HTTP 监控数据
 */
function reportHTTPData(data: HTTPMonitorData): void {
  currentReportCallback(data)
}

/**
 * XHR 拦截器
 * 重写 XMLHttpRequest 的 open 和 send 方法
 */
export function xhrReplace(): void {
  // 检查浏览器是否支持 XMLHttpRequest
  if (!('XMLHttpRequest' in window)) {
    console.warn('[Monitor] 当前浏览器不支持 XMLHttpRequest')
    return
  }

  // 重写 open - 记录请求基本信息
  replaceOld(XMLHttpRequest.prototype, 'open', (originalOpen) => {
    return function (this: XMLHttpRequest, ...args: unknown[]) {
      // 提取 method 和 url，并存储到 xhrMonitorMap
      const [method, url] = args as [string, string]

      // 检查是否需要拦截（应用请求过滤器）
      if (!currentRequestFilter(url, method)) {
        // 不需要拦截，直接调用原始方法
        return originalOpen.apply(this, args)
      }

      // 生成 traceId
      const traceId = generateTraceId()

      // 创建监控数据并存入 WeakMap
      xhrMonitorMap.set(this, {
        method: method.toUpperCase(), // 统一转为大写
        url,
        startTime: Date.now(),
        traceId,
      })

      // 调用原始 open 方法
      const result = originalOpen.apply(this, args)

      // 添加 traceId 到请求头
      try {
        this.setRequestHeader(TRACE_ID_HEADER, traceId)
      } catch (e) {
        // setRequestHeader 可能在某些状态下抛出异常（例如请求已发送）
        // 静默处理，不影响监控功能
      }

      return result
    }
  })

  // 重写 send - 监听响应事件
  replaceOld(XMLHttpRequest.prototype, 'send', (originalSend) => {
    return function (this: XMLHttpRequest, ...args: unknown[]) {
      // 0. 获取监控数据
      const monitorData = xhrMonitorMap.get(this)

      // 如果没有监控数据（说明 open 没被调用或被过滤），直接调用原始方法
      if (!monitorData) {
        return originalSend.apply(this, args)
      }

      // 1️⃣ 调用 beforeAppAjaxSend 钩子（如果配置了）
      if (currentBeforeAppAjaxSendHook) {
        try {
          const config = {
            method: monitorData.method,
            url: monitorData.url,
            body: args[0] as string | FormData | Blob | undefined,
          }

          const shouldContinue = currentBeforeAppAjaxSendHook(this, config)

          // 如果钩子返回 false，阻止请求发送
          if (shouldContinue === false) {
            console.log('[Monitor HTTP] 请求被 beforeAppAjaxSend 钩子阻止')
            return
          }
        } catch (error) {
          console.error('[Monitor HTTP] beforeAppAjaxSend 钩子执行失败:', error)
          // 钩子失败不阻止请求，只记录错误
        }
      }

      // 2. 记录请求数据
      monitorData.requestData = args[0]
      // 2. 添加 loadend 事件监听器（无论请求成功、失败、超时都会触发）
      // 使用 { once: true } 防止重复绑定
      this.addEventListener(
        'loadend',
        function (this: XMLHttpRequest) {
          const data = xhrMonitorMap.get(this)
          if (!data) return

          // 3. 计算请求耗时
          const elapsedTime = Date.now() - data.startTime

          // 4. 安全地读取响应数据
          const responseText = safeGetResponseText(this)

          // 5. 收集完整的响应数据
          reportHTTPData({
            type: HttpTypes.XHR,
            method: data.method,
            url: data.url,
            status: this.status,
            statusText: this.statusText,
            elapsedTime,
            traceId: data.traceId,
            request: {
              body: data.requestData,
            },
            response: {
              text: responseText,
              responseType: this.responseType,
            },
          })
        },
        { once: true }
      )
      // 6. 调用原始 send 方法
      return originalSend.apply(this, args)
    }
  })
}

/**
 * Fetch 拦截器
 * 重写 window.fetch 函数
 */
export function fetchReplace(): void {
  // 检查浏览器是否支持 Fetch
  if (!('fetch' in window)) {
    console.warn('[Monitor] 当前浏览器不支持 Fetch')
    return
  }

  // 重写 window.fetch
  replaceOld(window, 'fetch', (originalFetch) => {
    return function (
      this: Window,
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      // 1. 提取请求信息
      // input 可能是：string、Request 对象、URL 对象
      let url: string
      if (typeof input === 'string') {
        url = input
      } else if (input instanceof Request) {
        url = input.url
      } else {
        // input 是 URL 对象
        url = input.href
      }

      const method = init?.method || 'GET'

      // 检查是否需要拦截（应用请求过滤器）
      if (!currentRequestFilter(url, method)) {
        // 不需要拦截，直接调用原始方法
        return originalFetch.apply(this, [input, init])
      }

      // 2. 生成 traceId
      const traceId = generateTraceId()

      // 3. 创建监控数据
      const monitorData: RequestMonitorData = {
        method: method.toUpperCase(),
        url,
        startTime: Date.now(),
        requestData: init?.body,
        traceId,
      }

      // 4. 添加 traceId 到请求头
      const headers = new Headers(init?.headers)
      headers.append(TRACE_ID_HEADER, traceId)

      const newInit: RequestInit = {
        ...init,
        headers,
      }

      // 5. 调用原始 fetch，返回 Promise
      return originalFetch
        .apply(this, [input, newInit])
        .then((response: Response) => {
          // 请求成功
          const elapsedTime = Date.now() - monitorData.startTime

          // 克隆响应（因为原始响应的 stream 只能读一次）
          const clonedResponse = response.clone()

          // 异步读取响应文本并上报（不阻塞原始响应）
          clonedResponse.text().then((text: string) => {
            reportHTTPData({
              type: HttpTypes.FETCH,
              method: monitorData.method,
              url: monitorData.url,
              status: response.status,
              statusText: response.statusText,
              elapsedTime,
              traceId: monitorData.traceId,
              request: {
                body: monitorData.requestData,
              },
              response: {
                text: response.status > 401 ? text : undefined, // 安全考虑
                responseType: 'fetch',
              },
            })
          })

          // 返回原始响应
          return response
        })
        .catch((error: unknown) => {
          // 请求失败
          const elapsedTime = Date.now() - monitorData.startTime

          // 上报错误数据
          reportHTTPData({
            type: HttpTypes.FETCH,
            method: monitorData.method,
            url: monitorData.url,
            status: 0,
            statusText: '',
            elapsedTime,
            traceId: monitorData.traceId,
            request: {
              body: monitorData.requestData,
            },
            response: {
              text: undefined,
              responseType: 'fetch',
            },
          })

          // 重新抛出错误，保持原始 Promise 行为
          throw error
        })
    }
  })
}
