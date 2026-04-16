/**
 * XPath生成工具
 */
export function getXPath(element: Element): string {
  if (element.id) {
    return `id("${element.id}")`
  }
  if (element === document.body) {
    return element.tagName.toLowerCase()
  }
  const ix = Array.from(element.parentNode?.children || []).indexOf(element) + 1
  const parentXPath = element.parentElement ? getXPath(element.parentElement) : ''
  return parentXPath ? `${parentXPath}/${element.tagName.toLowerCase()}[${ix}]` : `${element.tagName.toLowerCase()}[${ix}]`
}
