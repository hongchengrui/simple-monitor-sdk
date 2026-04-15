import { MonitorConfig, BreadcrumbData } from '@simple-monitor/shared'
import { logger } from '@simple-monitor/shared'

/**
 * 用户行为追踪 - 面包屑管理类
 * 用于记录用户在应用中的操作轨迹，便于问题排查和用户行为分析
 */
export class Breadcrumb {
  /** 监控配置对象 */
  private config: MonitorConfig
  /** 存储面包屑数据的数组 */
  private breadcrumbs: BreadcrumbData[] = []

  constructor(config: MonitorConfig) {
    this.config = config
  }

  /**
   * 添加面包屑记录
   * 处理流程：
   * 1. 执行 beforeAddBreadcrumb 钩子函数（如果配置）
   * 2. 如果钩子返回 null，则取消添加当前面包屑
   * 3. 如果钩子返回新数据，使用钩子返回的数据
   * 4. 将面包屑添加到数组末尾
   * 5. 检查是否超过最大数量限制，超过则移除最早的记录
   * 6. 记录调试日志
   *
   * @param data - 面包屑数据对象
   */
  push(data: BreadcrumbData): void {
    // 步骤1: 执行前置钩子函数，允许用户自定义过滤或修改面包屑数据
    if (this.config.hooks?.beforeAddBreadcrumb) {
      const result = this.config.hooks.beforeAddBreadcrumb(data)

      // 步骤2: 如果钩子返回 null，表示该面包屑应该被过滤掉
      if (result === null) {
        logger.debug('Breadcrumb filtered by hook')
        return
      }

      // 步骤3: 使用钩子函数返回的数据（可能是修改后的数据）
      data = result
    }

    // 步骤4: 将面包屑添加到数组末尾
    this.breadcrumbs.push(data)

    // 步骤5: 维护最大数量限制，超过则移除最早的记录（FIFO策略）
    if (this.breadcrumbs.length > this.config.maxBreadcrumbs!) {
      this.breadcrumbs.shift() // 移除数组第一个元素（最早的面包屑）
    }

    // 步骤6: 记录调试信息，便于开发时追踪面包屑添加情况
    logger.debug('Breadcrumb added', {
      type: data.type, // 面包屑类型（如：click、navigation、http等）
      total: this.breadcrumbs.length, // 当前面包屑总数
    })
  }

  /**
   * 获取所有面包屑记录
   * 返回当前数组的一个浅拷贝，防止外部直接修改内部数据
   *
   * @returns 面包屑数据数组的副本
   */
  getAll(): BreadcrumbData[] {
    return [...this.breadcrumbs]
  }

  /**
   * 清空所有面包屑记录
   * 将内部数组重置为空数组，释放内存
   */
  clear(): void {
    this.breadcrumbs = []
  }

  /**
   * 获取当前面包屑数量
   * 用于判断是否需要清理或检查存储状态
   *
   * @returns 当前面包屑总数
   */
  getSize(): number {
    return this.breadcrumbs.length
  }
}
