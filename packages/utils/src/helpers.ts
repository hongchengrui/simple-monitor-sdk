import { IntegrationError, HttpCodes, ErrorTypes } from '@simple-monitor/types'
import { variableTypeDetection } from './is'
import { setUrlQuery } from './string'

declare const getCurrentPages: any
declare const wx: any

// 用到所有事件名称
type TotalEventName =
  | keyof GlobalEventHandlersEventMap
  | keyof XMLHttpRequestEventTargetEventMap
  | keyof WindowEventMap

/**
 * 获取当前页面 URL
 */
export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return ''
  return document.location.href
}

/**
 * 添加事件监听器
 * @param target 目标对象（window / document / 元素等任何具备 addEventListener 的对象）
 * @param eventName 事件名称
 * @param handler 事件处理函数
 * @param options 选项（useCapture 或 AddEventListenerOptions）
 */
export function on(
  target: {
    addEventListener: (
      event: string,
      handler: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => void
  },
  eventName: TotalEventName,
  handler: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions = false
): void {
  target.addEventListener(eventName, handler, options)
}

/**
 * 判断 HTTP 状态码是否表示失败
 * @param code HTTP 状态码
 */
export function isHttpFail(code: number): boolean {
  return code === 0 || code === HttpCodes.BAD_REQUEST || code > HttpCodes.UNAUTHORIZED
}

/**
 * 获取微信小程序当前 route
 * 必须是在进入 Page 或 Component 构造函数内部才能够获取到 currentPages
 */
export function getCurrentRoute(): string {
  if (
    !variableTypeDetection.isFunction(typeof getCurrentPages !== 'undefined' ? getCurrentPages : 0)
  ) {
    return ''
  }
  const pages = getCurrentPages() // 在 App 里调用该方法，页面还没有生成，长度为 0
  if (!pages.length) {
    return 'App'
  }
  const currentPage = pages.pop()
  return setUrlQuery(currentPage.route, currentPage.options)
}

/**
 * 获取微信小程序 AppId
 * @returns 小程序 AppId 或空字符串
 */
export function getAppId(): string {
  if (typeof wx !== 'undefined' && wx.getAccountInfoSync) {
    try {
      const accountInfo = wx.getAccountInfoSync()
      return accountInfo?.miniProgram?.appId || ''
    } catch {
      return ''
    }
  }
  return ''
}

/**
 * 解析字符串错误信息，返回 message、name、stack
 * @param str error string
 */
export function parseErrorString(str: string): IntegrationError | null {
  const splitLine: string[] = str.split('\n')
  if (splitLine.length < 2) return null
  if (splitLine[0].indexOf('MiniProgramError') !== -1) {
    splitLine.splice(0, 1)
  }
  const message = splitLine.splice(0, 1)[0]
  const name = splitLine.splice(0, 1)[0].split(':')[0]
  const stack = []

  for (const errorLine of splitLine) {
    const regexpGetFun = /at\s+([\S]+)\s+\(/ // 获取 [ 函数名 ]
    const regexGetFile = /\(([^)]+)\)/ // 获取 [ 有括号的文件 , 没括号的文件 ]
    const regexGetFileNoParenthese = /\s+at\s+(\S+)/ // 获取 [ 有括号的文件 , 没括号的文件 ]

    const funcExec = regexpGetFun.exec(errorLine)
    let fileURLExec = regexGetFile.exec(errorLine)
    if (!fileURLExec) {
      // 假如为空尝试解析无括号的 URL
      fileURLExec = regexGetFileNoParenthese.exec(errorLine)
    }

    const funcNameMatch = Array.isArray(funcExec) && funcExec.length > 0 ? funcExec[1].trim() : ''
    const fileURLMatch = Array.isArray(fileURLExec) && fileURLExec.length > 0 ? fileURLExec[1] : ''
    const lineInfo = fileURLMatch.split(':')
    stack.push({
      args: [], // 请求参数
      func: funcNameMatch || ErrorTypes.UNKNOWN_FUNCTION, // 前端分解后的报错
      column: Number(lineInfo.pop()), // 前端分解后的列
      line: Number(lineInfo.pop()), // 前端分解后的行
      url: lineInfo.join(':'), // 前端分解后的 URL
    })
  }
  return {
    message,
    name,
    stack,
  }
}
