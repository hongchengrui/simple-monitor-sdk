export const roundByFour = (num: number, digits = 4): number => {
  try {
    return parseFloat(num.toFixed(digits))
  } catch {
    return num
  }
}

export const convertToMB = (bytes: number): number | null => {
  if (typeof bytes !== 'number') return null
  return roundByFour(bytes / Math.pow(1024, 2))
}

/** 页面 load 完成后回调（已 complete 则 setTimeout，否则等 pageshow） */
export const afterLoad = (callback: () => void): void => {
  if (document.readyState === 'complete') {
    setTimeout(callback)
  } else {
    addEventListener('pageshow', callback)
  }
}

export const beforeUnload = (callback: () => void): void => {
  window.addEventListener('beforeunload', callback)
}

export const unload = (callback: () => void): void => {
  window.addEventListener('unload', callback)
}

export const validNumber = (nums: number | number[]): boolean => {
  if (Array.isArray(nums)) return nums.every((n) => n >= 0)
  return nums >= 0
}

/** arr1 是否为 arr2 的子集（顺序无关） */
export const isIncludeArr = (arr1: string[], arr2: string[]): boolean => {
  if (!arr1 || arr1.length === 0 || !arr2 || arr2.length === 0) return false
  if (arr1.length > arr2.length) return false
  return arr1.every((item) => arr2.includes(item))
}

/** 两个数组（排序后）是否相同 */
export const isEqualArr = (arr1: string[], arr2: string[]): boolean => {
  if (!arr1 || arr1.length === 0 || !arr2 || arr2.length === 0) return false
  if (arr1.length !== arr2.length) return false
  return [...arr1].sort().join() === [...arr2].sort().join()
}

/** 从 url 提取 path 部分 */
export const getApiPath = (url: string): string => {
  const reg = /(?:http(?:s|):\/\/[^/\s]+|)([^#?]+).*/
  return url ? (url.match(reg)?.[1] ?? '') : ''
}

/** target 是否命中 paths 中的任一路径（路径模式匹配） */
export const isExistPath = (paths: string[], target: string): boolean => {
  // 简化：用 includes 子串匹配（encode 用 path-to-regexp；此处避免引入额外依赖）
  return paths.some((p) => target.includes(p))
}
