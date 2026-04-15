/**
 * API重写核心工具
 *
 * 这是实现HTTP拦截、Console拦截等所有API重写功能的基础
 * 使用AOP（面向切面编程）思想，在不修改原代码的情况下插入监控逻辑
 */

/**
 * 任意对象类型
 */
interface IAnyObject {
  [key: string]: any
}

/**
 * 重写（AOP面向切面编程）核心函数
 *
 * @param source - 要重写的对象（如：XMLHttpRequest.prototype、window.console等）
 * @param name - 要重写的属性/方法名（如：'open'、'send'、'log'等）
 * @param replacement - 替换函数，接收原函数，返回包装后的函数
 * @param isForced - 是否强制重写（即使属性不存在），默认为false
 *
 */
export function replaceOld(
  source: IAnyObject,
  name: string,
  replacement: (original: any) => any,
  isForced = false
): void {
  // 安全检查：source不能为空
  if (!source) {
    return
  }

  // 只有属性存在或强制模式时才执行重写
  if (name in source || isForced) {
    // 保存原始方法
    const original = source[name]

    // 执行替换：replacement是一个高阶函数，接收原始方法，返回包装后的方法
    const wrapped = replacement(original)

    // 确保返回的是函数才进行替换
    if (typeof wrapped === 'function') {
      source[name] = wrapped
    }
  }
}

/**
 * 批量重写多个方法
 *
 * @param source - 要重写的对象
 * @param replacements - 重写配置映射
 */
export function replaceMultiple(
  source: IAnyObject,
  replacements: Record<string, (original: any) => any>
): void {
  Object.entries(replacements).forEach(([name, replacement]) => {
    replaceOld(source, name, replacement)
  })
}

/**
 * 安全地重写对象属性
 * 带错误处理，确保重写失败不影响原有功能
 *
 * @param source - 要重写的对象
 * @param name - 要重写的属性名
 * @param replacement - 替换函数
 * @returns 是否重写成功
 */
export function safeReplace(
  source: IAnyObject,
  name: string,
  replacement: (original: any) => any
): boolean {
  try {
    replaceOld(source, name, replacement)
    return true
  } catch (error) {
    console.warn(`[Monitor SDK] Failed to replace ${name}:`, error)
    return false
  }
}

/**
 * 创建只执行一次的函数
 * 用于防止某些初始化逻辑被重复执行
 *
 * @param fn - 要执行的函数
 * @returns 包装后的函数
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let executed = false
  let result: any

  return ((...args: any[]) => {
    if (!executed) {
      executed = true
      result = fn(...args)
    }
    return result
  }) as T
}

/**
 * 获取函数名称
 *
 * @param fn - 任意值，通常是函数
 * @returns 函数名称，匿名函数返回 '<anonymous>'
 */
export function getFunctionName(fn: unknown): string {
  if (!fn || typeof fn !== 'function') {
    return '<anonymous>'
  }
  return fn.name || '<anonymous>'
}
