/**
 * 图片上报模块
 *
 * 使用 Image 对象进行数据上报，适用于跨域场景
 *
 * @module imgRequest
 */

import { logger } from '@simple-monitor/shared'

/**
 * 图片上报配置
 */
export interface ImgRequestOptions {
  /** API密钥 */
  apiKey: string
  /** 上报地址 */
  url: string
}

/**
 * 图片上报
 *
 * 使用 Image 对象上报数据，优点是支持跨域请求
 * 适用于跨域场景或简单的数据上报
 *
 * @param data - 要上报的数据
 * @param options - 上报配置
 *
 * @example
 * imgRequest(
 *   { type: 'error', message: 'Test error' },
 *   { apiKey: 'xxx', url: 'https://monitor.com/report' }
 * )
 */
export function imgRequest(data: unknown, options: ImgRequestOptions): void {
  try {
    // 1. 准备查询参数
    const params = {
      apiKey: options.apiKey,
      data: JSON.stringify(data),
      timestamp: Date.now().toString(),
    }

    // 2. 转换为查询字符串
    const queryString = new URLSearchParams(params).toString()

    // 3. 拼接完整URL
    const reportUrl = `${options.url}?${queryString}`

    // 4. 创建图片对象
    const img = new Image()

    // 5. 设置成功回调（用于调试）
    img.onload = () => {
      logger.debug('[ImgRequest] 图片上报成功')
    }

    // 6. 设置失败回调
    img.onerror = () => {
      logger.error('[ImgRequest] 图片上报失败')
    }

    // 7. 触发请求（设置 src 就会立即发送）
    img.src = reportUrl

    logger.debug('[ImgRequest] 图片上报已触发:', reportUrl)
  } catch (error) {
    // 捕获任何异常（如 URL 构造失败、序列化失败等）
    logger.error('[ImgRequest] 图片上报异常:', error)
  }
}
