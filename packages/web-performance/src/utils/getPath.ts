/** 取当前页面路径：history 模式取 pathname，hash 模式取 # 后路径 */
const getPath = (location: Location, isHash: boolean): string => {
  if (!isHash) {
    return location.pathname.replace(/\/$/, '')
  } else {
    const index = location.href.indexOf('#')
    if (index < 0) return ''
    const hash = location.href.slice(index + 1)
    const searchIndex = hash.indexOf('?')
    if (searchIndex < 0) return hash
    return hash.slice(0, searchIndex)
  }
}

export default getPath
