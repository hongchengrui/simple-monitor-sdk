import type { IMetrics, IReportHandler, IReportData, IMetricsObj } from '../types'

/** 空闲回调的最小类型声明（标准 DOM lib 不一定稳定提供，故本地声明而非 as any） */
type RequestIdleCallback = (cb: () => void, opts?: { timeout: number }) => void

/**
 * 创建上报器：把指标封装成 IReportData（含 sessionId/appId/version/timestamp），
 * 然后交给业务的 reportCallback。
 *
 * 两种上报时机（权衡：监控 SDK 不能拖慢页面，也不能在卸载时丢数据）：
 *  - 普通上报：走 requestIdleCallback，主线程空闲时回调，不阻塞渲染；
 *    timeout 兜底 3s 内必执行，防止数据积压。
 *  - 紧急上报（页面隐藏/卸载）：同步回调。页面一旦销毁，requestIdleCallback 的
 *    回调永远不会触发——攒到 unload 的批量数据会被整批丢掉，所以必须同步。
 *
 * 边界（留给业务的决策点）：这里只保证「数据交到了 callback」。
 * 若业务 callback 内部用 fetch/XHR（异步请求），卸载时仍可能发不出去——
 * 卸载的可靠送达最终要靠 navigator.sendBeacon，但那需要采集引擎知道上报 URL，
 * 会打破「采集引擎不耦合网络」的契约，需另行决策。
 */
const createReporter =
  (
    sessionId: string,
    appId: string,
    version: string,
    callback: (data: IReportData) => void
  ): IReportHandler =>
  (data: IMetrics | IMetricsObj, urgent = false): void => {
    const reportData: IReportData = {
      sessionId,
      appId,
      version,
      data,
      timestamp: +new Date(),
    }

    // 紧急上报 或 浏览器不支持 idle：同步回调，确保数据不丢
    if (urgent || !('requestIdleCallback' in window)) {
      callback(reportData)
      return
    }

    // 普通上报：空闲时回调，不阻塞主线程
    ;(window as unknown as { requestIdleCallback: RequestIdleCallback }).requestIdleCallback(
      () => {
        callback(reportData)
      },
      { timeout: 3000 }
    )
  }

export default createReporter
