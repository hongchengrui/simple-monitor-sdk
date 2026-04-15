/**
 * 错误堆栈解析工具
 */
import type { ErrorStack } from '../../types'

/**
 * 解析错误堆栈
 * @param stack - Error.stack 字符串
 * @returns 解析后的堆栈帧数组
 */
export function parseErrorStack(stack?: string): ErrorStack[] {
  if (!stack) return []

  // 兼容不同浏览器的堆栈格式
  const stackLines = stack.split('\n').slice(1)
  const stackFrames: ErrorStack[] = []

  for (const line of stackLines) {
    const frame = parseStackLine(line)
    if (frame) {
      stackFrames.push(frame)
    }
  }

  return stackFrames
}

/**
 * 解析单行堆栈信息
 */
function parseStackLine(line: string): ErrorStack | null {
  // Chrome格式: at functionName (http://...)
  // Firefox格式: functionName@http://...
  // Safari格式: functionName@http://...

  const chromeRegex = /^\s+at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)$/
  const firefoxRegex = /^(.+?)@(.+?):(\d+):(\d+)$/
  const safariRegex = /^(.+?)@(.+?):(\d+)$/

  let match = line.match(chromeRegex)
  if (match) {
    return {
      func: match[1],
      url: match[2],
      line: parseInt(match[3]),
      column: parseInt(match[4]),
      args: [],
    }
  }

  match = line.match(firefoxRegex)
  if (match) {
    return {
      func: match[1],
      url: match[2],
      line: parseInt(match[3]),
      column: parseInt(match[4]),
      args: [],
    }
  }

  match = line.match(safariRegex)
  if (match) {
    return {
      func: match[1],
      url: match[2],
      line: parseInt(match[3]),
      column: 0,
      args: [],
    }
  }

  return null
}
