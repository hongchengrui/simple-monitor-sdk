/**
 * 日志系统
 *
 * 提供分级日志输出功能，支持静默模式和调试模式。
 *
 * @module logger
 */

import { isString } from './is';

/**
 * 日志级别枚举
 */
export enum LogLevel {
  /** 调试级别 - 最详细的日志 */
  DEBUG = 0,
  /** 信息级别 */
  INFO = 1,
  /** 警告级别 */
  WARN = 2,
  /** 错误级别 */
  ERROR = 3,
  /** 静默级别 - 不输出任何日志 */
  SILENT = 4,
}

/**
 * 日志级别名称映射
 */
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.SILENT]: 'SILENT',
};

/**
 * Logger 类
 * 提供分级日志输出功能
 */
export class Logger {
  /** 当前日志级别 */
  private level: LogLevel = LogLevel.WARN;

  /** 是否静默模式 */
  private silentMode: boolean = false;

  /** 日志前缀 */
  private prefix: string = '[SimpleMonitor]';

  /**
   * 设置日志级别
   *
   * @param level - 日志级别
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * 获取当前日志级别
   *
   * @returns 当前日志级别
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * 设置日志前缀
   *
   * @param prefix - 日志前缀
   */
  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  /**
   * 设置静默模式
   *
   * @param silent - 是否静默
   */
  setSilent(silent: boolean): void {
    this.silentMode = silent;
  }

  /**
   * 输出调试日志
   *
   * @param args - 日志内容
   */
  debug(...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', ...args));
    }
  }

  /**
   * 输出信息日志
   *
   * @param args - 日志内容
   */
  info(...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', ...args));
    }
  }

  /**
   * 输出警告日志
   *
   * @param args - 日志内容
   */
  warn(...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', ...args));
    }
  }

  /**
   * 输出错误日志
   *
   * @param args - 日志内容
   */
  error(...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', ...args));
    }
  }

  /**
   * 判断是否应该输出日志
   *
   * @param messageLevel - 日志消息级别
   * @returns 是否应该输出
   */
  private shouldLog(messageLevel: LogLevel): boolean {
    if (this.silentMode) {
      return false;
    }
    return messageLevel >= this.level;
  }

  /**
   * 格式化日志消息
   *
   * @param level - 日志级别名称
   * @param args - 日志内容
   * @returns 格式化后的日志内容
   */
  private formatMessage(level: string, ...args: any[]): any[] {
    return [`${this.prefix} [${level}]`, ...args];
  }

  /**
   * 静默所有日志输出
   */
  silent(): void {
    this.setSilent(true);
  }

  /**
   * 恢复日志输出
   */
  unsilent(): void {
    this.setSilent(false);
  }
}

/**
 * 全局 Logger 单例实例
 */
export const logger = new Logger();

/**
 * 判断是否应该记录日志
 * 避免在日志处理中产生循环调用
 *
 * @returns 是否应该记录日志
 */
export function shouldLog(): boolean {
  // 检查是否在SDK自身的日志处理过程中
  return !logger.getLevel || logger.getLevel() < LogLevel.SILENT;
}

/**
 * 在作用域内静默执行回调
 * 回调执行过程中的日志不会被输出
 *
 * @param callback - 要执行的回调函数
 * @returns 回调的返回值
 */
export function silentConsoleScope<T>(callback: () => T): T {
  const currentLevel = logger.getLevel();
  // 临时保存静默状态
  const wasSilent = logger['silentMode'];

  // 设置为静默模式
  logger.setSilent(true);

  try {
    return callback();
  } finally {
    // 恢复原始状态
    logger['silentMode'] = wasSilent;
    logger.setLevel(currentLevel);
  }
}

/**
 * 将任意值转换为字符串
 * 用于日志输出时的参数格式化
 *
 * @param target - 要转换的值
 * @returns 字符串表示
 */
export function logToString(target: any): string {
  if (target === null || target === undefined) {
    return String(target);
  }

  if (isString(target)) {
    return target;
  }

  if (typeof target === 'object') {
    try {
      return JSON.stringify(target);
    } catch {
      return '[Object]';
    }
  }

  return String(target);
}

/**
 * 从字符串解析日志级别
 *
 * @param levelStr - 日志级别字符串
 * @returns LogLevel 枚举值，解析失败返回 INFO
 */
export function parseLogLevel(levelStr: string): LogLevel {
  const upperStr = levelStr.toUpperCase();

  // 查找匹配的日志级别
  for (const [, value] of Object.entries(LogLevel)) {
    const levelValue = value as LogLevel;
    if (LOG_LEVEL_NAMES[levelValue] === upperStr) {
      return levelValue;
    }
  }

  return LogLevel.INFO;
}
