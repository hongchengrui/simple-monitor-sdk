import { BaseTransformer } from './BaseTransformer'
import { EventType, Severity, ReportData, BehaviorData } from '@simple-monitor/shared'

export class BehaviorTransformer extends BaseTransformer {
  transform(rawData: any): ReportData | null {
    const data: BehaviorData = {
      action: rawData.action,
      element: rawData.element,
      route: rawData.route,
    }

    return {
      eventId: this.generateEventId(),
      sessionId: this.sessionId,
      userId: this.config.userId,
      time: Date.now(),
      type: EventType.BEHAVIOR,
      level: Severity.Info,
      data,
      ...this.getCommonContext(),
    }
  }
}
