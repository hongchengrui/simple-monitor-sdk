import { getAppId, isWxMiniEnv, variableTypeDetection } from '@simple-monitor/utils'
import { ErrorTypes, EventTypes, ReportDataType } from '@simple-monitor/types'
import { options } from './options'
const allErrorNumber: Record<number, number> = {}
/**
 * generate error unique Id
 * @param data
 */
export function createErrorId(data: ReportDataType, apikey: string): number | null {
  let idStr: string
  const errorType = data.type ?? ErrorTypes.UNKNOWN
  switch (errorType) {
    case ErrorTypes.FETCH_ERROR:
      idStr =
        (data.type ?? '') +
        (data.request?.method ?? '') +
        (data.response?.status ?? '') +
        getRealPath(data.request?.url ?? '') +
        apikey
      break
    case ErrorTypes.JAVASCRIPT_ERROR:
    case ErrorTypes.VUE_ERROR:
    case ErrorTypes.REACT_ERROR:
      idStr = (data.type ?? '') + (data.name ?? '') + (data.message ?? '') + apikey
      break
    case ErrorTypes.LOG_ERROR:
      idStr = (data.customTag ?? '') + (data.type ?? '') + (data.name ?? '') + apikey
      break
    case ErrorTypes.PROMISE_ERROR:
      idStr = generatePromiseErrorId(data, apikey)
      break
    default:
      idStr = (data.type ?? '') + (data.message ?? '') + apikey
      break
  }
  const id = hashCode(idStr)
  const maxDuplicateCount = options.maxDuplicateCount ?? 2
  if (allErrorNumber[id] >= maxDuplicateCount) {
    return null
  }
  if (typeof allErrorNumber[id] === 'number') {
    allErrorNumber[id]++
  } else {
    allErrorNumber[id] = 1
  }

  return id
}

function generatePromiseErrorId(data: ReportDataType, apikey: string): string {
  const locationUrl = getRealPath(data.url ?? '')
  if (data.name === EventTypes.UNHANDLEDREJECTION) {
    return (data.type ?? '') + objectOrder(data.message) + apikey
  }
  return (data.type ?? '') + (data.name ?? '') + objectOrder(data.message) + locationUrl
}

function objectOrder(reason: any): string {
  const sortFn = (obj: any): any => {
    return Object.keys(obj)
      .sort()
      .reduce(
        (total: Record<string, any>, key: string) => {
          if (variableTypeDetection.isObject(obj[key])) {
            total[key] = sortFn(obj[key])
          } else {
            total[key] = obj[key]
          }
          return total
        },
        {} as Record<string, any>
      )
  }
  try {
    if (/\{.*\}/.test(reason)) {
      let obj = JSON.parse(reason)
      obj = sortFn(obj)
      return JSON.stringify(obj)
    }
  } catch (error) {
    return String(reason)
  }
  return String(reason)
}

/**
 * http://.../project?id=1#a => http://.../project
 * http://.../id/123=> http://.../id/{param}
 *
 * @param url
 */
export function getRealPath(url: string): string {
  return url.replace(/[?#].*$/, '').replace(/\/\d+([/]*$)/, '{param}$1')
}

/**
 *
 * @param url
 */
export function getFlutterRealOrigin(url: string): string {
  // for apple
  return removeHashPath(getFlutterRealPath(url))
}

export function getFlutterRealPath(url: string): string {
  // for apple
  return url.replace(/(\S+)(\/Documents\/)(\S*)/, `$3`)
}

export function getRealPageOrigin(url: string): string {
  const fileStartReg = /^file:\/\//
  if (fileStartReg.test(url)) {
    return getFlutterRealOrigin(url)
  }
  if (isWxMiniEnv) {
    return getAppId()
  }
  return getRealPath(removeHashPath(url).replace(/(\S*)(\/\/)(\S+)/, '$3'))
}

export function removeHashPath(url: string): string {
  return url.replace(/(\S+)(\/#\/)(\S*)/, `$1`)
}

export function hashCode(str: string): number {
  let hash = 0
  if (str.length == 0) return hash
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash
}
