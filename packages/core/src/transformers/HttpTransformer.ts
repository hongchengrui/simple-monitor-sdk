import { BaseTransformer } from './BaseTransformer'
import { EventType, Severity, ReportData, HTTPData } from '@simple-monitor/shared'

interface RawHTTPData {
  type: 'xhr' | 'fetch'
  method: string
  url: string
  status: number
  duration: number
  traceId: string
  requestHeaders?: Record<string, string>
  responseHeaders?: Record<string, string>
}

export class HttpTransformer extends BaseTransformer {
  transform(rawData: RawHTTPData): ReportData | null {
    const data: HTTPData = {
      url: rawData.url,
      method: rawData.method,
      status: rawData.status,
      duration: rawData.duration,
      traceId: rawData.traceId,
    }

    return {
      eventId: this.generateEventId(),
      sessionId: this.sessionId,
      userId: this.config.userId,
      time: Date.now(),
      type: EventType.ERROR, // HTTP错误也归类为ERROR
      level: rawData.status >= 500 ? Severity.Error : Severity.Warning,
      data,
      ...this.getCommonContext(),
    }
  }
}
