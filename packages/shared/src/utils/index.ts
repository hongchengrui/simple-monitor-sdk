/**
 * 工具函数统一导出
 * 按职责分层：基础工具 → 数据转换 → 浏览器操作 → 拦截器 → 错误处理 → 通用工具
 * 采用直接调用模式，移除事件系统以提升性能
 */

// 🔵 基础工具层（纯函数）
export * from './base'

// 🟢 数据转换层（纯函数）
export * from './transform'

// 🔴 浏览器操作层（有副作用）
export * from './browser'

// 🟡 拦截器层（有副作用）
export * from './intercept'

// 🟣 错误处理层
export * from './error'

// 🟠 通用工具层
export * from './common'
