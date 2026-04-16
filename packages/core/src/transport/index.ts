/**
 * 数据传输模块
 *
 * 提供完整的数据上报功能：
 * - 图片上报（跨域）
 * - XHR上报（同域）
 * - 上报方式自动选择
 * - 错误去重集成
 * - 上报前钩子
 *
 * @module transport
 */

// 导出上报方式枚举
export { TransportMethod } from './selectMethod'

// 导出配置类型
export type { TransportConfig } from './TransportData'

// 导出图片上报
export { imgRequest, ImgRequestOptions } from './imgRequest'

// 导出上报方式选择
export { selectTransportMethod } from './selectMethod'

// 导出数据传输类
export { TransportData, createTransportData } from './TransportData'
