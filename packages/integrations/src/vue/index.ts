import { Monitor } from '@simple-monitor/core'
import { MonitorConfig, logger } from '@simple-monitor/shared'
import type { App, ComponentPublicInstance } from 'vue'

export const MonitorPlugin = {
  install(app: App, config: MonitorConfig) {
    logger.info('Installing simple-monitor-sdk Vue plugin')

    const monitor = new Monitor(config)
    monitor.init()

    // Vue 错误处理
    app.config.errorHandler = (
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ) => {
      monitor.log({
        type: 'vue_error',
        error: err,
        componentName:
          (instance as unknown as { $options?: { name?: string } })?.$options?.name || '',
        info,
      })

      // 保留控制台输出
      if (!config.silent?.error) {
        console.error('Vue error:', err)
      }
    }

    // 提供给组件使用
    app.provide('monitor', monitor)

    // 添加全局属性
    app.config.globalProperties.$monitor = monitor

    logger.info('Vue plugin installed')
  },
}
/**
 * 组合式 API Hook
 */
export function useMonitor() {
  return {
    log: () => {
      // 这里需要从上下文获取 monitor 实例
      // 实际使用时需要在组件中通过 inject 获取
      console.warn('useMonitor should be used with inject')
    },
  }
}
