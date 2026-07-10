# @simple-monitor/types

Simple Monitor SDK 的共享类型定义包。位于分层最底层，被所有上层包依赖，本身不含运行时逻辑（仅枚举、接口、类型别名）。

## 安装

```bash
npm i @simple-monitor/types
```

> 该包通常作为其它 `@simple-monitor/*` 包的依赖被间接引入，一般无需单独安装。独立安装仅用于需要复用 SDK 类型（如自定义上报数据结构）的场景。

## 用法

```ts
import type { InitOptions, ReportDataType } from '@simple-monitor/types'
import { Severity, ErrorTypes } from '@simple-monitor/types'

const options: InitOptions = {
  dsn: 'https://up.example.com/report',
  apikey: 'your-apikey',
}

function format(data: ReportDataType) {
  return `${data.type ?? ErrorTypes.UNKNOWN}: ${data.message}`
}
```

## API

类型按模块分组导出，以下列出各模块的主要导出项。

### 错误与事件枚举（`eventTypes`）

- `ErrorTypes` — 上报错误分类枚举（`JAVASCRIPT_ERROR` / `LOG_ERROR` / `FETCH_ERROR` / `VUE_ERROR` / `REACT_ERROR` / `RESOURCE_ERROR` / `PROMISE_ERROR` / `ROUTE_ERROR` 等）。
- `EventTypes` — 被重写 / 监听的原生事件类型枚举（`xhr` / `fetch` / `console` / `dom` / `history` / `error` / `unhandledrejection` 等）。
- `BreadCrumbTypes` — 用户行为栈事件类型枚举（`Click` / `Xhr` / `Fetch` / `Route` / `Vue` / `React` / `Resource` 等）。
- `BreadCrumbCategory` — 行为分类枚举（`http` / `user` / `debug` / `exception` / `lifecycle`）。
- `WxAppEvents` / `WxPageEvents` / `WxRouterEvents` / `WxEvents` / `CompositeEvents` — 微信小程序原生事件枚举。
- `ERROR_TYPE_RE` / `globalVar` — 错误信息解析正则与少量运行时开关。

### 等级（`Severity`）

- `Severity` — 日志 / 上报等级枚举（`Debug` / `Info` / `Warning` / `Error`，以及上报等级 `Low` / `Normal` / `High` / `Critical`）。
- `SeverityUtils.fromString(level)` — 由字符串推断 `Severity`。

### HTTP 常量（`httpConstants`）

- `HttpMethod` — 标准 HTTP 方法枚举（`GET` / `POST` / `PUT` / `DELETE` / `PATCH` / `HEAD` / `OPTIONS`）。
- `EMethods` — 兼容用的首字母大写 HTTP 方法枚举（`Get` / `Post` 等）。
- `HttpCodes` — 常见 HTTP 状态码枚举（400 / 401 / 403 / 404 / 408 / 500 / 502 / 503 / 504）。
- `HttpTypes` — 被监控的请求类型枚举（`xhr` / `fetch`）。

### 上报数据结构（核心类型）

- `ErrorData` — 错误基础信息（type / message / stack / filename / lineno / colno / time / errorId）。
- `DeviceInfo` — 浏览器设备信息（ua / browser / os / deviceType / screen / netType 等）。
- `ReportDataType` — 错误 / HTTP 类上报数据结构（含 `request` / `response` / `componentName` 等可选字段）。
- `TrackReportData` — 埋点类上报数据结构（`actionType` / `trackId` / `durationTime` 等）。
- `PerformanceReportData` — 性能类上报数据结构（`{ eventType: 'performance', metrics }`）。
- `TransportDataType` — 最终上报信封（`authInfo` + `breadcrumb` + `data` + `deviceInfo`）。
- `AuthInfo` — 上报认证信息（`apikey` / `trackKey` / `sdkVersion` / `sdkName` / `trackerId`）。
- `isReportDataType(data)` — 类型守卫，判断是否为错误类上报数据。
- `isPerformanceData(data)` — 类型守卫，判断是否为性能类上报数据。

### 初始化与全局支持

- `InitOptions` — SDK 初始化配置（`dsn` / `apikey` / `maxBreadcrumbs` / `silentXxx` 系列 / `performance` / `resourceThreshold` / `resourceTopN` / 各类 hook）。
- `HooksTypes` — 上报前 / 面包屑前 / ajax 发送前等钩子函数类型。
- `SilentEventTypes` / `WxSilentEventTypes` / `WxMiniHooksTypes` / `BrowserHooksTypes` — 各类静默开关与平台钩子。
- `MonitorSupport` — 全局监控支持对象（logger / breadcrumb / transportData / replaceFlag / deviceInfo）。

### 其它

- `BreadcrumbPushData` / `IBreadcrumb` — 用户行为栈数据与接口。
- `LogTypes` — 手动 `log()` 入参类型（message / tag / level / ex / type）。
- `IRouter` / `TriggerConsole` — 路由变化、控制台拦截的结构。
- `MonitorHttp` / `MonitorXMLHttpRequest` — HTTP 监控数据与扩展的 XHR。
- `voidFun` / `IAnyObject` / `TNumStrObj` / `LocalStorageValue` 等通用辅助类型。
