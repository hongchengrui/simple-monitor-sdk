/**
 * 基础收集器
 */
export abstract class BaseCollector {
  protected config: any
  protected queue: any
  protected breadcrumb?: any
  protected sessionId: string

  constructor(config: any, queue: any, sessionId: string, breadcrumb?: any) {
    this.config = config
    this.queue = queue
    this.sessionId = sessionId
    this.breadcrumb = breadcrumb
  }

  /**
   * 启动收集器
   */
  abstract start(): void

  /**
   * 停止收集器
   */
  stop(): void {
    // 默认实现为空，子类可以覆盖
  }
}
