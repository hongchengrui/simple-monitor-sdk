/**
 * 元素信息提取工具
 */
import type { DOMElementInfo } from '../../types'
export function getElementInfo(element: Element): DOMElementInfo {
  const info: DOMElementInfo = { tagName: element.tagName }
  if (element.id) info.id = element.id
  if (element.className) info.className = element.className
  if (element.textContent) {
    const text = element.textContent.trim()
    if (text.length < 50) info.text = text
  }
  return info
}
