import { BaseTransformer } from './BaseTransformer'
import { EventType, Severity, ErrorType, ReportData, ErrorData } from '@simple-monitor/shared'

/**
 * 原始错误数据接口
 *
 * @description
 * 定义了从各种错误捕获点收集到的原始错误数据结构。
 * 支持多种错误类型的统一处理。
 *
 * 错误来源：
 * 1. window.onerror - JavaScript 运行时错误
 * 2. window.onunhandledrejection - Promise 未捕获异常
 * 3. window.addEventListener('error') - 资源加载错误
 * 4. Vue/React 错误边界 - 框架层错误
 *
 * @property errorType - 错误类型枚举（JS错误、资源加载错误、Promise错误等）
 * @property message - 错误信息，必填
 * @property filename - 错误发生的文件路径（JS错误专用）
 * @property lineno - 错误发生的行号（JS错误专用）
 * @property colno - 错误发生的列号（JS错误专用）
 * @property stack - 错误堆栈信息，用于追踪调用链
 * @property errorName - 错误名称（如 "ReferenceError"、"TypeError"）
 * @property resourceUrl - 加载失败的资源URL（资源错误专用）
 * @property resourceType - 加载失败的资源类型（script、stylesheet、image等）
 */
interface RawErrorData {
  errorType: ErrorType
  message: string
  filename?: string
  lineno?: number
  colno?: number
  stack?: string
  errorName?: string
  resourceUrl?: string
  resourceType?: string
}

/**
 * 错误数据转换器
 *
 * @description
 * 负责将各种类型的原始错误数据转换为统一的 ReportData 标准格式。
 * 是监控 SDK 中错误追踪的核心组件。
 *
 * 核心职责：
 * 1. 统一处理不同来源的错误（JS错误、资源错误、Promise错误）
 * 2. 提取和规范化错误关键信息
 * 3. 组装完整的错误上报数据
 * 4. 过滤无效的错误数据
 *
 * 设计思路：
 * - 通过 RawErrorData 接口统一不同错误的输入格式
 * - 必填字段校验（message）防止无效数据上报
 * - 保留所有可选字段以支持不同错误的特性
 * - 设置固定的错误级别（Severity.Error）
 *
 * @extends BaseTransformer<RawErrorData>
 */
export class ErrorTransformer extends BaseTransformer<RawErrorData> {
  /**
   * 转换错误数据为标准上报格式
   *
   * @description
   * 将原始错误数据转换为符合 ReportData 接口的标准格式。
   *
   * 转换流程：
   * 1. **数据验证**：检查必填字段（message），无效则返回 null
   * 2. **提取核心数据**：组装 ErrorData 对象
   * 3. **生成事件标识**：调用父类方法生成唯一 eventId
   * 4. **组装上报数据**：结合配置、会话、时间戳等信息
   * 5. **附加环境信息**：合并通用上下文（URL、UA等）
   *
   * 数据结构映射：
   * - 原始数据 → ErrorData：直接映射错误详情
   * - 配置对象 → ReportData：提取 userId、appId 等
   * - 父类方法 → ReportData：生成 eventId、context
   *
   * @param rawData - 原始错误数据
   * @returns 标准化的上报数据，如果数据无效则返回 null
   */
  transform(rawData: RawErrorData): ReportData | null {
    // 数据验证：错误信息为必填项
    if (!rawData.message) return null

    // 提取错误核心数据
    const data: ErrorData = {
      message: rawData.message,
      stack: rawData.stack,
      filename: rawData.filename,
      lineno: rawData.lineno,
      colno: rawData.colno,
      errorName: rawData.errorName,
      resourceUrl: rawData.resourceUrl,
      resourceType: rawData.resourceType,
    }

    // 组装完整的上报数据
    return {
      eventId: this.generateEventId(), // 生成唯一事件ID
      sessionId: this.sessionId, // 当前会话ID
      userId: this.config.userId, // 用户ID（从配置中获取）
      time: Date.now(), // 当前时间戳
      type: EventType.ERROR, // 事件类型：错误
      errorType: rawData.errorType, // 具体错误类型
      level: Severity.Error, // 错误级别：固定为 Error
      data, // 错误详情数据
      ...this.getCommonContext(), // 合并环境上下文信息
    }
  }
}
