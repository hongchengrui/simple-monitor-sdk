import { MonitorConfig } from '@simple-monitor/shared'
import { logger } from '@simple-monitor/shared'

/**
 * 监控数据上报队列
 *
 * 实现思路：
 * 1. 数据收集：接收监控数据并存入内存队列
 * 2. 批量上报：当队列长度达到 batchSize 时自动触发上报
 * 3. 定时上报：通过定时器，每隔 batchTimeout 时间触发一次上报
 * 4. 数据预处理：通过 beforeSend 钩子对数据进行过滤或转换
 *
 * 设计特点：
 * - 双重触发机制：数量达到阈值 或 时间到期
 * - 非阻塞：添加数据不等待上报完成
 * - 队列隔离：flush 时创建副本，清空原队列后返回数据
 */
export class Queue {
  /** 监控配置 */
  private config: MonitorConfig

  /** 数据队列，存储待上报的监控数据 */
  private queue: any[] = []

  /** 定时器 ID，用于定时上报 */
  private timer: number | null = null

  constructor(config: MonitorConfig) {
    this.config = config
  }

  /**
   * 添加数据到队列
   *
   * 流程：
   * 1. 执行 beforeSend 钩子（可选）
   * 2. 如果钩子返回 null，则放弃该数据
   * 3. 否则将数据加入队列
   * 4. 检查队列长度，达到 batchSize 则触发批量上报
   */
  add(data: any): void {
    // 数据预处理钩子
    if (this.config.hooks?.beforeSend) {
      const result = this.config.hooks.beforeSend(data)
      // 钩子返回 null 表示过滤该数据
      if (result === null) {
        logger.debug('Data filtered by beforeSend hook')
        return
      }
      // 钩子可以转换数据
      data = result
    }

    // 加入队列
    this.queue.push(data)
    logger.debug('Data added to queue', { queueSize: this.queue.length })

    // 注释掉立即flush，让Sender的定时器来处理
    // 否则数据会提前被flush掉，导致Sender轮询时队列为空
    // if (this.queue.length >= this.config.batchSize!) {
    //   this.flush()
    // }
  }

  /**
   * 启动定时批量上报
   *
   * 工作原理：
   * - 每隔 batchTimeout 毫秒执行一次 flush()
   * - 执行完后自动重新启动定时器，形成循环
   * - 避免重复启动：如果定时器已存在则不重复创建
   */
  startBatchTimer(): void {
    // 防止重复启动
    if (this.timer) return

    this.timer = window.setTimeout(() => {
      this.flush()
      // 递归调用，形成循环定时器
      this.startBatchTimer()
    }, this.config.batchTimeout!)
  }

  /**
   * 清空队列并返回待上报数据
   *
   * 实现细节：
   * - 创建队列副本，避免引用问题
   * - 立即清空原队列，允许新数据继续添加
   * - 返回副本数据供上报使用
   *
   * @returns 待上报的数据数组
   */
  flush(): any[] {
    // 队列为空时直接返回
    if (this.queue.length === 0) return []

    // 创建队列副本，避免外部修改影响内部队列
    const data = [...this.queue]
    // 清空原队列
    this.queue = []
    logger.debug('Queue flushed', { dataSize: data.length })

    return data
  }

  /**
   * 获取当前队列大小
   */
  getSize(): number {
    return this.queue.length
  }

  /**
   * 手动清空队列（不返回数据）
   */
  clear(): void {
    this.queue = []
  }

  /**
   * 销毁队列
   *
   * 清理资源：
   * 1. 清除定时器
   * 2. 清空队列数据
   */
  destroy(): void {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    // 清空队列
    this.clear()
  }
}
