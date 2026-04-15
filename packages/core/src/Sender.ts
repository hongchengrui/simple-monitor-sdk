import { MonitorConfig } from '@simple-monitor/shared'
import { logger } from '@simple-monitor/shared'

/**
 * 数据发送接口
 */
interface SendData {
  /** API 密钥 */
  apiKey: string
  /** 上报的数据列表 */
  data: unknown[]
  /** 时间戳 */
  timestamp: number
}

/**
 * 队列接口（待实现）
 */
interface IQueue {
  /** 清空队列并返回所有数据 */
  flush(): unknown[]
}

/**
 * 发送器类
 *
 * 负责将队列中的数据发送到监控服务器
 * 支持定时轮询发送和页面卸载时紧急发送
 * 失败时支持指数退避重试机制
 */
export class Sender {
  /** 监控配置 */
  private config: MonitorConfig
  /** 数据队列 */
  private queue: IQueue
  /** 重试计数器：key -> 重试次数 */
  private retryCount: Map<string, number> = new Map()
  /** 轮询定时器 */
  private pollingTimer?: ReturnType<typeof setInterval>

  /**
   * 创建发送器实例
   * @param config - 监控配置
   * @param queue - 数据队列实例
   */
  constructor(config: MonitorConfig, queue: IQueue) {
    this.config = config
    this.queue = queue
  }

  /**
   * 启动发送器
   *
   * 启动后会：
   * 1. 开启定时轮询，定期从队列取出数据并发送
   * 2. 注册页面卸载事件监听器，确保数据不丢失
   */
  start(): void {
    // TODO: 未来可改为事件驱动模式，监听队列的 flush 事件
    // 当前使用轮询方式实现
    this.startPolling()

    // 注册页面卸载时的数据上报处理
    this.setupUnloadHandler()
  }

  /**
   * 启动定时轮询
   *
   * 每秒检查一次队列，如果有数据则取出并发送
   */
  private startPolling(): void {
    // 避免重复启动
    if (this.pollingTimer) {
      return
    }

    this.pollingTimer = setInterval(() => {
      const data = this.queue.flush()

      // 仅在有数据时执行发送
      if (data.length > 0) {
        this.send(data)
      }
    }, 1000)
  }

  /**
   * 发送数据到监控服务器
   * @param data - 待发送的数据列表
   */
  private async send(data: unknown[]): Promise<void> {
    // 构造请求载荷
    const payload: SendData = {
      apiKey: this.config.apiKey,
      data,
      timestamp: Date.now(),
    }

    try {
      // 发送 HTTP 请求
      const response = await fetch(this.config.dsn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true, // 保持连接，确保页面卸载时也能发送
      })

      // 处理响应
      if (response.ok) {
        logger.info('Data sent successfully', { dataSize: data.length })
        // 发送成功，清空重试计数器
        this.retryCount.clear()
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      // 发送失败，记录错误并进入重试流程
      logger.error('Failed to send data', error)
      await this.retry(data)
    }
  }

  /**
   * 重试发送失败的请求
   *
   * 采用指数退避策略：
   * - 第1次重试：delay * 1
   * - 第2次重试：delay * 2
   * - 第3次重试：delay * 3
   *
   * @param data - 发送失败的数据
   */
  private async retry(data: unknown[]): Promise<void> {
    // 使用数据内容的哈希作为重试 key
    // 注意：这里简化实现，大数据量时可能需要优化
    const key = JSON.stringify(data)
    const count = this.retryCount.get(key) || 0

    // 检查是否超过最大重试次数
    if (count >= this.config.maxRetries!) {
      logger.error('Max retries reached, discarding data', { key })
      this.retryCount.delete(key)
      return
    }

    // 更新重试计数
    this.retryCount.set(key, count + 1)

    // 指数退避延迟重试
    const delay = this.config.retryDelay! * (count + 1)
    logger.info(`Retrying in ${delay}ms (attempt ${count + 1}/${this.config.maxRetries})`)

    setTimeout(() => {
      this.send(data)
    }, delay)
  }

  /**
   * 设置页面卸载处理器
   *
   * 在用户关闭页面、刷新页面或导航离开时：
   * 1. 立即清空队列
   * 2. 使用 sendBeacon API 发送剩余数据（不阻塞页面卸载）
   *
   * sendBeacon 优势：
   * - 异步发送，不阻塞页面关闭
   * - 即使页面已卸载也能发送完成
   * - 浏览器优先级处理
   */
  private setupUnloadHandler(): void {
    const flushData = () => {
      // 清空队列获取所有待发送数据
      const data = this.queue.flush()

      if (data.length === 0) {
        return
      }

      // 使用 sendBeacon 确保数据能发送
      if (navigator.sendBeacon) {
        const payload: SendData = {
          apiKey: this.config.apiKey,
          data,
          timestamp: Date.now(),
        }

        // sendBeacon 接受 Blob、FormData、String 等
        // 这里使用 JSON 字符串
        const result = navigator.sendBeacon(this.config.dsn, JSON.stringify(payload))

        if (!result) {
          logger.warn('sendBeacon failed to queue data')
        }
      } else {
        // 降级处理：浏览器不支持 sendBeacon
        logger.warn('sendBeacon not supported, data may be lost')
      }
    }

    // 监听页面卸载事件
    // beforeunload：传统事件，兼容性好
    // pagehide：现代推荐事件，更可靠
    window.addEventListener('beforeunload', flushData)
    window.addEventListener('pagehide', flushData)
  }

  /**
   * 停止发送器
   *
   * 清理定时器和事件监听器
   */
  stop(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
      this.pollingTimer = undefined
    }
    // TODO: 移除事件监听器需要保存 handler 引用
  }
}
