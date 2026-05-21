/**
 * 设备和浏览器类型常量
 *
 * 定义设备类型、浏览器类型和操作系统的常量。
 *
 * @module device
 */

// ========== 设备类型 ==========

/**
 * 设备类型：移动设备
 */
export const DEVICE_TYPE_MOBILE = 'mobile' as const

/**
 * 设备类型：平板设备
 */
export const DEVICE_TYPE_TABLET = 'tablet' as const

/**
 * 设备类型：桌面设备
 */
export const DEVICE_TYPE_DESKTOP = 'desktop' as const

/**
 * 设备类型：未知
 */
export const DEVICE_TYPE_UNKNOWN = 'unknown' as const

// ========== 浏览器类型 ==========

/**
 * 浏览器：Chrome
 */
export const BROWSER_CHROME = 'chrome' as const

/**
 * 浏览器：Firefox
 */
export const BROWSER_FIREFOX = 'firefox' as const

/**
 * 浏览器：Safari
 */
export const BROWSER_SAFARI = 'safari' as const

/**
 * 浏览器：Edge
 */
export const BROWSER_EDGE = 'edge' as const

/**
 * 浏览器：Opera
 */
export const BROWSER_OPERA = 'opera' as const

/**
 * 浏览器：Internet Explorer
 */
export const BROWSER_IE = 'ie' as const

/**
 * 浏览器：未知
 */
export const BROWSER_UNKNOWN = 'unknown' as const

// ========== 操作系统 ==========

/**
 * 操作系统：Windows
 */
export const OS_WINDOWS = 'windows' as const

/**
 * 操作系统：macOS
 */
export const OS_MAC = 'mac' as const

/**
 * 操作系统：Linux
 */
export const OS_LINUX = 'linux' as const

/**
 * 操作系统：Android
 */
export const OS_ANDROID = 'android' as const

/**
 * 操作系统：iOS
 */
export const OS_IOS = 'ios' as const

/**
 * 操作系统：未知
 */
export const OS_UNKNOWN = 'unknown' as const

// ========== 平台类型 ==========

/**
 * 平台：浏览器
 */
export const PLATFORM_BROWSER = 'browser' as const

/**
 * 平台：Node.js
 */
export const PLATFORM_NODE = 'node' as const

/**
 * 平台：Web Worker
 */
export const PLATFORM_WEB_WORKER = 'web-worker' as const

/**
 * 平台：React Native
 */
export const PLATFORM_REACT_NATIVE = 'react-native' as const

/**
 * 平台：微信小程序
 */
export const PLATFORM_WX_MINIPROGRAM = 'wx-miniprogram' as const

// ========== 网络类型 ==========

/**
 * 网络：以太网
 */
export const NETWORK_TYPE_ETHERNET = 'ethernet' as const

/**
 * 网络：WiFi
 */
export const NETWORK_TYPE_WIFI = 'wifi' as const

/**
 * 网络：2G
 */
export const NETWORK_TYPE_2G = '2g' as const

/**
 * 网络：3G
 */
export const NETWORK_TYPE_3G = '3g' as const

/**
 * 网络：4G
 */
export const NETWORK_TYPE_4G = '4g' as const

/**
 * 网络：5G
 */
export const NETWORK_TYPE_5G = '5g' as const

/**
 * 网络：未知
 */
export const NETWORK_TYPE_UNKNOWN = 'unknown' as const

// ========== 屏幕分类 ==========

/**
 * 屏幕：超小屏 (< 576px)
 */
export const SCREEN_XS = 'xs' as const

/**
 * 屏幕：小屏 (≥ 576px)
 */
export const SCREEN_SM = 'sm' as const

/**
 * 屏幕：中屏 (≥ 768px)
 */
export const SCREEN_MD = 'md' as const

/**
 * 屏幕：大屏 (≥ 992px)
 */
export const SCREEN_LG = 'lg' as const

/**
 * 屏幕：超大屏 (≥ 1200px)
 */
export const SCREEN_XL = 'xl' as const

/**
 * 屏幕：超超大屏 (≥ 1400px)
 */
export const SCREEN_XXL = 'xxl' as const

// ========== 断点值 ==========

/**
 * 断点：超小屏 (0px)
 */
export const BREAKPOINT_XS = 0

/**
 * 断点：小屏 (576px)
 */
export const BREAKPOINT_SM = 576

/**
 * 断点：中屏 (768px)
 */
export const BREAKPOINT_MD = 768

/**
 * 断点：大屏 (992px)
 */
export const BREAKPOINT_LG = 992

/**
 * 断点：超大屏 (1200px)
 */
export const BREAKPOINT_XL = 1200

/**
 * 断点：超超大屏 (1400px)
 */
export const BREAKPOINT_XXL = 1400

/**
 * 所有断点值的有序数组
 */
export const BREAKPOINTS = [
  BREAKPOINT_XS,
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_XXL,
] as const

// ========== 设备能力 ==========

/**
 * 能力：触摸支持
 */
export const CAPABILITY_TOUCH = 'touch' as const

/**
 * 能力：悬停支持
 */
export const CAPABILITY_HOVER = 'hover' as const

/**
 * 能力：指针支持
 */
export const CAPABILITY_POINTER = 'pointer' as const

// ========== 屏幕方向 ==========

/**
 * 方向：竖屏
 */
export const ORIENTATION_PORTRAIT = 'portrait' as const

/**
 * 方向：横屏
 */
export const ORIENTATION_LANDSCAPE = 'landscape' as const

/**
 * 所有设备类型常量
 */
export const DEVICE_TYPES = [
  DEVICE_TYPE_MOBILE,
  DEVICE_TYPE_TABLET,
  DEVICE_TYPE_DESKTOP,
  DEVICE_TYPE_UNKNOWN,
] as const

/**
 * 所有浏览器类型常量
 */
export const BROWSER_TYPES = [
  BROWSER_CHROME,
  BROWSER_FIREFOX,
  BROWSER_SAFARI,
  BROWSER_EDGE,
  BROWSER_OPERA,
  BROWSER_IE,
  BROWSER_UNKNOWN,
] as const

/**
 * 所有操作系统常量
 */
export const OPERATING_SYSTEMS = [
  OS_WINDOWS,
  OS_MAC,
  OS_LINUX,
  OS_ANDROID,
  OS_IOS,
  OS_UNKNOWN,
] as const

/**
 * 所有平台类型常量
 */
export const PLATFORM_TYPES = [
  PLATFORM_BROWSER,
  PLATFORM_NODE,
  PLATFORM_WEB_WORKER,
  PLATFORM_REACT_NATIVE,
  PLATFORM_WX_MINIPROGRAM,
] as const
