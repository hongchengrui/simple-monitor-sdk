/**
 * 性能数据转换
 */
export function transformPerformanceData(data: any): any {
  return {
    type: 'performance',
    loadTime: data.loadTime,
    fp: data.fp,
    fcp: data.fcp,
  }
}
