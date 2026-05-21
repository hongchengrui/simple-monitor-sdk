/**
 * 微信小程序类型声明
 * 简化版，仅包含 options.ts 中用到的类型
 */

declare namespace WechatMiniprogram {
  interface IAnyObject {
    [key: string]: any
  }

  namespace App {
    interface LaunchShowOption {
      path: string
      scene: number
      query: Record<string, string>
      referrerInfo?: any
      shareTicket?: string
    }
  }

  namespace Page {
    interface IShareAppMessageOption {
      from: string
      target: any
      url?: string
    }

    interface ITabItemTapOption {
      index: string
      text: string
      pagePath: string
    }

    interface Instance<D> {
      data: D
      [key: string]: any
    }
  }

  interface RequestOption {
    url: string
    data?: string | IAnyObject
    header?: IAnyObject
    method?: string
    timeout?: number
  }

  interface NavigateToMiniProgramOption {
    appId: string
    path?: string
    extraData?: IAnyObject
    envVersion?: string
  }

  interface OnPageNotFoundCallbackResult {
    path: string
    query: Record<string, string>
    isEntryPage?: boolean
  }

  interface BaseEvent<T = any> {
    type: string
    timeStamp: number
    target: any
    currentTarget: any
    detail: T
    marks?: Record<string, any>
  }

  type AnyFunction = (...args: any[]) => any
}
