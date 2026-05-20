/**
 * 标志位工具
 *
 * 用于管理事件订阅状态，防止重复订阅。
 *
 * @module flag
 */

import { getGlobalObject } from './global';

/**
 * 标志位前缀
 * 用于在全局对象上存储订阅状态
 */
const FLAG_PREFIX = '__simple_monitor_flag_';

/**
 * 获取标志位完整键名
 *
 * @param key - 标志键名
 * @returns 完整键名
 */
function getFlagKey(key: string): string {
  return `${FLAG_PREFIX}${key}`;
}

/**
 * 获取标志位状态
 * 用于检查某个事件是否已被订阅
 *
 * @param key - 标志键名
 * @returns 标志位状态
 */
export function getFlag(key: string): boolean {
  const globalObj = getGlobalObject() as any;
  const flagKey = getFlagKey(key);
  return !!globalObj[flagKey];
}

/**
 * 设置标志位状态
 *
 * @param key - 标志键名
 * @param value - 标志位状态
 */
export function setFlag(key: string, value: boolean): void {
  const globalObj = getGlobalObject() as any;
  const flagKey = getFlagKey(key);
  globalObj[flagKey] = value;
}

/**
 * 删除标志位
 *
 * @param key - 标志键名
 */
export function removeFlag(key: string): void {
  const globalObj = getGlobalObject() as any;
  const flagKey = getFlagKey(key);
  delete globalObj[flagKey];
}

/**
 * 清除所有标志位
 */
export function clearAllFlags(): void {
  const globalObj = getGlobalObject() as any;
  Object.keys(globalObj).forEach(key => {
    if (key.startsWith(FLAG_PREFIX)) {
      delete globalObj[key];
    }
  });
}
