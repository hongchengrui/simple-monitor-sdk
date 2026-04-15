/**
 * 日志级别
 */
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * 日志类
 */
class Logger {
  private level: LogLevel = LogLevel.INFO
  private debugMode: boolean = false

  /**
   * 设置调试模式
   */
  setDebugMode(debug: boolean): void {
    this.debugMode = debug
    this.level = debug ? LogLevel.DEBUG : LogLevel.INFO
  }
  /**
   * 调试日志
   */
  debug(...args: any[]): void {
    if (this.debugMode) {
      console.log('[Monitor SDK Debug]', ...args)
    }
  }
  /**
   * 信息日志
   */
  info(...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log('[Monitor SDK]', ...args)
    }
  }

  /**
   * 警告日志
   */
  warn(...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn('[Monitor SDK]', ...args)
    }
  }

  /**
   * 错误日志
   */
  error(...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error('[Monitor SDK]', ...args)
    }
  }
}

// 导出错误日志实例
export const logger = new Logger()
