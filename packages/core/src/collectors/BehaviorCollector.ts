import { BaseCollector } from './BaseCollector'
import { BehaviorTransformer } from '../transformers/BehaviorTransformer'
import { EventType, Severity } from '@simple-monitor/shared'
import { logger } from '@simple-monitor/shared'

/**
 * 行为收集器
 */
export class BehaviorCollector extends BaseCollector {
  private transformer: BehaviorTransformer

  constructor(config: any, queue: any, sessionId: string) {
    super(config, queue, sessionId)
    this.transformer = new BehaviorTransformer(config, sessionId)
  }
  /** 保存原始的 history.pushState 方法，用于停止监听时恢复 */
  private originalPush: History['pushState'] | null = null
  /** 保存原始的 history.replaceState 方法，用于停止监听时恢复 */
  private originalReplace: History['replaceState'] | null = null
  /** 上一次的路由URL，用于防止重复记录 */
  private lastRoute: string = ''

  /**
   * 启动行为收集器
   *
   * 根据配置初始化各种行为监听器：
   * - 如果 `config.silent.dom` 未设置，初始化点击事件监听
   * - 如果 `config.silent.history` 未设置，初始化路由变化监听
   *
   * @remarks
   * 使用 silent 配置可以灵活控制是否收集特定类型的行为数据。
   * 例如，在隐私敏感的场景下可以禁用 DOM 事件收集。
   */
  start(): void {
    // 监听 DOM 交互事件（如点击）
    if (!this.config.silent?.dom) {
      this.initClickListener()
    }

    // 监听路由变化事件
    if (!this.config.silent?.history) {
      this.initHistoryListener()
    }

    logger.debug('BehaviorCollector started')
  }

