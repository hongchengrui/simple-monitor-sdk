import { BaseCollector } from './BaseCollector'
import { consoleReplace, onConsole } from '@simple-monitor/shared'
import type { ConsoleTriggerData } from '@simple-monitor/shared'

export class ConsoleCollector extends BaseCollector {
  /**
   * 启动 Console 收集器
   */
  start(): void {
    // 启动 Console 拦截器
    consoleReplace()

    // 注册 Console 钩子
    const unregister = onConsole((data: ConsoleTriggerData) => {
      this.handleConsoleData(data)
    })

    // 保存取消注册函数，用于 stop()
    this.unregister = unregister
  }

  private unregister?: () => void

  /**
   * 处理 Console 监控数据
   */
  private handleConsoleData(data: ConsoleTriggerData): void {
    // 转换为标准数据格式
    const standardData = {
      type: 'console',
      level: data.level,
      args: data.args,
      sessionId: this.sessionId,
      time: Date.now(),
    }

    // 加入队列
    this.queue.add(standardData)

    // 记录面包屑（如果存在）
    if (this.breadcrumb) {
      this.breadcrumb.push({
        type: 'console',
        category: 'console',
        data: {
          level: data.level,
          message: data.args.join(' '),
        },
        level: data.level === 'error' ? 'error' : 'info',
        timestamp: Date.now(),
      })
    }
  }

  /**
   * 停止 Console 收集器
   */
  stop(): void {
    // 取消钩子注册
    if (this.unregister) {
      this.unregister()
      this.unregister = undefined
    }
  }
}
