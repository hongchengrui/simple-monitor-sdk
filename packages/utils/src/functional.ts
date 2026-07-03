/**
 * 函数工具集
 */

/**
 * 节流函数 - 在指定时间内只执行一次
 * @param fn 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let canRun = true
  return function (this: any, ...args: Parameters<T>) {
    if (!canRun) return
    fn.apply(this, args)
    canRun = false
    setTimeout(() => {
      canRun = true
    }, delay)
  }
}

/**
 * 获取函数名称
 * @param fn 函数
 * @returns 函数名称，匿名函数返回 '<anonymous>'
 */
export const defaultFunctionName = '<anonymous>'

export function getFunctionName(fn: unknown): string {
  if (!fn || typeof fn !== 'function') {
    return defaultFunctionName
  }
  return fn.name || defaultFunctionName
}

/**
 * 静默执行函数（捕获错误但不处理）
 * @param fn 要执行的函数
 * @returns 函数执行结果或 undefined
 */
export function silent<T>(fn: () => T): T | undefined {
  try {
    return fn()
  } catch {
    return undefined
  }
}

/**
 * 静默执行异步函数
 * @param fn 要执行的异步函数
 * @returns Promise，错误时返回 undefined
 */
export async function silentAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn()
  } catch {
    return undefined
  }
}

/**
 * 安全执行函数，捕获错误不抛出
 * 用于隔离监控代码本身的错误，确保监控异常不影响业务代码
 * @param fn 要执行的函数
 * @param errorFn 错误回调函数
 */
export function nativeTryCatch(fn: () => any, errorFn?: (error: Error) => void): void {
  try {
    fn()
  } catch (err) {
    if (errorFn) {
      errorFn(err as Error)
    }
  }
}
