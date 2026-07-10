# @simple-monitor/browser

浏览器端采集适配。包装/监听原生 API，经 core 事件总线 → transform → transportData 上报。

## 安装

```bash
npm i @simple-monitor/browser
```

> 本包不直接面向业务，由门面包 `@simple-monitor/web` 聚合转出。仅当需要绕过门面、自行编排采集时直接使用。

## 用法

```ts
import { init } from '@simple-monitor/browser'  // 或 from '@simple-monitor/web'

init({
  dsn: 'https://up.example.com/report',
  apikey: 'your-apikey',
})
```

内部：`initCore`（校验 + 绑定配置）→ `setupReplace`（订阅处理器 + 装载采集器）。

## 采集的事件

| 类型 | 触发 | 上报 |
|---|---|---|
| JS 异常 | `window.onerror` | `JAVASCRIPT_ERROR` |
| 资源错误 | img/script/link `error`（捕获阶段） | `RESOURCE_ERROR` |
| Promise | `unhandledrejection` | `PROMISE_ERROR` |
| HTTP | xhr / fetch 包装 | `FETCH_ERROR`（5xx / status 0；2xx 只进面包屑） |
| console | `console.{log,warn,error}` | 只进面包屑 |
| 点击 | `click`（capture） | 只进面包屑 |
| 路由 | hashchange / popstate / pushState / replaceState | 只进面包屑 + `onRouteChange` 钩子 |

特性：
- **防自循环**：SDK 自身的 `/report` 被 `isSdkTransportUrl` 拦截
- **flag 幂等**：重复 init 不重复打补丁
- **钩子 try-catch**：单点失败不阻断主链路
- **silentXxx 开关**：`silentError` / `silentXhr` / `silentFetch` / `silentConsole` / `silentDom` / `silentHistory` / `silentUnhandledrejection` / `silentHashchange`

## API

### `init(options: InitOptions = {}): void`
浏览器采集入口（`initCore` + `setupReplace`）。

### `setupReplace(): void`
装载全部原生采集器（一般由 `init` 调用，不需手动）。

### `log(data)`
手动上报（转出 core）。

## 依赖

`@simple-monitor/core` · `types` · `utils` · `shared`
