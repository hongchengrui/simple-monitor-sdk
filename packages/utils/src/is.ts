/**
 * 类型判断工具
 *
 * 提供各种JavaScript类型的判断方法。
 *
 * @module is
 */

/**
 * Object.prototype.toString 的绑定版本
 * 用于精确判断对象类型
 */
export const nativeToString = Object.prototype.toString;

/**
 * 判断是否为数字类型
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val);
}

/**
 * 判断是否为字符串类型
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

/**
 * 判断是否为布尔类型
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean';
}

/**
 * 判断是否为 undefined
 */
export function isUndefined(val: unknown): val is undefined {
  return val === undefined;
}

/**
 * 判断是否为 null
 */
export function isNull(val: unknown): val is null {
  return val === null;
}

/**
 * 判断是否为 Symbol 类型
 */
export function isSymbol(val: unknown): val is Symbol {
  return typeof val === 'symbol';
}

/**
 * 判断是否为函数类型
 */
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

/**
 * 判断是否为对象类型（排除 null 和数组）
 */
export function isObject(val: unknown): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

/**
 * 判断是否为数组类型
 */
export function isArray(val: unknown): val is any[] {
  return Array.isArray(val);
}

/**
 * 判断是否为 Date 对象
 */
export function isDate(val: unknown): val is Date {
  return nativeToString.call(val) === '[object Date]';
}

/**
 * 判断是否为 RegExp 对象
 */
export function isRegExp(val: unknown): val is RegExp {
  return nativeToString.call(val) === '[object RegExp]';
}

/**
 * 判断是否为 Promise 对象
 */
export function isPromise(val: unknown): val is Promise<any> {
  return nativeToString.call(val) === '[object Promise]' ||
    (val !== null && typeof val === 'object' && 'then' in val && 'catch' in val);
}

/**
 * 类型检测对象
 * 包含所有基础类型的判断方法
 * 提供对象风格的访问方式
 */
export const variableTypeDetection = {
  isNumber,
  isString,
  isBoolean,
  isUndefined,
  isNull,
  isSymbol,
  isFunction,
  isObject,
  isArray,
  isDate,
  isRegExp,
  isPromise,
};

/**
 * 判断是否为 Error 对象及其子类
 *
 * @param error - 待判断的值
 * @returns 是否为 Error 对象
 */
export function isError(error: unknown): error is Error {
  return nativeToString.call(error) === '[object Error]' ||
    error instanceof Error;
}

/**
 * 判断对象是否拥有某属性（不包括继承的属性）
 *
 * @param obj - 目标对象
 * @param key - 属性键名
 * @returns 对象是否拥有该属性
 */
export function isExistProperty(obj: any, key: string | number | symbol): boolean {
  if (!obj) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 判断是否为空值
 * 包括：undefined、null、空字符串、空数组、空对象
 *
 * @param val - 待判断的值
 * @returns 是否为空值
 */
export function isEmpty(val: unknown): boolean {
  if (val === undefined || val === null) {
    return true;
  }

  if (isString(val) && val.trim() === '') {
    return true;
  }

  if (isArray(val) && val.length === 0) {
    return true;
  }

  if (isObject(val) && Object.keys(val).length === 0) {
    return true;
  }

  return false;
}
