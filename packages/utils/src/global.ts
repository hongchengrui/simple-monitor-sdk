/**
 * 全局变量管理
 *
 * 提供跨平台的全局对象访问和SDK实例存储。
 *
 * @module global
 */

// Type declarations for global variables
declare const global: any;

/**
 * 获取全局对象
 * 兼容浏览器、Node.js、Web Worker等环境
 *
 * @returns 全局对象 (globalThis/window/global/self)
 */
export function getGlobalObject(): typeof globalThis {
  // 现代环境的 globalThis
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  // 浏览器环境
  if (typeof window !== 'undefined') {
    return window;
  }

  // Web Workers
  if (typeof self !== 'undefined') {
    return self;
  }

  // Node.js
  if (typeof global !== 'undefined') {
    return global;
  }

  // 回退方案
  try {
    // eslint-disable-next-line no-new-func
    return new Function('return this')();
  } catch {
    // 所有方法都失败，返回空对象
    return {} as any;
  }
}

/**
 * 全局对象引用
 * 用于快速访问全局对象
 */
export const _global = getGlobalObject();

/**
 * 全局支持对象键名
 * 用于在全局对象上存储SDK实例和相关数据
 */
const SUPPORT_KEY = '__simple_monitor_support__';

/**
 * 获取或初始化全局支持对象
 * 用于存储SDK单例实例和配置
 *
 * @returns 全局支持对象
 */
export function getSupportObject(): Record<string, any> {
  const globalObj = getGlobalObject();
  if (!(globalObj as any)[SUPPORT_KEY]) {
    (globalObj as any)[SUPPORT_KEY] = {};
  }
  return (globalObj as any)[SUPPORT_KEY];
}

/**
 * 设置支持对象属性
 *
 * @param key - 属性键名
 * @param value - 属性值
 */
export function setSupportProp(key: string, value: any): void {
  const support = getSupportObject();
  support[key] = value;
}

/**
 * 获取支持对象属性
 *
 * @param key - 属性键名
 * @returns 属性值，不存在则返回 undefined
 */
export function getSupportProp(key: string): any {
  const support = getSupportObject();
  return support[key];
}

/**
 * 删除支持对象属性
 *
 * @param key - 属性键名
 */
export function removeSupportProp(key: string): void {
  const support = getSupportObject();
  delete support[key];
}

/**
 * 检查支持对象属性是否存在
 *
 * @param key - 属性键名
 * @returns 是否存在该属性
 */
export function hasSupportProp(key: string): boolean {
  const support = getSupportObject();
  return key in support;
}
