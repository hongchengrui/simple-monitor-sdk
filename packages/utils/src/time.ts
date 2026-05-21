/**
 * 获取当前的时间戳
 * @returns 返回当前时间戳
 */
export function getTimestamp(): number {
  return Date.now()
}

/**
 * 获取版本号的主版本号
 * @param version 版本字符串，如 "1.2.3"
 * @returns 主版本号，如 1
 */
export function getBigVersion(version: string): number {
  return Number(version.split('.')[0])
}
