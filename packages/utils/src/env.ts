/**
 * Environment Detection Utilities
 *
 * Provides utilities for detecting the current runtime environment.
 * Supports browser, Node.js, WeChat Mini Program, and other environments.
 *
 * @module env
 */

import { getGlobalObject } from './global';

// 重新导出 getGlobalObject
export { getGlobalObject };

// Type declarations for Node.js globals
declare const process: any;

/**
 * Checks if the current environment is a browser.
 */
export function isBrowser(): boolean {
  const globalObj = getGlobalObject();
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    !!globalObj.document?.documentElement
  );
}

/**
 * Checks if the current environment is Node.js.
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process?.versions !== undefined &&
    process?.versions?.node !== undefined
  );
}

/**
 * Checks if the current environment is a Web Worker.
 */
export function isWebWorker(): boolean {
  return (
    typeof self === 'object' &&
    (self as any).constructor &&
    (self as any).constructor.name === 'DedicatedWorkerGlobalScope'
  );
}

/**
 * Checks if the current environment is WeChat Mini Program.
 */
export function isWxMiniProgram(): boolean {
  const globalObj = getGlobalObject();
  const wx = (globalObj as any).wx;
  return typeof wx === 'object' && wx !== null;
}

/**
 * Checks if the current environment is a React Native app.
 */
export function isReactNative(): boolean {
  const globalObj = getGlobalObject();
  const navigator = (globalObj as any).navigator;
  return typeof navigator !== 'undefined' &&
    navigator?.product === 'ReactNative';
}

/**
 * Checks if the current environment supports IndexedDB.
 */
export function hasIndexedDB(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Checks if the current environment supports localStorage.
 */
export function hasLocalStorage(): boolean {
  try {
    const testKey = '__simple_monitor_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if the current environment supports sessionStorage.
 */
export function hasSessionStorage(): boolean {
  try {
    const testKey = '__simple_monitor_test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if the current environment supports Fetch API.
 */
export function hasFetch(): boolean {
  return typeof fetch !== 'undefined' && fetch !== null;
}

/**
 * Checks if the current environment supports XMLHttpRequest.
 */
export function hasXHR(): boolean {
  return typeof XMLHttpRequest !== 'undefined' && XMLHttpRequest !== null;
}

/**
 * Checks if the current environment supports RequestIdleCallback.
 */
export function hasRequestIdleCallback(): boolean {
  return typeof requestIdleCallback !== 'undefined';
}

/**
 * Checks if the current environment supports Performance API.
 */
export function hasPerformanceAPI(): boolean {
  return typeof performance !== 'undefined' && performance !== null;
}

/**
 * Checks if the current environment supports MutationObserver.
 */
export function hasMutationObserver(): boolean {
  return typeof MutationObserver !== 'undefined' && MutationObserver !== null;
}

/**
 * Gets the current page URL safely.
 */
export function getLocationHref(): string {
  try {
    if (isBrowser() && typeof location !== 'undefined') {
      return location.href;
    }
  } catch {
    // Accessing location.href can throw in some iframe scenarios
  }
  return '';
}

/**
 * Gets the current page origin safely.
 */
export function getLocationOrigin(): string {
  try {
    if (isBrowser() && typeof location !== 'undefined') {
      return location.origin;
    }
  } catch {
    // Accessing location.origin can throw in some scenarios
  }
  return '';
}

/**
 * Gets user agent string safely.
 */
export function getUserAgent(): string {
  try {
    if (isBrowser() && typeof navigator !== 'undefined') {
      return navigator.userAgent || '';
    }
  } catch {
    // navigator.userAgent can be blocked in some browsers
  }
  return '';
}

/**
 * Detects the browser type.
 */
export function getBrowserType(): 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'unknown' {
  const ua = getUserAgent().toLowerCase();

  if (ua.includes('edg/') || ua.includes('edge/')) {
    return 'edge';
  }
  if (ua.includes('opr/') || ua.includes('opera')) {
    return 'opera';
  }
  if (ua.includes('chrome/') && !ua.includes('edg/')) {
    return 'chrome';
  }
  if (ua.includes('firefox/')) {
    return 'firefox';
  }
  if (ua.includes('safari/') && !ua.includes('chrome/')) {
    return 'safari';
  }
  if (ua.includes('trident/') || ua.includes('msie')) {
    return 'ie';
  }

  return 'unknown';
}

/**
 * Detects the operating system.
 */
export function getOS(): 'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'unknown' {
  const ua = getUserAgent().toLowerCase();

  if (ua.includes('windows')) {
    return 'windows';
  }
  if (ua.includes('macintosh') || ua.includes('mac os x')) {
    return 'mac';
  }
  if (ua.includes('linux')) {
    return 'linux';
  }
  if (ua.includes('android')) {
    return 'android';
  }
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    return 'ios';
  }

  return 'unknown';
}

/**
 * Checks if the device is a mobile device.
 */
export function isMobile(): boolean {
  const ua = getUserAgent().toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
}

/**
 * Checks if the device is a tablet.
 */
export function isTablet(): boolean {
  const ua = getUserAgent().toLowerCase();
  return /ipad|android(?!.*mobile)|tablet/i.test(ua);
}

/**
 * Checks if the device is a desktop.
 */
export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

/**
 * Gets the device pixel ratio.
 */
export function getPixelRatio(): number {
  if (isBrowser() && typeof window !== 'undefined' && window.devicePixelRatio !== undefined) {
    return window.devicePixelRatio;
  }
  return 1;
}

/**
 * Gets the screen dimensions.
 */
export function getScreenSize(): { width: number; height: number } {
  if (isBrowser() && typeof screen !== 'undefined') {
    return {
      width: screen.width || 0,
      height: screen.height || 0,
    };
  }
  return { width: 0, height: 0 };
}

/**
 * Gets the viewport dimensions.
 */
export function getViewportSize(): { width: number; height: number } {
  if (isBrowser() && typeof window !== 'undefined') {
    return {
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
    };
  }
  return { width: 0, height: 0 };
}

/**
 * Gets the browser language.
 */
export function getLanguage(): string {
  try {
    if (isBrowser() && typeof navigator !== 'undefined') {
      return navigator.language || (navigator as any).languages?.[0] || '';
    }
  } catch {
    // navigator.language can throw in some browsers
  }
  return '';
}

/**
 * Gets the timezone.
 */
export function getTimezone(): string {
  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    }
  } catch {
    // Intl can throw in some environments
  }
  return '';
}

/**
 * Environment detection summary object.
 */
export interface EnvInfo {
  isBrowser: boolean;
  isNode: boolean;
  isWebWorker: boolean;
  isWxMiniProgram: boolean;
  isReactNative: boolean;
  browserType: string;
  os: string;
  isMobile: boolean;
  isTablet: boolean;
  language: string;
  timezone: string;
}

/**
 * Gets comprehensive environment information.
 */
export function getEnvInfo(): EnvInfo {
  return {
    isBrowser: isBrowser(),
    isNode: isNode(),
    isWebWorker: isWebWorker(),
    isWxMiniProgram: isWxMiniProgram(),
    isReactNative: isReactNative(),
    browserType: getBrowserType(),
    os: getOS(),
    isMobile: isMobile(),
    isTablet: isTablet(),
    language: getLanguage(),
    timezone: getTimezone(),
  };
}
