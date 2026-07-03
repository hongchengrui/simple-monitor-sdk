/**
 * Simple Monitor SDK - Browser Platform Adapter
 *
 * 浏览器端采集：包装/监听原生 API（error / 资源 / ...），
 * 经 core 的事件总线 → transform → transportData 上报。
 *
 * 本包不直接面向业务使用，由 @simple-monitor/web 聚合包转出。
 */

import type { InitOptions } from '@simple-monitor/types'
import { initCore } from '@simple-monitor/core'
import { setupReplace } from './setupReplace'

export { setupReplace } from './setupReplace'

/**
 * 初始化浏览器端监控。
 *
 * 内部依次：initCore（校验 dsn/apikey 必填 + 绑定 core 全部运行时配置）
 * → setupReplace（订阅处理器 + 装载原生采集器）。
 *
 * @param options 初始化配置，dsn 与 apikey 必填
 */
export function init(options: InitOptions = {}): void {
  initCore(options)
  setupReplace()
}

/**
 * 主动上报一条日志/错误（手动 API，对应 README 的 log）。
 * 实现位于 core（extractErrorStack + breadcrumb + transportData.send），
 * 此处转出，避免在 browser 重新声明空函数遮蔽 core 的真实现。
 */
export { log } from '@simple-monitor/core'
