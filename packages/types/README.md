# @simple-monitor/types

> Simple Monitor SDK 类型定义包

## 简介

本包定义了整个 Simple Monitor SDK 中使用的所有 TypeScript 类型、枚举和接口。它是 SDK 的类型基础层，被其他所有包依赖。

## 包内容

### 错误类型

- `ErrorTypes` - 错误分类枚举（JS 错误、Promise 错误、HTTP 错误等）
- `ErrorData` - 错误数据结构
- `ReportDataType` - 上报数据类型

### 事件类型

- `EventTypes` - 可拦截事件类型（XHR、FETCH、ERROR、HISTORY 等）
- `WxAppEvents` - 微信小程序 App 级事件
- `WxPageEvents` - 微信小程序 Page 级事件
- `WxRouterEvents` - 微信小程序路由事件

### 用户行为栈

- `BreadCrumbTypes` - 行为类型（路由、点击、HTTP、控制台等）
- `BreadCrumbCategory` - 行为类别（HTTP、USER、DEBUG、EXCEPTION、LIFECYCLE）
- `BreadcrumbPushData` - 行为数据结构
- `IBreadcrumb` - 行为栈接口

### 严重程度

- `Severity` - 严重程度枚举（Error、Warning、Info、Debug 等）
- `SeverityUtils` - 严重程度工具类

### HTTP 相关

- `HttpMethod` / `EMethods` - HTTP 方法枚举
- `HttpCodes` - HTTP 状态码常量
- `HttpTypes` - 被监控的 HTTP 请求类型

### 配置选项

- `InitOptions` - SDK 初始化配置选项
- `HooksTypes` - 钩子函数类型定义
- `SilentEventTypes` - 静默事件配置
- `WxSilentEventTypes` - 微信小程序静默事件配置
- `WxMiniHooksTypes` - 微信小程序钩子配置
- `BrowserHooksTypes` - 浏览器钩子配置

### 数据传输

- `TransportDataType` - 传输数据类型
- `AuthInfo` - 认证信息结构
- `FinalReportType` - 最终上报类型
- `ITransportData` - 数据传输接口

### 埋点相关

- `EActionType` - 埋点动作类型（页面、事件、曝光、时长等）
- `TrackDeviceInfo` - 埋点设备信息
- `ITrackBaseParam` - 埋点基础参数

### 手动上报

- `LogTypes` - 手动日志上报参数

### 其他

- `TNumStrObj` - 字符串或数字对象类型
- `ReplaceCallback` - 替换回调类型
- `MonitorHttp` - HTTP 监控数据类型
- `ResourceErrorTarget` - 资源错误目标类型

## 使用示例

```typescript
import {
  ErrorTypes,
  EventTypes,
  Severity,
  type InitOptions,
  type TransportDataType,
} from '@simple-monitor/types'

// 使用枚举
const errorType = ErrorTypes.JAVASCRIPT_ERROR
const eventType = EventTypes.ERROR
const severity = Severity.Critical

// 使用类型
const options: InitOptions = {
  dsn: 'https://monitor.example.com/error',
  apikey: 'your-api-key',
}
```

## 依赖

本包**无任何依赖**，是最底层的类型定义包。
