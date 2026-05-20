/**
 * 函数工具
 *
 * 提供函数名称获取、参数验证等工具函数。
 *
 * @module function
 */

import { variableTypeDetection } from './is';

/**
 * void 函数类型
 * 表示无返回值的函数
 */
export type voidFun = () => void;

/**
 * 获取函数名称
 * 匿名函数返回 <anonymous>
 *
 * @param fn - 目标函数
 * @returns 函数名称或 '<anonymous>'
 *
 * @example
 * ```ts
 * function namedFunction() {}
 * getFunctionName(namedFunction); // 'namedFunction'
 *
 * const anonymous = function() {};
 * getFunctionName(anonymous); // '<anonymous>'
 *
 * const arrow = () => {};
 * getFunctionName(arrow); // 'arrow' (如果是具名箭头函数) 或 '<anonymous>'
 * ```
 */
export function getFunctionName(fn: Function): string {
  if (!fn) {
    return '';
  }

  // 尝试从函数的 name 属性获取（ES6+）
  if (fn.name) {
    return fn.name;
  }

  // 尝试从函数的 toString 结果中解析名称
  const functionString = fn.toString();

  // 匹配 function name(...) 格式
  const match = functionString.match(/^function\s+([\w$]+)\s*\(/);
  if (match && match[1]) {
    return match[1];
  }

  // 匹配箭头函数的 name (如果是在变量声明中)
  const arrowMatch = functionString.match(/^\s*(?:const|let|var)\s+([\w$]+)\s*=\s*(?:\([^)]*\)|[^=]*)\s*=>/);
  if (arrowMatch && arrowMatch[1]) {
    return arrowMatch[1];
  }

  // 匿名函数
  return '<anonymous>';
}

/**
 * 验证配置选项的类型
 * 当类型不匹配时，输出错误日志
 *
 * @param target - 待验证的值
 * @param targetName - 配置项名称（用于错误提示）
 * @param expectType - 期望的类型（'String' | 'Number' | 'Boolean' | 'Function' | 'Object' | 'Array'）
 * @returns 类型是否匹配
 *
 * @example
 * ```ts
 * // 验证通过
 * validateOption('hello', 'dsn', 'String'); // true
 *
 * // 验证失败，输出错误
 * validateOption(123, 'dsn', 'String'); // false，并输出错误日志
 * ```
 */
export function validateOption(
  target: unknown,
  targetName: string,
  expectType: 'String' | 'Number' | 'Boolean' | 'Function' | 'Object' | 'Array' | 'Undefined' | 'Null',
): boolean {
  // 获取实际类型的字符串表示
  let actualType: string = '';

  switch (expectType) {
    case 'String':
      actualType = variableTypeDetection.isString(target) ? 'String' : '';
      break;
    case 'Number':
      actualType = variableTypeDetection.isNumber(target) ? 'Number' : '';
      break;
    case 'Boolean':
      actualType = variableTypeDetection.isBoolean(target) ? 'Boolean' : '';
      break;
    case 'Function':
      actualType = variableTypeDetection.isFunction(target) ? 'Function' : '';
      break;
    case 'Object':
      actualType = variableTypeDetection.isObject(target) ? 'Object' : '';
      break;
    case 'Array':
      actualType = variableTypeDetection.isArray(target) ? 'Array' : '';
      break;
    case 'Undefined':
      actualType = variableTypeDetection.isUndefined(target) ? 'Undefined' : '';
      break;
    case 'Null':
      actualType = variableTypeDetection.isNull(target) ? 'Null' : '';
      break;
  }

  // 类型匹配
  if (actualType === expectType) {
    return true;
  }

  // 类型不匹配，输出错误
  // eslint-disable-next-line no-console
  console.error(
    `[Simple Monitor] ${targetName} 期望类型是 ${expectType}，但实际收到的是 ${typeof target}`,
  );

  return false;
}

/**
 * 创建一个返回指定值的函数
 *
 * @param value - 要返回的值
 * @returns 返回指定值的函数
 */
export function constant<T>(value: T): () => T {
  return () => value;
}

/**
 * 创建一个返回参数本身的函数
 *
 * @returns 身份函数
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * 空操作函数
 * 什么都不做，用于默认回调或占位
 */
export const noop: voidFun = () => {
  // 空操作
};

/**
 * 返回 false 的函数
 */
export const falsy = () => false;

/**
 * 返回 true 的函数
 */
export const truthy = () => true;

/**
 * 创建一个带上下文的函数包装器
 * 确保函数始终在指定的上下文中执行
 *
 * @param fn - 目标函数
 * @param context - 执行上下文
 * @returns 带上下文的函数
 */
export function bind<T extends (...args: any[]) => any>(fn: T, context: unknown): T {
  return function (this: unknown, ...args: any[]) {
    return fn.apply(context, args);
  } as T;
}

/**
 * 函数组合：从右到左执行函数
 *
 * @param fns - 要组合的函数列表
 * @returns 组合后的函数
 *
 * @example
 * ```ts
 * const add = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const composed = compose(double, add);
 * composed(3); // 8 -> (3 + 1) * 2
 * ```
 */
export function compose<R>(...fns: Array<(arg: any) => any>): (arg: any) => R {
  if (fns.length === 0) {
    return (arg: any) => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return (arg: any) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

/**
 * 管道：从左到右执行函数
 *
 * @param fns - 要执行的函数列表
 * @returns 管道函数
 *
 * @example
 * ```ts
 * const add = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const piped = pipe(add, double);
 * piped(3); // 8 -> (3 + 1) * 2
 * ```
 */
export function pipe<R>(...fns: Array<(arg: any) => any>): (arg: any) => R {
  if (fns.length === 0) {
    return (arg: any) => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}

/**
 * 记忆化函数
 * 缓存函数的结果，避免重复计算
 *
 * @param fn - 要记忆化的函数
 * @param keyFn - 生成缓存键的函数（默认使用 JSON.stringify）
 * @returns 记忆化后的函数
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string,
): T {
  const cache = new Map<string, ReturnType<T>>();

  return (function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 清除记忆化缓存
 *
 * @param memoizedFn - 记忆化的函数
 */
export function clearMemoizeCache<T extends (...args: any[]) => any>(
  memoizedFn: T,
): void {
  // 记忆化函数的缓存存储在闭包中
  // 这里提供的是一个约定，实际实现需要配合 memoize 使用
  if ((memoizedFn as any).cache && (memoizedFn as any).cache.clear) {
    (memoizedFn as any).cache.clear();
  }
}

/**
 * 只执行一次的函数
 * 第一次调用后，后续调用都返回第一次的结果
 *
 * @param fn - 目标函数
 * @returns 只执行一次的包装函数
 */
export function onceFn<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return (function (this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  }) as T;
}

/**
 * 延迟执行函数
 *
 * @param fn - 目标函数
 * @param delay - 延迟时间（毫秒）
 * @returns 取消执行的函数
 */
export function delay(fn: voidFun, delayMs: number): () => void {
  const timerId = setTimeout(fn, delayMs);
  return () => clearTimeout(timerId);
}

