/** 代理 XHR / Fetch / History，供 CCP（API 完成时间）与 SPA 路由检测使用 */

function proxyXhr(
  beforeHandler: (...args: any[]) => void,
  afterHandler: (...args: any[]) => void
): void {
  if ('XMLHttpRequest' in window && !window.__monitor_xhr__) {
    const origin = window.XMLHttpRequest
    const originOpen = origin.prototype.open
    window.__monitor_xhr__ = true
    origin.prototype.open = function (this: XMLHttpRequest, ...args: any[]): void {
      beforeHandler && beforeHandler(args[1])
      originOpen.apply(this, args as any)
      this.addEventListener('loadend', () => {
        afterHandler && afterHandler(args[1])
      })
    }
  }
}

/** 把 fetch 的 resource 归一化为 url 字符串：string 透传，Request 取 .url，其余空串 */
export const normalizeResource = (resource: unknown): string => {
  if (typeof resource === 'string') return resource
  if (resource && typeof (resource as { url?: unknown }).url === 'string') {
    return (resource as { url: string }).url
  }
  return ''
}

function proxyFetch(
  beforeHandler: (...args: any[]) => void,
  afterHandler: (...args: any[]) => void
): void {
  if ('fetch' in window && !window.__monitor_fetch__) {
    const origin = window.fetch
    window.__monitor_fetch__ = true
    ;(window as any).fetch = function (resource: any, init: any): Promise<Response> {
      const url = normalizeResource(resource)
      beforeHandler && beforeHandler(url, init)
      return (origin as any).call(window, resource, init).then(
        (response: Response) => {
          afterHandler && afterHandler(url, init)
          return response
        },
        (err: Error) => {
          // 失败的请求也算「结束」：否则它不进 completeQueue，ACT 会一直等它永不完成
          afterHandler && afterHandler(url, init)
          throw err
        }
      )
    }
  }
}

function proxyHistory(handler: (...arg: any[]) => void): void {
  if (window.history) {
    const originPushState = history.pushState
    const originReplaceState = history.replaceState

    history.pushState = function (...args: any[]): void {
      handler && handler(...args, 'pushState')
      originPushState.apply(window.history, args as any)
    }
    history.replaceState = function (...args: any[]): void {
      handler && handler(...args, 'replaceState')
      originReplaceState.apply(window.history, args as any)
    }
  }
}

export { proxyXhr, proxyFetch, proxyHistory }
