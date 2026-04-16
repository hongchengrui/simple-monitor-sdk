import { BaseCollector } from './BaseCollector'
import { xhrReplace, fetchReplace, setHttpReportCallback, setSdkApiWhitelist } from '@simple-monitor/shared'
import type { HTTPMonitorData } from '@simple-monitor/shared'

export class HTTPCollector extends BaseCollector {
  /**
   * 启动 HTTP 收集器
   */
  start(): void {
    // 设置 SDK 上报接口白名单，防止死循环
    if (this.config.dsn) {
      setSdkApiWhitelist([this.config.dsn])
    }

    // 设置自定义上报回调
    setHttpReportCallback((data: HTTPMonitorData) => {
      this.handleHTTPData(data)
    })

    // 启动 HTTP 拦截器
    xhrReplace()
    fetchReplace()
  }

  /**
   * 处理 HTTP 监控数据
   */
  private handleHTTPData(data: HTTPMonitorData): void {
    // 转换为标准数据格式
    const standardData = {
      type: 'http',
      httpType: data.type,
      method: data.method,
      url: data.url,
      status: data.status,
      statusText: data.statusText,
      elapsedTime: data.elapsedTime,
      traceId: data.traceId,
      request: data.request,
      response: data.response,
      sessionId: this.sessionId,
      time: Date.now(),
    }

    // 加入队列
    this.queue.add(standardData)

    // 记录面包屑（如果存在）
    if (this.breadcrumb) {
      this.breadcrumb.push({
        type: 'http',
        category: 'http',
        data: {
          method: data.method,
          url: data.url,
          status: data.status,
        },
        level: data.status >= 400 ? 'error' : 'info',
        timestamp: Date.now(),
      })
    }
  }

  /**
   * 停止 HTTP 收集器
   */
  stop(): void {
    // HTTP 拦截器一旦启动，无法停止
    // 因为它们重写了原生 API，无法还原
    // 这里只是保留接口以符合 BaseCollector 规范
  }
}
