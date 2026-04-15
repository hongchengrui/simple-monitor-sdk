/**
 * 资源数据转换
 */
export function resourceTransform(target: { src?: string; href?: string; localName?: string }): any {
  const src = target.src || target.href || ''
  return {
    message: '资源地址: ' + (src.length > 100 ? src.substring(0, 100) : src),
    name: `${target.localName || 'unknown'}加载失败`
  }
}
