# @simple-monitor/web-performance

Web 性能采集引擎（独立）。采集 Web Vitals（FP/FCP/LCP/CLS/INP/FPS/CCP/NavigationTiming）+ RT 慢资源定位，通过 `reportCallback` 把数据交给业务或 core transport。

## 安装

```bash
npm i @simple-monitor/web-performance
```

> 通常通过门面包 `@simple-monitor/web` 的 init 自动集成，不单独使用。

## 用法

```ts
import { WebVitals } from '@simple-monitor/web-performance'

new WebVitals({
  reportCallback: (reportData) => {
    // reportData: { sessionId, appId, version, data: IMetrics, timestamp }
    console.log(reportData)
  },
  immediately: false,       // false: 卸载时批量上报；true: 采到即报
  resourceThreshold: 300,   // 慢资源阈值 ms
  resourceTopN: 10,
})
```

## 采集的指标

| 指标 | 说明 |
|---|---|
| FP / FCP | 首次绘制 / 首次内容绘制 |
| LCP | 最大内容绘制（交互/隐藏定格） |
| CLS | 累积布局偏移（session-window 算法，对齐 2021 官方） |
| INP | 交互到下一帧（取 worst） |
| FPS | 帧率（rAF 采样） |
| CCP | 自定义内容绘制（业务首屏：关键 API + 图片完成） |
| RT | 慢资源定位（duration ≥ 阈值 + 阶段拆解 + 跨域处理） |
| NavigationTiming | 加载瀑布（DNS / TCP / SSL / TTFB / DOM） |

## 架构

详见 [ARCHITECTURE.md](./ARCHITECTURE.md) —— 整体流程图 + 各指标实现原理 + 采集基础设施 + 门面集成契约。

## 集成契约（重要）

`reportCallback` 必须接 **beacon-aware transport**（如 core `transportData.send`），否则卸载时丢数据。门面包 `@simple-monitor/web` 已正确集成（性能走统一 core transport）。

## API

### `WebVitals`
采集类，构造即开始采集。

### `customContentfulPaint(): void`
触发自定义首屏事件（SPA 适配）。

### `setStartMark(name) / setEndMark(name) / clearMark(name)`
自定义性能打点（mark / measure）。

### `getCurrentMetrics(): IMetricsObj`
获取当前所有已采集指标（批量上报用）。
