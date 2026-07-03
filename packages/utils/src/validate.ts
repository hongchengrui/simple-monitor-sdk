import { logger } from './logger'

/**
 * 验证选项类型是否为期望的类型
 * @param target 要验证的值
 * @param targetName 选项名称（用于错误提示）
 * @param expectType 期望的类型
 * @returns 是否通过验证
 */
export function validateOption(target: any, targetName: string, expectType: string): boolean {
  if (typeof target === expectType) return true
  typeof target !== 'undefined' &&
    logger.error(`${targetName}期望传入${expectType}类型，目前是${typeof target}类型`)
  return false
}

/**
 * 验证选项类型是否为期望的类型（使用 toString 检测）
 * @param target 要验证的值
 * @param targetName 选项名称（用于错误提示）
 * @param expectType 期望的类型（如 '[object String]'）
 * @returns 是否通过验证
 */
export function toStringValidateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean {
  const nativeToString = Object.prototype.toString
  if (nativeToString.call(target) === expectType) return true
  typeof target !== 'undefined' &&
    logger.error(`${targetName}期望传入${expectType}类型，目前是${nativeToString.call(target)}类型`)
  return false
}

/**
 * 类型检查工具函数
 * @param target 要检查的值
 * @param type 期望的类型字符串
 */
export function typeofAny(target: any, type: string): boolean {
  return typeof target === type
}

/**
 * toString 类型检查工具函数
 * @param target 要检查的值
 * @param type 期望的类型字符串（如 '[object String]'）
 */
export function toStringAny(target: any, type: string): boolean {
  return Object.prototype.toString.call(target) === type
}
