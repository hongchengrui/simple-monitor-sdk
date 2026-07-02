/**
 * Simple Monitor SDK - Web Integration Bundle
 *
 * 面向业务的聚合入口：把 browser 采集与（未来）web-performance、
 * Vue/React 适配统一暴露成一个 init()。
 * 业务方只需 `import { init, log } from '@simple-monitor/web'`。
 */

import type { InitOptions } from '@simple-monitor/types'
import { logger, getGlobal } from '@simple-monitor/utils'
import { init as initBrowser } from '@simple-monitor/browser'

// 转出手动 API 与类型
export { log } from '@simple-monitor/browser'
export type { InitOptions } from '@simple-monitor/types'

const _global = getGlobal<any>()

// 防重复初始化标记位：HMR / StrictMode 下 init 可能被多次调用
const INIT_FLAG = '__Monitor__init__'

/**
 * 初始化 Web 监控。
 *
 * - 幂等：已初始化过则告警并跳过，避免重复打补丁。
 * - 透传配置给 browser.init（内部再走 core.initCore）。
 *
 * @param options dsn / apikey 必填
 */
export function init(options: InitOptions = {}): void {
  if (_global[INIT_FLAG]) {
    logger.warn('Simple Monitor 已初始化，请勿重复调用 init()')
    return
  }
  _global[INIT_FLAG] = true
  initBrowser(options)
}
