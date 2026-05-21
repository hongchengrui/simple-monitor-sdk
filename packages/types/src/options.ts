import { BreadcrumbPushData, IBreadcrumb } from './breadcrumb'
import { TransportDataType } from './transportData'
import { EMethods } from './httpConstants'
type CANCEL = null | undefined | boolean

interface IRequestHeaderConfig {
  method: EMethods | string
  url: string
}

type TSetRequestHeader = (key: string, value: string) => void
export interface IBeforeAppAjaxSendConfig {
  setRequestHeader: TSetRequestHeader
}
export interface InitOptions
  extends SilentEventTypes, HooksTypes, WxSilentEventTypes, WxMiniHooksTypes, BrowserHooksTypes {
  dsn?: string
  disabled?: boolean
  apikey?: string
  useImgUpload?: boolean
  trackKey?: string
  debug?: boolean
  enableTraceId?: boolean
  includeHttpUrlTraceIdRegExp?: RegExp
  traceIdFieldName?: string
  filterXhrUrlRegExp?: RegExp
  maxBreadcrumbs?: number
  throttleDelayTime?: number
  enableTrack?: boolean
  trackDsn?: string
  maxDuplicateCount?: number
}

export interface HooksTypes {
  configReportXhr?(xhr: XMLHttpRequest, reportData: TransportDataType | any): void

  beforeDataReport?(
    event: TransportDataType
  ): Promise<TransportDataType | null | CANCEL> | TransportDataType | any | CANCEL | null
  /**
   *
   * 钩子函数，每次发送前都会调用
   * @param {TransportDataType} event 上报的数据格式
   * @param {string} url 上报到服务端的地址
   * @returns {string} 返回空时不上报
   * @memberof HooksTypes
   */
  configReportUrl?(event: TransportDataType, url: string): string

  beforePushBreadcrumb?(
    breadcrumb: IBreadcrumb,
    hint: BreadcrumbPushData
  ): BreadcrumbPushData | CANCEL

  beforeAppAjaxSend?(config: IRequestHeaderConfig, setRequestHeader: IBeforeAppAjaxSendConfig): void

  backTrackerId?(): string | number
}

export interface SilentEventTypes {
  silentXhr?: boolean
  silentFetch?: boolean
  silentConsole?: boolean
  silentDom?: boolean
  silentHistory?: boolean
  silentError?: boolean
  silentUnhandledrejection?: boolean
  silentHashchange?: boolean
  silentVue?: boolean
}

export interface WxSilentEventTypes {
  silentWxOnError?: boolean
  silentWxOnUnhandledRejection?: boolean
  silentWxOnPageNotFound?: boolean
  silentWxOnShareAppMessage?: boolean
  silentMiniRoute?: boolean
}

export type IWxPageInstance = WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject>

interface WxMiniHooksTypes {
  /**
   * wx小程序上报时的wx.request配置
   */
  configReportWxRequest?(event: TransportDataType | any): Partial<WechatMiniprogram.RequestOption>
  /**
   * wx小程序的App下的onLaunch执行完后再执行以下hook
   */
  appOnLaunch?(options: WechatMiniprogram.App.LaunchShowOption): void
  /**
   * wx小程序的App下的OnShow执行完后再执行以下hook
   */
  appOnShow?(options: WechatMiniprogram.App.LaunchShowOption): void
  /**
   * wx小程序的App下的OnHide执行完后再执行以下hook
   */
  appOnHide?(page: IWxPageInstance): void
  /**
   * wx小程序的App下的onPageNotFound执行完后再执行以下hook
   */
  onPageNotFound?(data: WechatMiniprogram.OnPageNotFoundCallbackResult): void
  /**
   * 先执行hook:pageOnShow再执行wx小程序的Page下的onShow
   */
  pageOnShow?(page: IWxPageInstance): void
  /**
   * wx小程序的App下的pageOnUnload执行完后再执行以下hook
   */
  pageOnUnload?(page: IWxPageInstance): void
  /**
   * 先执行hook:pageOnHide再执行wx小程序的Page下的onHide
   */
  pageOnHide?(page: IWxPageInstance): void
  /**
   * 先执行hook:onShareAppMessage再执行wx小程序的Page下的onShareAppMessage
   */
  onShareAppMessage?(options: WechatMiniprogram.Page.IShareAppMessageOption & IWxPageInstance): void
  /**
   * 先执行hook:onShareTimeline再执行wx小程序的Page下的onShareTimeline
   */
  onShareTimeline?(page: IWxPageInstance): void
  /**
   * 先执行hook:onTabItemTap再执行wx小程序的Page下的onTabItemTap
   */
  onTabItemTap?(options: WechatMiniprogram.Page.ITabItemTapOption & IWxPageInstance): void
  /**
   * 重写wx.NavigateToMiniProgram将里面的参数抛出来，便于在跳转时更改query和extraData
   * @param options
   */
  wxNavigateToMiniProgram?(
    options: WechatMiniprogram.NavigateToMiniProgramOption
  ): WechatMiniprogram.NavigateToMiniProgramOption
  /**
   * 代理Action中所有函数，拿到第一个参数并抛出成hook
   * @param e
   */
  triggerWxEvent?(e: WechatMiniprogram.BaseEvent): void
}

export interface BrowserHooksTypes {
  onRouteChange?: (from: string, to: string) => unknown
}
