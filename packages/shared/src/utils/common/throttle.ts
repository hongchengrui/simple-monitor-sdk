/**
 * 节流函数模块
 *
 * 限制函数在指定时间内只执行一次
 * 常用于：resize、scroll、mousemove 等高频事件
 *
 * @module throttle
 */

/**
 * 节流函数类型（带取消方法）
 */
type ThrottleFn<T extends (...args: any[]) => any> = T & {
  /** 取消节流 */
  cancel: () => void
}

/**
 * 节流函数
 *
 * 在指定时间内只执行一次函数
 * 与 debounce 不同，throttle 保证定期执行
 *
 * @param fn 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 *
 * @example
 * // 场景1：窗口 resize 事件
 * const handleResize = throttle(() => {
 *   console.log('窗口大小改变')
 * }, 1000)
 *
 * window.addEventListener('resize', handleResize)
 * // 快速调整窗口大小：1秒内只执行1次
 *
 * @example
 * // 场景2：滚动事件
 * const handleScroll = throttle(() => {
 *   console.log('页面滚动')
 * }, 200)
 *
 * window.addEventListener('scroll', handleScroll)
 * // 快速滚动：每200ms执行1次
 *
 * @example
 * // 场景3：取消节流
 * const throttledFn = throttle(() => {
 *   console.log('执行')
 * }, 1000)
 *
 * // 在延迟时间内取消
 * throttledFn.cancel()
 * // → 不会执行
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): ThrottleFn<T> {
  // 上次执行的时间戳
  let lastExecTime = 0
  // 定时器ID
  let timer: ReturnType<typeof setTimeout> | null = null

  const throttledFn = function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    // 距离上次执行的剩余时间
    const remaining = delay - (now - lastExecTime)

    // 情况1：第一次调用或已超过延迟时间 → 立即执行
    if (remaining <= 0) {
      // 清除可能存在的定时器
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      // 更新执行时间
      lastExecTime = now

      // 执行函数
      fn.apply(this, args)
    }
    // 情况2：在延迟时间内 → 设置定时器在剩余时间后执行
    else if (!timer) {
      timer = setTimeout(() => {
        lastExecTime = Date.now()
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  } as unknown as ThrottleFn<T>

  // 添加取消方法
  throttledFn.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return throttledFn
}
