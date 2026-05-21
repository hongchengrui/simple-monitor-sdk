/**
 * Web Performance 类型定义
 */

/**
 * Web 性能指标
 */
export interface PerformanceMetrics {
  /** 最大内容绘制 (毫秒) */
  LCP?: number

  /** 首次输入延迟 (毫秒) */
  FID?: number

  /** 首次内容绘制 (毫秒) */
  FCP?: number

  /** 首字节时间 (毫秒) */
  TTFB?: number

  /** 累积布局偏移 (评分) */
  CLS?: number

  /** 首次绘制 (毫秒) */
  FP?: number

  /** 可交互时间 (毫秒) */
  TTI?: number

  /** 总阻塞时间 (毫秒) */
  TBT?: number

  /** 速度指数 */
  SI?: number

  /** 帧率 (FPS) */
  FPS?: number

  /** 页面加载时间 (毫秒) */
  loadTime?: number

  /** DNS 查询时间 (毫秒) */
  dnsTime?: number

  /** TCP 连接时间 (毫秒) */
  tcpTime?: number

  /** SSL/TLS 协商时间 (毫秒) */
  sslTime?: number

  /** 请求时间 (毫秒) */
  requestTime?: number

  /** 响应时间 (毫秒) */
  responseTime?: number

  /** DOM 处理时间 (毫秒) */
  domProcessingTime?: number

  /** 资源加载时间 (毫秒) */
  resourceLoadTime?: number
}
