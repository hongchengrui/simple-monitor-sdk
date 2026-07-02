/**
 * Simple Monitor SDK - Core Module
 *
 * This package contains the core monitoring logic.
 */

import type { InitOptions } from '@simple-monitor/types'
import { logger } from '@simple-monitor/utils'
import { initOptions } from './options'

// Data transformation module
export * from './transformData'

// Data transport module
export * from './transportData'

// Breadcrumb module
export * from './breadcrumb'

// Error ID module
export * from './errorId'

// Options module
export * from './options'

// Global module
export * from './global'

// Logger module
export * from './logger'

// Subscribe module
export * from './subscribe'

// External API module
export * from './external'

/**
 * 初始化 core 运行时
 *
 * 校验必填项（dsn / apikey）后，绑定全部运行时配置：
 * 静默开关 → 面包屑 → logger → transportData → options。
 * 平台包（browser / web）的 init() 应统一调用本函数，避免直接触碰 core 内部细节。
 *
 * @param options 初始化配置，dsn 与 apikey 必填
 */
export function initCore(options: InitOptions = {}): void {
  if (!options.dsn || !options.apikey) {
    logger.error('初始化失败：dsn 与 apikey 为必填项，请在 init 中传入')
    return
  }
  initOptions(options)
}
