import { BaseTransformer } from './BaseTransformer'
import { EventType, Severity, ReportData, PerformanceData } from '@simple-monitor/shared'

/**
 * 原始性能数据接口
 */
interface RawPerformanceData {
  loadTime?: number
  dnsTime?: number
  tcpTime?: number
  requestTime?: number
  domTime?: number
  fp?: number
  fcp?: number
  lcp?: number
  fid?: number
  cls?: number
}

export class PerformanceTransformer extends BaseTransformer<RawPerformanceData> {
  transform(rawData: RawPerformanceData): ReportData | null {
    const data: PerformanceData = {
      loadTime: rawData.loadTime,
      dnsTime: rawData.dnsTime,
      tcpTime: rawData.tcpTime,
      fp: rawData.fp,
      fcp: rawData.fcp,
      lcp: rawData.lcp,
      fid: rawData.fid,
      cls: rawData.cls,
    }
    return {
      eventId: this.generateEventId(),
      sessionId: this.sessionId,
      userId: this.config.userId,
      time: Date.now(),
      type: EventType.PERFORMANCE,
      level: Severity.Info,
      data,
      ...this.getCommonContext(),
    }
  }
}
