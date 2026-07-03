import type { OnHiddenCallback } from '../types'

/**
 * 页面隐藏监听：visibilitychange + pagehide 双保险（部分浏览器 visibilitychange 有 bug）。
 * once=true 时触发后自动解绑。
 */
export const onHidden = (cb: OnHiddenCallback, once?: boolean): void => {
  const onHiddenOrPageHide = (event: Event): void => {
    if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
      cb(event)
      if (once) {
        removeEventListener('visibilitychange', onHiddenOrPageHide, true)
        removeEventListener('pagehide', onHiddenOrPageHide, true)
      }
    }
  }
  addEventListener('visibilitychange', onHiddenOrPageHide, true)
  addEventListener('pagehide', onHiddenOrPageHide, true)
}
