import { MonitorConfig } from '@simple-monitor/shared'
import { Queue } from './Queue'
import { Sender } from './Sender'
import { Breadcrumb } from './Breadcrumb'
import { ErrorCollector } from './collectors/ErrorCollector'
import { PerformanceCollector } from './collectors/PerformanceCollector'
import { BehaviorCollector } from './collectors/BehaviorCollector'
import { HTTPCollector } from './collectors/HTTPCollector'
import { ConsoleCollector } from './collectors/ConsoleCollector'
import { RouterCollector } from './collectors/RouterCollector'
import { logger } from '@simple-monitor/shared'
import { generateUUID } from '@simple-monitor/shared'

/**
 * 监控核心类
 */
export class Monitor {
  private config: MonitorConfig
  private queue: Queue
  private sender: Sender
  private breadcrumb: Breadcrumb
  private sessionId: string
  private collectors: any[] = []

  //将用户传入的配置保存为实例属性，供后续使用
  constructor(config: MonitorConfig) {
    this.config = config
    this.queue = new Queue(config)
    this.sender = new Sender(config, this.queue)
    this.breadcrumb = new Breadcrumb(config)
    this.sessionId = generateUUID()
  }

  /**
   * 初始化监控
   */
  init(): void {
    if (this.config.disabled) {
      logger.info('Monitor is disabled')
      return
    }

    logger.info('Initializing monitor', { sessionId: this.sessionId })

    // 初始化收集器
    this.initCollectors()

    // 启动发送器
    this.sender.start()

    // 启动定时上报
    this.queue.startBatchTimer()

    logger.info('Monitor initialized successfully')
  }

  /**
   * 初始化收集器
   */
  private initCollectors(): void {
    // 错误收集器 - 需要 breadcrumb 来记录用户行为路径
    const errorCollector = new ErrorCollector(
      this.config,
      this.queue,
      this.sessionId,
      this.breadcrumb
    )
    this.collectors.push(errorCollector)

    // 性能收集器 - 不需要 breadcrumb
    const performanceCollector = new PerformanceCollector(
      this.config,
      this.queue,
      this.sessionId
    )
    this.collectors.push(performanceCollector)

    // 行为收集器 - 不需要 breadcrumb
    const behaviorCollector = new BehaviorCollector(
      this.config,
      this.queue,
      this.sessionId
    )
    this.collectors.push(behaviorCollector)

    // HTTP 收集器 - 需要 breadcrumb 来记录 HTTP 请求
    const httpCollector = new HTTPCollector(
      this.config,
      this.queue,
      this.sessionId,
      this.breadcrumb
    )
    this.collectors.push(httpCollector)

    // Console 收集器 - 需要 breadcrumb 来记录 Console 调用
    const consoleCollector = new ConsoleCollector(
      this.config,
      this.queue,
      this.sessionId,
      this.breadcrumb
    )
    this.collectors.push(consoleCollector)

    // Router 收集器 - 需要 breadcrumb 来记录路由变化
    const routerCollector = new RouterCollector(
      this.config,
      this.queue,
      this.sessionId,
      this.breadcrumb
    )
    this.collectors.push(routerCollector)

    // 启动所有收集器
    this.collectors.forEach((collector) => collector.start())
  }

  /**
   * 手动上报
   */
  log(data: any): void {
    this.queue.add({
      ...data,
      sessionId: this.sessionId,
      url: window.location.href,
      time: Date.now(),
    })
  }

  /**
   * 获取面包屑
   */
  getBreadcrumbs() {
    return this.breadcrumb.getAll()
  }

  /**
   * 销毁监控
   */
  destroy(): void {
    logger.info('Destroying monitor')

    // 停止收集器
    this.collectors.forEach((collector) => {
      if (collector.stop) collector.stop()
    })

    // 销毁队列
    this.queue.destroy()

    logger.info('Monitor destroyed')
  }
}
