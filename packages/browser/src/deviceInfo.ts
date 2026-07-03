/**
 * 设备信息采集（browser 端）
 *
 * best-effort 策略：每个字段 feature-detect，拿不到就省略，绝不抛错。
 * 在 setupReplace 入口调用一次，写入 _support.deviceInfo，上报信封复用。
 */

import type { DeviceInfo } from '@simple-monitor/types'

interface NetworkInformation {
  type?: string
  effectiveType?: string
  rtt?: number
  downlink?: number
}

interface NavigatorExt extends Navigator {
  connection?: NetworkInformation
}

/**
 * 轻量 UA 解析：识别主流浏览器 / 系统 / 设备类型，识别失败留空。
 * 纯函数，便于单测。
 */
export function parseUA(
  ua: string
): Pick<DeviceInfo, 'browser' | 'browserVersion' | 'os' | 'deviceType'> {
  const result: Pick<DeviceInfo, 'browser' | 'browserVersion' | 'os' | 'deviceType'> = {}
  if (!ua) return result

  // 浏览器（顺序敏感：Edge / Opera 基于 Chromium，须先判）
  const browserRules: Array<[string, RegExp]> = [
    ['edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ['opera', /OPR\/([\d.]+)/],
    ['chrome', /Chrome\/([\d.]+)/],
    ['firefox', /Firefox\/([\d.]+)/],
    ['safari', /Version\/([\d.]+).*Safari/],
  ]
  for (const [name, re] of browserRules) {
    const m = ua.match(re)
    if (m) {
      result.browser = name
      result.browserVersion = m[1]
      break
    }
  }

  // 系统
  if (/Windows/.test(ua)) result.os = 'windows'
  else if (/iPhone|iPad|iPod/.test(ua)) result.os = 'ios'
  else if (/Android/.test(ua)) result.os = 'android'
  else if (/Mac OS X/.test(ua)) result.os = 'mac'
  else if (/Linux/.test(ua)) result.os = 'linux'

  // 设备类型
  if (/iPad|Tablet/.test(ua)) result.deviceType = 'tablet'
  else if (/Mobi|iPhone|Android.*Mobile/.test(ua)) result.deviceType = 'mobile'
  else result.deviceType = 'desktop'

  return result
}

/**
 * 采集当前环境设备信息。
 * 任何字段采集失败都被 try-catch 吞掉，返回已采集的部分（不阻断主链路）。
 */
export function collectDeviceInfo(): DeviceInfo {
  const info: DeviceInfo = {}
  try {
    const nav = navigator as NavigatorExt
    info.ua = nav.userAgent
    info.language = nav.language
    info.dpr = window.devicePixelRatio
    info.screen = `${window.screen.width}x${window.screen.height}`
    info.viewport = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
    info.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // 网络（Network Information API，非标准、Chrome 系）—— feature-detect
    const conn = nav.connection
    if (conn) {
      info.netType = conn.type
      info.effectiveType = conn.effectiveType
    }

    Object.assign(info, parseUA(nav.userAgent || ''))
  } catch {
    // best-effort：单点失败不影响其余字段
  }
  return info
}
