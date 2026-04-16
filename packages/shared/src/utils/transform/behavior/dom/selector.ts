/**
 * CSS选择器生成工具
 */

/**
 * 获取元素的CSS选择器
 */
export function getSelector(element: Element): string {
  if (element.id) {
    return `#${element.id}`
  }

  if (element.className) {
    const classes = element.className.split(' ').filter(c => c).join('.')
    return `${element.tagName.toLowerCase()}.${classes}`
  }

  return element.tagName.toLowerCase()
}
