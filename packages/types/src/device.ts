/**
 * 设备信息类型定义
 */

/**
 * 浏览器设备信息 (完整版)
 */
export interface DeviceInfo {
  /** User Agent 字符串 */
  ua?: string

  /** 浏览器类型 (chrome, firefox, safari 等) */
  browser?: string

  /** 浏览器版本 */
  browserVersion?: string

  /** 操作系统 */
  os?: string

  /** 操作系统版本 */
  osVersion?: string

  /** 设备类型 (移动端、平板、桌面) */
  deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown'

  /** 屏幕分辨率 */
  screen?: string

  /** 视口大小 */
  viewport?: string

  /** 设备像素比 */
  dpr?: number

  /** 语言 */
  language?: string

  /** 时区 */
  timezone?: string

  /** 网络类型 (4g, 3g, 2g, wifi 等) */
  netType?: string

  /** 网络有效类型 */
  effectiveType?: string
}
