/**
 * 生成 UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 获取当前时间戳
 */
export function getTimestamp(): number {
  return Date.now()
}

/**
 * 格式化 URL
 */
export function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.href
  } catch {
    return url
  }
}

/**
 * 截断字符串
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

/**
 * 安全的 JSON 序列化
 */
export function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    return '[Unserializable]'
  }
}
