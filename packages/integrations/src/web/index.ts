import { Monitor } from '@simple-monitor/core'
import { MonitorConfig, logger } from '@simple-monitor/shared'

let monitorInstance: Monitor | null = null

/**
 * 初始化监控
 */
export function init(config: MonitorConfig): Monitor {
  if (monitorInstance) {
    logger.warn('Monitor already initialized')
    return monitorInstance
  }

  logger.info('Initializing simple-monitor-sdk')

  monitorInstance = new Monitor(config)
  monitorInstance.init()

  return monitorInstance
}

/**
 * 手动上报
 */
export function log(data: any): void {
  if (!monitorInstance) {
    logger.warn('Monitor not initialized')
    return
  }
  monitorInstance.log(data)
}

/**
 * 获取面包屑
 */
export function getBreadcrumbs() {
  if (!monitorInstance) {
    logger.warn('Monitor not initialized')
    return []
  }
  return monitorInstance.getBreadcrumbs()
}
