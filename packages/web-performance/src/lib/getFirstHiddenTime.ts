import { onHidden } from './onHidden'

/** 页面首次隐藏时间戳：页面加载过程中若已隐藏，相关指标（FP/FCP/LCP/INP）不应记录。 */
let firstHiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity

const getFirstHiddenTime = () => {
  onHidden((e: Event) => {
    firstHiddenTime = Math.min(firstHiddenTime, e.timeStamp)
  }, true)

  return {
    get timeStamp(): number {
      return firstHiddenTime
    },
  }
}

export default getFirstHiddenTime
