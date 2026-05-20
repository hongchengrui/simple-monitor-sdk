/**
 * Device and Browser Type Constants
 *
 * Constants for device types, browser types, and operating systems.
 *
 * @module device
 */

// ========== Device Types ==========

/**
 * Device type: Mobile
 */
export const DEVICE_TYPE_MOBILE = 'mobile' as const;

/**
 * Device type: Tablet
 */
export const DEVICE_TYPE_TABLET = 'tablet' as const;

/**
 * Device type: Desktop
 */
export const DEVICE_TYPE_DESKTOP = 'desktop' as const;

/**
 * Device type: Unknown
 */
export const DEVICE_TYPE_UNKNOWN = 'unknown' as const;

// ========== Browser Types ==========

/**
 * Browser: Chrome
 */
export const BROWSER_CHROME = 'chrome' as const;

/**
 * Browser: Firefox
 */
export const BROWSER_FIREFOX = 'firefox' as const;

/**
 * Browser: Safari
 */
export const BROWSER_SAFARI = 'safari' as const;

/**
 * Browser: Edge
 */
export const BROWSER_EDGE = 'edge' as const;

/**
 * Browser: Opera
 */
export const BROWSER_OPERA = 'opera' as const;

/**
 * Browser: Internet Explorer
 */
export const BROWSER_IE = 'ie' as const;

/**
 * Browser: Unknown
 */
export const BROWSER_UNKNOWN = 'unknown' as const;

// ========== Operating Systems ==========

/**
 * OS: Windows
 */
export const OS_WINDOWS = 'windows' as const;

/**
 * OS: macOS
 */
export const OS_MAC = 'mac' as const;

/**
 * OS: Linux
 */
export const OS_LINUX = 'linux' as const;

/**
 * OS: Android
 */
export const OS_ANDROID = 'android' as const;

/**
 * OS: iOS
 */
export const OS_IOS = 'ios' as const;

/**
 * OS: Unknown
 */
export const OS_UNKNOWN = 'unknown' as const;

// ========== Platform Types ==========

/**
 * Platform: Browser
 */
export const PLATFORM_BROWSER = 'browser' as const;

/**
 * Platform: Node.js
 */
export const PLATFORM_NODE = 'node' as const;

/**
 * Platform: Web Worker
 */
export const PLATFORM_WEB_WORKER = 'web-worker' as const;

/**
 * Platform: React Native
 */
export const PLATFORM_REACT_NATIVE = 'react-native' as const;

/**
 * Platform: WeChat Mini Program
 */
export const PLATFORM_WX_MINIPROGRAM = 'wx-miniprogram' as const;

// ========== Network Types ==========

/**
 * Network: Ethernet
 */
export const NETWORK_TYPE_ETHERNET = 'ethernet' as const;

/**
 * Network: WiFi
 */
export const NETWORK_TYPE_WIFI = 'wifi' as const;

/**
 * Network: 2G
 */
export const NETWORK_TYPE_2G = '2g' as const;

/**
 * Network: 3G
 */
export const NETWORK_TYPE_3G = '3g' as const;

/**
 * Network: 4G
 */
export const NETWORK_TYPE_4G = '4g' as const;

/**
 * Network: 5G
 */
export const NETWORK_TYPE_5G = '5g' as const;

/**
 * Network: Unknown
 */
export const NETWORK_TYPE_UNKNOWN = 'unknown' as const;

// ========== Screen Categories ==========

/**
 * Screen: Extra Small (< 576px)
 */
export const SCREEN_XS = 'xs' as const;

/**
 * Screen: Small (≥ 576px)
 */
export const SCREEN_SM = 'sm' as const;

/**
 * Screen: Medium (≥ 768px)
 */
export const SCREEN_MD = 'md' as const;

/**
 * Screen: Large (≥ 992px)
 */
export const SCREEN_LG = 'lg' as const;

/**
 * Screen: Extra Large (≥ 1200px)
 */
export const SCREEN_XL = 'xl' as const;

/**
 * Screen: Extra Extra Large (≥ 1400px)
 */
export const SCREEN_XXL = 'xxl' as const;

// ========== Breakpoint Values ==========

/**
 * Breakpoint: Extra Small (0px)
 */
export const BREAKPOINT_XS = 0;

/**
 * Breakpoint: Small (576px)
 */
export const BREAKPOINT_SM = 576;

/**
 * Breakpoint: Medium (768px)
 */
export const BREAKPOINT_MD = 768;

/**
 * Breakpoint: Large (992px)
 */
export const BREAKPOINT_LG = 992;

/**
 * Breakpoint: Extra Large (1200px)
 */
export const BREAKPOINT_XL = 1200;

/**
 * Breakpoint: Extra Extra Large (1400px)
 */
export const BREAKPOINT_XXL = 1400;

/**
 * All breakpoint values in order
 */
export const BREAKPOINTS = [
  BREAKPOINT_XS,
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_XXL,
] as const;

// ========== Device Capabilities ==========

/**
 * Touch support capability
 */
export const CAPABILITY_TOUCH = 'touch' as const;

/**
 * Hover support capability
 */
export const CAPABILITY_HOVER = 'hover' as const;

/**
 * Pointer support capability
 */
export const CAPABILITY_POINTER = 'pointer' as const;

// ========== Orientation Types ==========

/**
 * Orientation: Portrait
 */
export const ORIENTATION_PORTRAIT = 'portrait' as const;

/**
 * Orientation: Landscape
 */
export const ORIENTATION_LANDSCAPE = 'landscape' as const;

/**
 * All device type constants
 */
export const DEVICE_TYPES = [
  DEVICE_TYPE_MOBILE,
  DEVICE_TYPE_TABLET,
  DEVICE_TYPE_DESKTOP,
  DEVICE_TYPE_UNKNOWN,
] as const;

/**
 * All browser type constants
 */
export const BROWSER_TYPES = [
  BROWSER_CHROME,
  BROWSER_FIREFOX,
  BROWSER_SAFARI,
  BROWSER_EDGE,
  BROWSER_OPERA,
  BROWSER_IE,
  BROWSER_UNKNOWN,
] as const;

/**
 * All operating system constants
 */
export const OPERATING_SYSTEMS = [
  OS_WINDOWS,
  OS_MAC,
  OS_LINUX,
  OS_ANDROID,
  OS_IOS,
  OS_UNKNOWN,
] as const;

/**
 * All platform type constants
 */
export const PLATFORM_TYPES = [
  PLATFORM_BROWSER,
  PLATFORM_NODE,
  PLATFORM_WEB_WORKER,
  PLATFORM_REACT_NATIVE,
  PLATFORM_WX_MINIPROGRAM,
] as const;
