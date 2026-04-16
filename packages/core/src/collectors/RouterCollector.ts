import { BaseCollector } from './BaseCollector'
import { routerReplace, onRouter } from '@simple-monitor/shared'
import type { RouterInfo } from '@simple-monitor/shared'

export class RouterCollector extends BaseCollector {
  /**
   * 启动 Router 收集器
   */
  start(): void {
    // 启动 Router 拦截器
    routerReplace()

    // 注册 Router 钩子
    const unregister = onRouter((data: RouterInfo) => {
      this.handleRouterData(data)
    })

    // 保存取消注册函数，用于 stop()
    this.unregister = unregister
  }

  private unregister?: () => void

  /**
   * 处理 Router 监控数据
   */
  private handleRouterData(data: RouterInfo): void {
    // 转换为标准数据格式
    const standardData = {
      type: 'router',
      routerType: data.type,
      from: data.from,
      to: data.to,
      sessionId: this.sessionId,
      time: Date.now(),
    }

    // 加入队列
    this.queue.add(standardData)

    // 记录面包屑（如果存在）
    if (this.breadcrumb) {
      this.breadcrumb.push({
        type: 'navigation',
        category: 'router',
        data: {
          from: data.from,
          to: data.to,
        },
        level: 'info',
        timestamp: Date.now(),
      })
    }
  }

  /**
   * 停止 Router 收集器
   */
  stop(): void {
    // 取消钩子注册
    if (this.unregister) {
      this.unregister()
      this.unregister = undefined
    }
  }
}
