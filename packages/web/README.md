# @simple-monitor/web

门面聚合包。一个 `init()` 启用全部监控能力（错误 + 性能 + Vue/React 适配），业务方只需引入本包。

## 安装

```bash
npm i @simple-monitor/web
```

## 用法

```ts
import { init } from '@simple-monitor/web'

init({
  dsn: 'https://up.example.com/report',
  apikey: 'your-apikey',
  // 可选：
  // performance: false,      // 关闭性能采集（默认开）
  // resourceThreshold: 500,  // 慢资源阈值 ms（默认 300）
  // resourceTopN: 20,        // 慢资源 Top-N（默认 10）
})
```

自动启用：
- 错误 / HTTP / Promise / 资源 / console / 点击 / 路由（browser 8 采集器）
- 性能：FP / FCP / LCP / CLS / INP / FPS / CCP / RT（web-performance）
- 卸载可靠上报（sendBeacon 兜底）

## 框架适配（re-export）

```ts
import { MonitorVue, ErrorBoundary, errorBoundaryReport } from '@simple-monitor/web'

// Vue3 / Vue2
app.use(MonitorVue)

// React
<ErrorBoundary><App /></ErrorBoundary>
```

## API

### `init(options: InitOptions = {}): void`
门面入口，幂等（防重复初始化）。内部编排 browser init + web-performance（性能走 core transport，`eventType:performance` → trackDsn、不去重）。

### `log(data)`
手动上报日志（转出 core 实现）。

### `MonitorVue` / `ErrorBoundary` / `errorBoundaryReport`
框架适配 API（从 `@simple-monitor/vue` / `@simple-monitor/react` re-export）。

## 依赖

聚合 `@simple-monitor/browser` · `core` · `web-performance` · `vue` · `react`。
