/**
 * 生成 UUID v4 格式的唯一标识符
 * @returns UUID 字符串
 */
export function generateUUID(): string {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = ((d + Math.random() * 16) % 16) | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

/**
 * 生成紧凑型 UUID（无连字符）
 * @returns 紧凑型 UUID 字符串
 */
export function uuidCompact(): string {
  return generateUUID().replace(/-/g, '')
}

/**
 * NanoID 字符集
 * URL 安全的字符集
 */
const NanoIdAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

/**
 * 生成 NanoID
 * @param length ID 长度（默认 21）
 * @returns NanoID 字符串
 */
export function nanoId(length: number = 21): string {
  let id = ''
  for (let i = 0; i < length; i++) {
    id += NanoIdAlphabet[Math.floor(Math.random() * NanoIdAlphabet.length)]
  }
  return id
}