  /**
   * 初始化点击事件监听器
   *
   * 使用捕获阶段监听所有点击事件，收集被点击元素的信息。
   * 支持通过配置采样率来减少收集的数据量。
   *
   * @remarks
   * 使用捕获阶段（capture: true）确保能在事件冒泡前捕获点击，
   * 即使事件被后续阻止冒泡也能记录到。
   *
   * 采集的数据包括：
   * - tagName: 元素标签名（如 button、div）
   * - id: 元素 ID（如果有）
   * - className: 元素类名
   * - text: 元素文本内容（最多 50 字符）
   *
   * 数据会被添加到两个地方：
   * 1. 上报队列：用于发送到监控服务器
   * 2. 面包屑：用于在错误发生时复现场景
   */
  private initClickListener(): void {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target as HTMLElement

        // 检查采样率 - 如果配置了采样率，则按概率决定是否收集
        // 这有助于减少数据量，特别是在高流量场景下
        if (this.config.sampleRate?.behavior) {
          const shouldCollect = Math.random() < this.config.sampleRate.behavior
          if (!shouldCollect) {
            return
          }
        }

        // 构造点击事件数据
        const clickData = {
          type: EventType.BEHAVIOR,
          level: Severity.Info,
          data: {
            action: 'click',
            tagName: target.tagName.toLowerCase(),
            id: target.id,
            className: target.className,
            text: target.textContent?.substring(0, 50), // 限制文本长度避免数据过大
          },
        }

        // 添加到上报队列，用于发送到服务器
        this.queue.add(clickData)

        // 添加到面包屑，用于错误场景复现
        if (this.breadcrumb) {
          this.breadcrumb.push({
            type: 'click',
            category: 'user',
            data: clickData.data,
            level: Severity.Info,
            time: Date.now(),
          })
        }
      },
      true // 使用捕获阶段，确保能捕获所有点击事件
    )
  }

  /**
   * 初始化路由变化监听器
   *
   * 通过重写 History API 和监听路由相关事件来捕获路由变化。
   * 支持 SPA（单页应用）的各种路由模式，包括 History 模式和 Hash 模式。
   *
   * @remarks
   * 监听的路由变化方式：
   * 1. **pushState** - 调用 history.pushState() 时
   * 2. **replaceState** - 调用 history.replaceState() 时
   * 3. **popstate** - 用户点击浏览器前进/后退按钮时
   * 4. **hashchange** - URL 的 hash 部分发生变化时
   *
   * @warning
   * 重写原生 API 可能会影响其他依赖这些方法的代码。
   * 在 stop() 方法中会恢复原始方法。
   */
  private initHistoryListener(): void {
    // 保存原始方法引用，用于后续恢复
    const originalPush = history.pushState
    const originalReplace = history.replaceState
    this.originalPush = originalPush
    this.originalReplace = originalReplace

    // 重写 history.pushState
    // 当应用调用此方法改变路由时（如 React Router 的 navigate），我们也能捕获到
    history.pushState = (...args) => {
      originalPush.apply(history, args) // 先执行原始方法
      this.handleRouteChange() // 再处理路由变化
    }

    // 重写 history.replaceState
    // 用于替换当前历史记录条目，同样需要监听
    history.replaceState = (...args) => {
      originalReplace.apply(history, args)
      this.handleRouteChange()
    }

    // 监听 popstate 事件
    // 当用户点击浏览器的前进/后退按钮时触发
    window.addEventListener('popstate', () => {
      this.handleRouteChange()
    })

    // 监听 hashchange 事件
    // 当 URL 的 hash 部分（# 后面的内容）发生变化时触发
    // 用于支持 Hash 路由模式的应用
    window.addEventListener('hashchange', () => {
      this.handleRouteChange()
    })
  }

  /**
   * 处理路由变化事件
   *
   * 当检测到路由变化时，记录路由跳转信息。
   * 包括来源页面和目标页面，用于分析用户导航路径。
   *
   * @remarks
   * 采集的数据：
   * - from: 来源页面 URL（通过 document.referrer 获取，可能为空）
   * - to: 目标页面 URL（通过 window.location.href 获取）
   *
   * 路由数据会被添加到：
   * 1. 上报队列：用于发送到监控服务器分析
   * 2. 面包屑：用于在错误发生时了解用户的导航路径
   *
   * @example
   * 用户从 /home 点击导航跳转到 /about 时：
   * ```json
   * {
   *   "action": "route_change",
   *   "from": "https://example.com/home",
   *   "to": "https://example.com/about"
   * }
   * ```
   */
  private handleRouteChange(): void {
    // 获取当前路由
    const currentRoute = window.location.href

    // 防止重复记录相同的路由变化
    if (this.lastRoute === currentRoute) {
      logger.debug('Duplicate route change detected, skipping', { route: currentRoute })
      return
    }

    // 更新上一次的路由
    this.lastRoute = currentRoute

    // 构造路由变化数据
    const routeData = {
      type: EventType.BEHAVIOR,
      level: Severity.Info,
      data: {
        action: 'route_change',
        from: document.referrer || '', // document.referrer 可能获取不到 pushState 的来源
        to: currentRoute, // 当前页面的完整 URL
      },
    }

    // 添加到上报队列
    this.queue.add(routeData)

    // 添加到面包屑导航记录
    if (this.breadcrumb) {
      this.breadcrumb.push({
        type: 'navigation',
        category: 'navigation', // 导航类别的面包屑
        data: routeData.data,
        level: Severity.Info,
        time: Date.now(),
      })
    }

    logger.info('Route change captured', routeData)
  }

  /**
   * 停止行为收集器
   *
   * 恢复被重写的原生 API，清理监听器。
   * 停止后不再收集新的行为数据。
   *
   * @remarks
   * 注意：DOM 事件监听器（click）在此方法中没有显式移除。
   * 如果需要完全清理，建议在停止前先移除事件监听器，
   * 或者通过重新加载页面来彻底清理。
   *
   * @example
   * ```typescript
   * collector.start()
   * // ... 一些操作
   * collector.stop() // 停止收集并恢复原始方法
   * ```
   */
  stop(): void {
    // 恢复原始的 history.pushState 方法
    // 避免影响其他使用此方法的代码或库
    if (this.originalPush !== null) {
      history.pushState = this.originalPush
    }

    // 恢复原始的 history.replaceState 方法
    if (this.originalReplace !== null) {
      history.replaceState = this.originalReplace
    }
  }
}
