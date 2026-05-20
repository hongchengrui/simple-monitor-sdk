/**
 * 事件监听工具
 *
 * 提供跨平台的事件监听器添加和移除功能。
 *
 * @module event
 */

import { isFunction } from './is';

/**
 * 添加事件监听器
 * 兼容浏览器和Node.js环境
 *
 * @param target - 事件目标对象
 * @param eventName - 事件名称
 * @param handler - 事件处理函数
 * @param options - 监听器选项（capture、passive等）
 * @returns 是否成功添加监听器
 */
export function on(
  target: any,
  eventName: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): boolean {
  if (!target || !eventName || !isFunction(handler)) {
    return false;
  }

  if (target.addEventListener) {
    // 浏览器环境
    target.addEventListener(eventName, handler, options);
    return true;
  }

  if (target.on) {
    // Node.js EventEmitter
    target.on(eventName, handler);
    return true;
  }

  if (target.addListener) {
    // 其他兼容EventEmitter的对象
    target.addListener(eventName, handler);
    return true;
  }

  return false;
}

/**
 * 移除事件监听器
 *
 * @param target - 事件目标对象
 * @param eventName - 事件名称
 * @param handler - 事件处理函数
 * @param options - 监听器选项
 * @returns 是否成功移除监听器
 */
export function off(
  target: any,
  eventName: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): boolean {
  if (!target || !eventName || !isFunction(handler)) {
    return false;
  }

  if (target.removeEventListener) {
    // 浏览器环境
    target.removeEventListener(eventName, handler, options);
    return true;
  }

  if (target.off) {
    // Node.js EventEmitter
    target.off(eventName, handler);
    return true;
  }

  if (target.removeListener) {
    // 其他兼容EventEmitter的对象
    target.removeListener(eventName, handler);
    return true;
  }

  return false;
}

/**
 * 一次性事件监听器
 * 触发一次后自动移除
 *
 * @param target - 事件目标对象
 * @param eventName - 事件名称
 * @param handler - 事件处理函数
 * @param options - 监听器选项
 * @returns 移除监听器的函数
 */
export function once(
  target: any,
  eventName: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): () => void {
  if (!target || !eventName || !isFunction(handler)) {
    return () => {};
  }

  // 包装处理函数，触发后自动移除
  const wrapper = ((event: Event) => {
    // 移除监听器
    off(target, eventName, wrapper as any, options);
    // 调用原始处理函数
    return handler(event);
  }) as any;

  // 保存原始处理函数引用
  wrapper.handler = handler;

  // 添加监听器
  if (target.addEventListener) {
    target.addEventListener(eventName, wrapper, options);
  } else if (target.once) {
    // Node.js EventEmitter 原生支持 once
    target.once(eventName, handler);
  } else {
    // 回退到普通监听
    on(target, eventName, wrapper, options);
  }

  // 返回移除函数
  return () => {
    off(target, eventName, wrapper, options);
  };
}

/**
 * 触发自定义事件
 *
 * @param target - 事件目标对象
 * @param eventName - 事件名称
 * @param data - 事件数据
 * @returns 是否成功触发
 */
export function emit(target: any, eventName: string, data?: any): boolean {
  if (!target || !eventName) {
    return false;
  }

  if (target.dispatchEvent) {
    // 浏览器环境 - 创建自定义事件
    const event = new CustomEvent(eventName, { detail: data });
    return target.dispatchEvent(event);
  }

  if (target.emit) {
    // Node.js EventEmitter
    target.emit(eventName, data);
    return true;
  }

  return false;
}
