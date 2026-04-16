/**
 * HTTP数据转换工具
 */
import type { MonitorHttp } from '../../../types'
export function transformXhrData(xhr: XMLHttpRequest & { monitor_xhr?: MonitorHttp }): any {
  return {
    type: 'xhr',
    method: xhr.monitor_xhr?.method,
    url: xhr.monitor_xhr?.url,
    status: xhr.status,
    elapsedTime: xhr.monitor_xhr?.elapsedTime,
  }
}
