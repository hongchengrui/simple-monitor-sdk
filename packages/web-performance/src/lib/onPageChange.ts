import type { OnPageChangeCallback } from '../types'
import { proxyHistory } from './proxyHandler'

const unifiedHref = (href: string): string => {
  return decodeURIComponent(href?.replace(`${location?.protocol}//${location?.host}`, ''))
}

const lastHref = unifiedHref(location.href)

/** 监听 SPA 路由变化：hashchange / popstate / history.pushState|replaceState */
export const onPageChange = (cb: OnPageChangeCallback): void => {
  window.addEventListener('hashchange', function (e) {
    cb(e)
  })
  window.addEventListener('popstate', function (e) {
    cb(e)
  })
  proxyHistory((...args) => {
    const currentHref = unifiedHref(args?.[2])
    if (lastHref !== currentHref) {
      cb()
    }
  })
}
