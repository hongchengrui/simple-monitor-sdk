/**
 * 错误堆栈解析模块
 *
 * 支持解析多种浏览器的错误堆栈格式：
 * - Chrome/Edge: "at functionName (url:line:column)"
 * - Firefox: "functionName@url:line:column"
 * - Safari/IE: "at functionName (url:line:column)"
 *
 * @module stackParser
 */

import type { ErrorStack } from '../../types/monitoring/error'

/**
 * 堆栈帧信息（中间类型，用于解析过程）
 * 字段可能是 undefined，后续会转换为 ErrorStack 格式
 */
interface StackFrame {
  /** 函数名 */
  func: string
  /** 文件URL */
  url: string
  /** 行号 */
  line: number | undefined
  /** 列号 */
  column: number | undefined
  /** 函数参数 */
  args: string[]
}

/**
 * 解析错误堆栈信息
 *
 * @param error 错误对象
 * @returns 结构化的堆栈帧数组
 *
 * @example
 * try {
 *   throw new Error('Test error')
 * } catch (error) {
 *   const frames = parseErrorStack(error)
 *   // [
 *   //   { func: 'throwError', url: 'app.js:10:15', line: 10, column: 15 },
 *   //   { func: 'bar', url: 'app.js:20:5', line: 20, column: 5 }
 *   // ]
 * }
 */
export function parseErrorStack(error: Error): ErrorStack[] {
  // 检查是否有堆栈信息
  if (!error || !error.stack) {
    return []
  }

  // 分割堆栈为行
  const lines = error.stack.split('\n')
  const frames: ErrorStack[] = []

  // 定义各种浏览器的堆栈格式正则
  const patterns = [
    // Chrome/Edge 格式: "at functionName (url:line:column)" 或 "at url:line:column"
    {
      regex:
        /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
      parser: (match: RegExpExecArray): StackFrame => ({
        func: match[1] || '(anonymous)',
        url: match[2],
        line: match[3] ? parseInt(match[3], 10) : undefined,
        column: match[4] ? parseInt(match[4], 10) : undefined,
        args: [],
      }),
    },
    // Firefox 格式: "functionName@url:line:column" 或 "url:line:column"
    {
      regex:
        /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,
      parser: (match: RegExpExecArray): StackFrame => ({
        func: match[1] || '(anonymous)',
        url: match[3],
        line: match[4] ? parseInt(match[4], 10) : undefined,
        column: match[5] ? parseInt(match[5], 10) : undefined,
        args: [],
      }),
    },
    // IE/WinJS 格式: "at functionName (url:line:column)"
    {
      regex:
        /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
      parser: (match: RegExpExecArray): StackFrame => ({
        func: match[1] || '(anonymous)',
        url: match[2],
        line: parseInt(match[3], 10),
        column: match[4] ? parseInt(match[4], 10) : undefined,
        args: [],
      }),
    },
  ]

  // 遍历每一行堆栈
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let matched = false

    // 尝试匹配各种格式
    for (const pattern of patterns) {
      const match = pattern.regex.exec(line)
      if (match) {
        const frame = pattern.parser(match)

        // 转换为 ErrorStack 格式
        frames.push({
          func: frame.func,
          url: frame.url,
          line: frame.line ?? 0, // undefined 时使用默认值 0
          column: frame.column ?? 0, // undefined 时使用默认值 0
          args: [], // 暂不解析函数参数
        } as ErrorStack)

        matched = true
        break
      }
    }

    // 如果没有匹配到，跳过这一行
    if (!matched) {
      continue
    }
  }

  return frames
}

/**
 * 提取错误堆栈的第一帧（最关键的错误位置）
 *
 * @param error 错误对象
 * @returns 第一帧堆栈信息 | null
 */
export function getFirstStackFrame(error: Error): ErrorStack | null {
  const frames = parseErrorStack(error)
  return frames.length > 0 ? frames[0] : null
}

/**
 * 格式化堆栈信息为可读字符串
 *
 * @param error 错误对象
 * @returns 格式化的堆栈字符串
 */
export function formatStackTrace(error: Error): string {
  const frames = parseErrorStack(error)

  if (frames.length === 0) {
    return error.stack || ''
  }

  return frames
    .map(
      (frame) =>
        `    at ${frame.func || '(anonymous)'}${
          frame.url
            ? ` (${frame.url}${frame.line ? `:${frame.line}` : ''}${frame.column ? `:${frame.column}` : ''})`
            : ''
        }`
    )
    .join('\n')
}

/**
 * 从堆栈中提取文件名（不含路径）
 *
 * @param url 文件URL
 * @returns 文件名
 */
export function extractFileName(url?: string): string {
  if (!url) return ''

  try {
    // 提取最后一个 / 后面的部分
    const match = url.match(/\/([^/?#]+)(?:[?#]|$)/)
    return match ? match[1] : url
  } catch {
    return url
  }
}

/**
 * 判断是否为内建错误（如 native code）
 *
 * @param frame 堆栈帧
 * @returns 是否为内建错误
 */
export function isNativeFrame(frame: ErrorStack): boolean {
  return !frame.url || frame.url === 'native' || frame.url.indexOf('native') === 0
}

/**
 * 判断是否为第三方库错误（通过URL判断）
 *
 * @param frame 堆栈帧
 * @param whitelist 域名白名单（如 ['example.com', 'cdn.example.com']）
 * @returns 是否为第三方库错误
 */
export function isThirdPartyFrame(frame: ErrorStack, whitelist: string[] = []): boolean {
  if (!frame.url || isNativeFrame(frame)) {
    return false
  }

  try {
    const url = new URL(frame.url, window.location.href)
    const hostname = url.hostname

    // 如果在白名单中，不是第三方
    if (whitelist.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
      return false
    }

    // 如果是当前域名，不是第三方
    if (hostname === window.location.hostname) {
      return false
    }

    return true
  } catch {
    return false
  }
}
