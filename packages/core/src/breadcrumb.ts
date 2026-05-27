import {
  BreadCrumbTypes,
  BreadCrumbCategory,
  BreadcrumbPushData,
  InitOptions,
  IBreadcrumb,
} from '@simple-monitor/types'
import { validateOption, getTimestamp } from '@simple-monitor/utils'
import { silentConsoleScope, _support } from './global'

export class Breadcrumb implements IBreadcrumb {
  maxBreadcrumbs = 10
  beforePushBreadcrumb: unknown = null
  stack: BreadcrumbPushData[] = []
  constructor() {}

  push(data: BreadcrumbPushData): void {
    if (typeof this.beforePushBreadcrumb === 'function') {
      let result: BreadcrumbPushData | null = null
      const beforePushBreadcrumb = this.beforePushBreadcrumb
      silentConsoleScope(() => {
        result = beforePushBreadcrumb(this, data)
      })
      if (!result) return
      this.immediatePush(result)
      return
    }
    this.immediatePush(data)
  }
  immediatePush(data: BreadcrumbPushData): void {
    data.time ??= getTimestamp()
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift()
    }
    this.stack.push(data)
    this.stack.sort((a, b) => (a.time || 0) - (b.time || 0))
  }
  shift(): boolean {
    return this.stack.shift() !== undefined
  }
  clear(): void {
    this.stack = []
  }
  getStack(): BreadcrumbPushData[] {
    return this.stack
  }
  getCategory(type: BreadCrumbTypes) {
    switch (type) {
      case BreadCrumbTypes.XHR:
      case BreadCrumbTypes.FETCH:
        return BreadCrumbCategory.HTTP
      case BreadCrumbTypes.CLICK:
      case BreadCrumbTypes.ROUTE:
      case BreadCrumbTypes.TAP:
      case BreadCrumbTypes.TOUCHMOVE:
        return BreadCrumbCategory.USER
      case BreadCrumbTypes.CUSTOMER:
      case BreadCrumbTypes.CONSOLE:
        return BreadCrumbCategory.DEBUG
      case BreadCrumbTypes.APP_ON_LAUNCH:
      case BreadCrumbTypes.APP_ON_SHOW:
      case BreadCrumbTypes.APP_ON_HIDE:
      case BreadCrumbTypes.PAGE_ON_SHOW:
      case BreadCrumbTypes.PAGE_ON_HIDE:
      case BreadCrumbTypes.PAGE_ON_SHARE_APP_MESSAGE:
      case BreadCrumbTypes.PAGE_ON_SHARE_TIMELINE:
      case BreadCrumbTypes.PAGE_ON_TAB_ITEM_TAP:
        return BreadCrumbCategory.LIFECYCLE
      case BreadCrumbTypes.UNHANDLEDREJECTION:
      case BreadCrumbTypes.CODE_ERROR:
      case BreadCrumbTypes.RESOURCE:
      case BreadCrumbTypes.VUE:
      case BreadCrumbTypes.REACT:
      default:
        return BreadCrumbCategory.EXCEPTION
    }
  }
  bindOptions(options: InitOptions = {}): void {
    const { maxBreadcrumbs, beforePushBreadcrumb } = options
    if (validateOption(maxBreadcrumbs, 'maxBreadcrumbs', 'number')) {
      this.maxBreadcrumbs = maxBreadcrumbs!
    }
    if (validateOption(beforePushBreadcrumb, 'beforePushBreadcrumb', 'function')) {
      this.beforePushBreadcrumb = beforePushBreadcrumb
    }
  }
}
const breadcrumb = _support.breadcrumb || (_support.breadcrumb = new Breadcrumb())
export { breadcrumb }
