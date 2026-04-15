import { BaseCollector } from './BaseCollector'
import { PerformanceTransformer } from '../transformers/PerformanceTransformer'

export class PerformanceCollector extends BaseCollector {
  private transformer: PerformanceTransformer

  constructor(config: any, queue: any, sessionId: string) {
    super(config, queue, sessionId)
    this.transformer = new PerformanceTransformer(config, sessionId)
  }

  start(): void {
    // 现有的性能监听代码
    this.collectPageTiming()
  }

  private collectPageTiming(): void {
    // 采集性能数据
    const timing = performance.getEntriesByType('navigation')[0] as any

    const rawData = {
      loadTime: timing.loadEventEnd - timing.fetchStart,
      dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
      tcpTime: timing.connectEnd - timing.connectStart,
      fp: 0, // 暂时占位
      fcp: 0, // 暂时占位
    }

    const standardData = this.transformer.transform(rawData)
    if (standardData) {
      this.queue.add(standardData)
    }
  }
}
