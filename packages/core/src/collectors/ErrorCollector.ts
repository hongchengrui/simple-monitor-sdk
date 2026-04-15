import { BaseCollector } from './BaseCollector'
import { ErrorTransformer } from '../transformers/ErrorTransformer'
import { ErrorType } from '@simple-monitor/shared'

export class ErrorCollector extends BaseCollector {
  private transformer: ErrorTransformer

  constructor(config: any, queue: any, sessionId: string, breadcrumb?: any) {
    super(config, queue, sessionId, breadcrumb)
    this.transformer = new ErrorTransformer(config, sessionId)
  }

  start(): void {
    window.addEventListener('error', (event) => this.handleError(event))
    window.addEventListener('unhandledrejection', (event) => this.handlePromiseRejection(event))
  }

  private handleError(event: ErrorEvent): void {
    if (this.config.silent?.error) return

    // 判断是否是资源加载错误
    if (event.target !== window) {
      this.handleResourceError(event.target as HTMLElement)
      return
    }

    // 收集原始数据
    const rawData = {
      errorType: ErrorType.JAVASCRIPT_ERROR,
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    }

    // 使用 Transformer 转换
    const standardData = this.transformer.transform(rawData)
    if (!standardData) return

    // 加入队列
    this.queue.add(standardData)

    // 记录面包屑
    if (this.breadcrumb) {
      this.breadcrumb.push({
        type: 'error',
        category: 'exception',
        data: { message: event.message },
        level: 'error',
        time: Date.now(),
      })
    }
  }

  private handleResourceError(target: HTMLElement): void {
    const tagName = target.tagName.toLowerCase()
    const src = (target as any).src || (target as any).href

    const rawData = {
      errorType: ErrorType.RESOURCE_ERROR,
      message: `${tagName}加载失败: ${src}`,
      resourceUrl: src,
      resourceType: tagName,
    }

    const standardData = this.transformer.transform(rawData)
    if (!standardData) return

    this.queue.add(standardData)
  }

  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    if (this.config.silent?.unhandledrejection) return

    const rawData = {
      errorType: ErrorType.PROMISE_ERROR,
      message: String(event.reason),
      stack: event.reason?.stack,
    }

    const standardData = this.transformer.transform(rawData)
    if (!standardData) return

    this.queue.add(standardData)

    if (this.breadcrumb) {
      this.breadcrumb.push({
        type: 'promise',
        category: 'exception',
        data: { reason: String(event.reason) },
        level: 'error',
        time: Date.now(),
      })
    }
  }
}
