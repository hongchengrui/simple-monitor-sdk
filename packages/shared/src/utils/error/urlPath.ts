/**
 * URL 标准化 - 去除查询参数和路径中的数字
 *
 * 用于错误去重时的 URL 标准化
 * 相同路径但参数不同的URL应该视为同一个错误
 *
 * 转换示例：
 * - http://example.com/user/123?id=1#section
 * - => http://example.com/user/{param}
 * - http://example.com/user/456?id=2
 * - => http://example.com/user/{param}
 *
 * @param url 原始URL
 * @returns 标准化后的URL
 *
 * @example
 * getRealPath('http://example.com/user/123?id=1')
 * // 返回: 'http://example.com/user/{param}'
 *
 * getRealPath('http://example.com/api/123/')
 * // 返回: 'http://example.com/api/{param}/'
 */
export function getRealPath(url: string): string {
  // 步骤1: 去除查询参数和哈希
  // 正则 /[?#].*$/ 匹配 ? 或 # 及其后的所有字符
  let normalizedUrl = url.replace(/[?#].*$/, '')

  // 步骤2: 将数字路径替换为 {param}
  // 正则 /\/\d+([\/]*$)/ 匹配斜杠+数字，后面可选斜杠
  // 这样可以将 /user/123 转换为 /user/{param}
  normalizedUrl = normalizedUrl.replace(/\/\d+(\/*$)/, '{param}$1')

  return normalizedUrl
}

/**
 * 移除 Hash 路径
 * 用于处理 hash router 模式的路由
 *
 * 将 http://example.com/#/page/1 转换为 http://example.com/
 *
 * @param url 原始URL
 * @returns 移除hash后的URL
 *
 * @example
 * removeHashPath('http://example.com/#/page/1')
 * // 返回: 'http://example.com/'
 *
 * removeHashPath('http://example.com/app/#/dashboard')
 * // 返回: 'http://example.com/app/'
 */
export function removeHashPath(url: string): string {
  // 正则解释：
  // (\S+)      - 匹配非空白字符（协议+域名）
  // (\/#\/)    - 匹配 hash router 的标识 /#/
  // (\S*)      - 匹配剩余的非空白字符
  // $1         - 只保留第一部分
  return url.replace(/(\S+)(\/#\/)(\S*)/, '$1')
}
