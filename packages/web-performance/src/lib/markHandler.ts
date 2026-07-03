import { isPerformanceSupported } from '../utils/isSupported'

/** 自定义打点：performance.mark 的封装（setStartMark / setEndMark 用） */

export const hasMark = (markName: string): boolean => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance')
    return false
  }
  return performance.getEntriesByName(markName).length > 0
}

export const getMark = (markName: string): PerformanceEntry | undefined => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance')
    return
  }
  return performance.getEntriesByName(markName).pop()
}

export const setMark = (markName: string): void | undefined => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance')
    return
  }
  performance.mark(markName)
}

export const clearMark = (markName: string): void | undefined => {
  if (!isPerformanceSupported()) {
    return
  }
  performance.clearMarks(markName)
}
