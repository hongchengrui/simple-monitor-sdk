/**
 * 哈希算法 - 将字符串转换为数字哈希值
 * 使用经典的 Java hashCode 算法
 *
 * 算法原理：
 * hash = hash * 31 + char
 * 使用位运算优化：hash = (hash << 5) - hash + char
 *
 * @param str 输入字符串
 * @returns 数字哈希值（32位整数）
 */
export function hashCode(str: string): number {
  let hash = 0

  // 空字符串直接返回0
  if (str.length === 0) return hash

  // 遍历字符串的每个字符
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)

    // 核心算法：hash = hash * 31 + char
    // 位运算优化：(hash << 5) - hash = 31 * hash
    hash = (hash << 5) - hash + char

    // 确保32位整数（处理溢出）
    hash = hash & hash
  }

  return hash
}
