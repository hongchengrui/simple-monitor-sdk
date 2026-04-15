import { MonitorConfig } from '@simple-monitor/shared'
import { ReportData } from '@simple-monitor/shared'

/**
 * 数据转换器基类
 *
 * @description
 * 负责将各类原始监控数据转换为统一的 ReportData 标准格式。
 * 是所有转换器（HttpTransformer、ErrorTransformer 等）的抽象基类。
 *
 * 核心职责：
 * 1. 定义统一的数据转换接口
 * 2. 提供公共的配置管理和会话追踪
 * 3. 生成唯一的事件标识符
 * 4. 收集通用的环境上下文信息
 *
 * 设计思路：
 * - 使用抽象类确保子类实现 transform 方法
 * - 使用泛型 <T> 支持不同类型的原始数据输入
 * - 提供通用工具方法减少子类重复代码
 *
 * @template T - 原始数据的类型（子类可具体化）
 */
export abstract class BaseTransformer<T = unknown> {
  /**
   * 监控配置对象
   * @protected
   */
  protected config: MonitorConfig

  /**
   * 当前会话的唯一标识符
   * @protected
   */
  protected sessionId: string

  /**
   * 构造函数
   *
   * @param config - 监控配置，包含应用ID、上报地址等
   * @param sessionId - 会话ID，用于关联同一会话内的所有事件
   */
  constructor(config: MonitorConfig, sessionId: string) {
    this.config = config
    this.sessionId = sessionId
  }

  /**
   * 抽象方法：数据转换
   *
   * @description
   * 子类必须实现此方法，将特定类型的原始数据转换为标准的 ReportData 格式。
   *
   * 转换流程：
   * 1. 验证输入数据的有效性
   * 2. 提取关键信息（时间、类型、内容等）
   * 3. 生成唯一的事件ID
   * 4. 组装通用的上下文信息
   * 5. 返回标准化的 ReportData 对象
   *
   * @param rawData - 原始数据，具体类型由子类的泛型参数决定
   * @returns 标准化的上报数据，如果数据无效则返回 null
   */
  abstract transform(rawData: T): ReportData | null

  /**
   * 生成唯一的事件ID
   *
   * @description
   * 为每个监控事件生成全局唯一的标识符，用于：
   * - 去重：防止重复上报同一事件
   * - 追踪：在服务端关联和分析事件
   * - 调试：定位问题事件
   *
   * 生成规则：{时间戳}-{随机字符串}
   * - 时间戳：确保时间上的唯一性和排序性
   * - 随机字符串：防止同一毫秒内的冲突
   *
   * @returns 格式为 "1234567890-abc123def" 的唯一ID
   */
  protected generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 获取通用的环境上下文信息
   *
   * @description
   * 收集所有监控事件都需要的公共环境信息，帮助在服务端：
   * - 复现问题：了解用户发生问题时的环境
   * - 分析模式：发现特定环境下的规律性问题
   * - 用户画像：了解用户群体的设备/浏览器分布
   *
   * 收集的信息：
   * - url: 当前页面地址，用于定位问题发生的具体页面
   * - userAgent: 浏览器标识，用于判断浏览器类型和版本
   * - screen: 屏幕分辨率，用于了解用户的设备类型
   * - viewport: 浏览器可视窗口大小，用于了解用户的浏览环境
   *
   * 环境兼容性：
   * - 使用 typeof 检查确保在 SSR/Node.js 环境中不会报错
   * - 对于不存在的环境返回 undefined 或空字符串
   *
   * @returns 包含环境信息的对象
   */
  protected getCommonContext() {
    return {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screen: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : undefined,
      viewport:
        typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : undefined,
    }
  }
}
