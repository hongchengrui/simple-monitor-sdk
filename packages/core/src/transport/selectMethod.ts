/**
 * 上报方式选择模块
 *
 * 负责根据场景自动选择最佳的上报方式
 * - 同域：使用 XHR（支持大数据，可携带请求头）
 * - 跨域：使用图片上报（避免 CORS 限制）
 *
 * @module selectMethod
 */

import { logger } from '@simple-monitor/shared'

/**
 * 上报方式枚举
 */
export enum TransportMethod {
  /** XHR/Fetch 上报（同域） */
  XHR = 'xhr',
  /** 图片上报（跨域） */
  IMAGE = 'image',
}

/**
 * 上报方式选择配置
 */
export interface SelectOptions {
  /** 用户手动指定的上报方式 */
  method?: TransportMethod
  /** 上报URL */
  url: string
}

/**
 * 判断是否为跨域请求
 *
 * 对比目标URL和当前页面的：
 * - 协议（http/https）
 * - 域名（example.com vs monitor.com）
 * - 端口（8080 vs 3000）
 *
 * 任一不同即为跨域
 *
 * @param url 目标URL
 * @returns 是否跨域
 *
 * @example
 * isCrossOrigin('https://monitor.com/report')
 * // 返回: true（假设当前页面是 example.com）
 *
 * isCrossOrigin('/api/report')
 * // 返回: false（相对路径，同域）
 */
function isCrossOrigin(url: string): boolean {
  try {
    // 1. 解析目标URL
    // 第二个参数是 base，用于解析相对路径
    const targetUrl = new URL(url, window.location.href)

    // 2. 获取当前页面信息
    const currentUrl = window.location

    // 3. 对比三个部分
    const protocolDiffers = targetUrl.protocol !== currentUrl.protocol
    const hostnameDiffers = targetUrl.hostname !== currentUrl.hostname
    const portDiffers = targetUrl.port !== currentUrl.port

    // 4. 任一不同即为跨域
    const isCross = protocolDiffers || hostnameDiffers || portDiffers

    logger.debug(`[SelectMethod] 跨域检测:`, {
      target: targetUrl.href,
      current: currentUrl.href,
      isCross,
      reason: protocolDiffers
        ? '协议不同'
        : hostnameDiffers
          ? '域名不同'
          : portDiffers
            ? '端口不同'
            : '同域',
    })

    return isCross
  } catch (error) {
    // URL 解析失败（如格式错误），保守处理：认为是跨域
    logger.warn('[SelectMethod] URL 解析失败，保守处理为跨域:', error)
    return true
  }
}

/**
 * 选择上报方式
 *
 * 优先级：
 * 1. 用户手动指定 > 自动判断
 * 2. 跨域用图片 > 同域用XHR
 *
 * @param options 选择配置
 * @returns 上报方式
 *
 * @example
 * // 场景1：用户手动指定
 * selectTransportMethod({ method: TransportMethod.IMAGE, url: '...' })
 * // 返回: TransportMethod.IMAGE
 *
 * // 场景2：自动判断跨域
 * selectTransportMethod({ url: 'https://monitor.com/report' })
 * // 返回: TransportMethod.IMAGE（跨域）
 *
 * // 场景3：自动判断同域
 * selectTransportMethod({ url: '/api/report' })
 * // 返回: TransportMethod.XHR（同域）
 */
export function selectTransportMethod(options: SelectOptions): TransportMethod {
  // 1. 用户手动指定了方式？
  if (options.method) {
    logger.debug(`[SelectMethod] 使用用户指定的方式: ${options.method}`)
    return options.method
  }

  // 2. 自动判断：是否跨域？
  if (isCrossOrigin(options.url)) {
    logger.debug('[SelectMethod] 检测到跨域，使用图片上报')
    return TransportMethod.IMAGE
  }

  // 3. 默认使用 XHR
  logger.debug('[SelectMethod] 同域请求，使用 XHR 上报')
  return TransportMethod.XHR
}
