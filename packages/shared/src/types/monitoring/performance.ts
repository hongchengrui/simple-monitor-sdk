/**
 * 性能监控相关类型定义
 */

/**
 * 性能数据结构
 */
export interface PerformanceData {
  /** 页面加载时间 */
  loadTime?: number
  /** DNS查询时间 */
  dnsTime?: number
  /** TCP连接时间 */
  tcpTime?: number
  /** 请求响应时间 */
  requestTime?: number
  /** DOM解析时间 */
  domTime?: number
  /** 首次绘制时间 */
  fp?: number
  /** 首次内容绘制时间 */
  fcp?: number
  /** 最大内容绘制时间 */
  lcp?: number
  /** 首次输入延迟 */
  fid?: number
  /** 累积布局偏移 */
  cls?: number
  /** 白屏时间 */
  whiteScreenTime?: number
  /** 首次有意义绘制时间 */
  fmp?: number
}

/**
 * Web Vitals指标
 */
export interface WebVitals {
  /** 首次绘制 */
  fp: number | null
  /** 首次内容绘制 */
  fcp: number | null
  /** 最大内容绘制 */
  lcp: number | null
  /** 首次输入延迟 */
  fid: number | null
  /** 累积布局偏移 */
  cls: number | null
}

/**
 * 资源加载性能数据
 */
export interface ResourcePerformance {
  /** 资源名称 */
  name: string
  /** 加载时长 */
  duration: number
  /** 资源大小 */
  size: number
  /** 资源类型 */
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'other'
}
