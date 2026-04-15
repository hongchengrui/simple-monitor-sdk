/**
 * HTTP类型工具
 */
export function isXhr(data: any): boolean {
  return data?.type === 'xhr'
}
export function isFetch(data: any): boolean {
  return data?.type === 'fetch'
}
