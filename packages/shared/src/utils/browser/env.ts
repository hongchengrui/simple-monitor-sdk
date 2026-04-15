/**
 * 浏览器环境判断工具
 */

/**
 * 判断是否支持 XMLHttpRequest
 */
export function isSupportXhr(): boolean {
  return typeof XMLHttpRequest !== 'undefined'
}

/**
 * 判断是否支持 Fetch API
 */
export function isSupportFetch(): boolean {
  return typeof fetch !== 'undefined'
}

/**
 * 判断是否支持 PerformanceObserver
 */
export function isSupportPerformanceObserver(): boolean {
  return typeof PerformanceObserver !== 'undefined'
}

/**
 * 判断是否支持 IntersectionObserver
 */
export function isSupportIntersectionObserver(): boolean {
  return typeof IntersectionObserver !== 'undefined'
}

/**
 * 判断是否为移动端
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 获取浏览器类型
 */
export function getBrowserType(): string {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'IE'
  return 'Unknown'
}
