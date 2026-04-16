/**
 * 数据传输模块
 *
 * 整合所有上报功能：
 * - 错误ID生成和去重
 * - 用户自定义钩子
 * - 数据验证
 * - 上报方式选择
 * - 数据发送
 *
 * @module TransportData
 */

import { logger } from '@simple-monitor/shared'
import { isReportDataType, type FinalReportType, type ReportDataType } from '@simple-monitor/shared'
import { createErrorId, setMaxDuplicateCount } from '@simple-monitor/shared'
import { selectTransportMethod, TransportMethod } from './selectMethod'
import { imgRequest } from './imgRequest'

/**
 * 上报配置
 */
export interface TransportConfig {
  /** API密钥 */
  apiKey: string
  /** 上报URL */
  url: string
  /** 最大重复上报次数 */
  maxDuplicateCount?: number
  /** 用户自定义上报前钩子 */
  beforeDataReport?: (data: FinalReportType) => boolean | Promise<boolean>
  /** 手动指定上报方式 */
  method?: TransportMethod
}

/**
 * 数据传输类
 *
 * 负责数据上报前的所有处理和发送
 */
export class TransportData {
  /** 配置 */
  private config: TransportConfig

  constructor(config: TransportConfig) {
    this.config = config

    // 设置最大重复次数（如果用户配置了）
    if (config.maxDuplicateCount) {
      setMaxDuplicateCount(config.maxDuplicateCount)
    }
  }

  /**
   * 发送数据（主入口）
   *
   * @param data 待上报数据
   * @returns Promise<void>
   */
  async send(data: FinalReportType): Promise<void> {
    try {
      // 1️⃣ 执行上报前处理
      const shouldContinue = await this.beforePost(data)

      if (!shouldContinue) {
        return // 中断上报
      }

      // 2️⃣ 选择上报方式
      const method = this.selectMethod()

      // 3️⃣ 根据方式发送
      await this.sendData(data, method)
    } catch (error) {
      logger.error('[TransportData] 发送失败:', error)
      throw error // 抛出错误，让上层处理重试
    }
  }

  /**
   * 上报前数据处理
   *
   * 执行顺序：
   * 1. 错误ID生成和去重
   * 2. 用户自定义钩子
   * 3. 数据验证
   *
   * @param data 待上报数据
   * @returns Promise<boolean> true=继续上报, false=中断上报
   */
  private async beforePost(data: FinalReportType): Promise<boolean> {
    // 1️⃣ 错误ID生成和去重
    if (isReportDataType(data)) {
      const errorId = createErrorId(data as ReportDataType, this.config.apiKey)

      if (!errorId) {
        logger.info('[TransportData] 错误已超过最大重复次数，跳过上报')
        return false // ❌ 超过重复限制，中断上报
      }

      ;(data as ReportDataType).errorId = errorId
      logger.debug(`[TransportData] 生成错误ID: ${errorId}`)
    }

    // 2️⃣ 用户自定义钩子
    if (this.config.beforeDataReport) {
      try {
        const shouldContinue = await this.config.beforeDataReport(data)

        if (shouldContinue === false) {
          logger.info('[TransportData] 用户钩子中断上报')
          return false // ❌ 用户钩子中断上报
        }
      } catch (error) {
        logger.error('[TransportData] beforeDataReport 钩子执行失败:', error)
        // ⚠️ 钩子执行失败不中断上报，只记录错误
      }
    }

    // 3️⃣ 数据验证
    if (!this.validateData(data)) {
      logger.error('[TransportData] 数据验证失败')
      return false // ❌ 数据验证失败
    }

    return true // ✅ 所有检查通过，继续上报
  }

  /**
   * 数据验证
   *
   * @param data 待验证数据
   * @returns 是否验证通过
   */
  private validateData(data: FinalReportType): boolean {
    // 基础验证：确保数据对象存在
    if (!data || typeof data !== 'object') {
      logger.warn('[TransportData] 数据不是有效对象')
      return false
    }

    // 根据数据类型验证必需字段
    if (isReportDataType(data)) {
      // 错误数据必须有 type 和 level
      if (!data.type || !data.level) {
        logger.warn('[TransportData] 错误数据缺少必需字段: type 或 level')
        return false
      }
    } else {
      // 埋点数据必须有 actionType
      if (!data.actionType) {
        logger.warn('[TransportData] 埋点数据缺少必需字段: actionType')
        return false
      }
    }

    return true
  }

  /**
   * 选择上报方式
   *
   * @returns 上报方式
   */
  private selectMethod(): TransportMethod {
    return selectTransportMethod({
      method: this.config.method,
      url: this.config.url,
    })
  }

  /**
   * 根据方式发送数据
   *
   * @param data 待上报数据
   * @param method 上报方式
   * @returns Promise<void>
   */
  private async sendData(data: FinalReportType, method: TransportMethod): Promise<void> {
    if (method === TransportMethod.IMAGE) {
      // 图片上报（跨域场景）
      imgRequest(data, {
        apiKey: this.config.apiKey,
        url: this.config.url,
      })
    } else {
      // XHR 上报（同域场景）
      await this.xhrRequest(data)
    }
  }

  /**
   * XHR/Fetch 上报
   *
   * 使用 fetch API 发送数据
   * 优点：可以携带请求头，支持大数据量
   * 缺点：跨域会失败
   *
   * @param data 待上报数据
   * @returns Promise<void>
   */
  private async xhrRequest(data: FinalReportType): Promise<void> {
    try {
      const payload = {
        apiKey: this.config.apiKey,
        data,
        timestamp: Date.now(),
      }

      logger.debug('[TransportData] XHR上报数据:', payload)

      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true, // 保持连接，确保页面卸载时也能发送
      })

      if (response.ok) {
        logger.debug('[TransportData] XHR上报成功')
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      logger.error('[TransportData] XHR上报失败:', error)
      throw error // 抛出错误，让上层处理重试
    }
  }
}

/**
 * 创建数据传输实例
 *
 * @param config 上报配置
 * @returns TransportData 实例
 *
 * @example
 * const transport = createTransportData({
 *   apiKey: 'xxx',
 *   url: 'https://monitor.com/report',
 *   maxDuplicateCount: 3,
 *   beforeDataReport: (data) => {
 *     // 自定义处理
 *     data.customField = 'value'
 *     return true
 *   }
 * })
 *
 * await transport.send(errorData)
 */
export function createTransportData(config: TransportConfig): TransportData {
  return new TransportData(config)
}
