/**
 * API拦截器实现
 */
export function interceptXHR(): void {
  console.log('[Monitor] XHR 拦截已启用')
}
export function interceptFetch(): void {
  console.log('[Monitor] Fetch 拦截已启用')
}
export function interceptConsole(): void {
  console.log('[Monitor] Console 拦截已启用')
}
export function interceptRouter(): void {
  console.log('[Monitor] 路由拦截已启用')
}
