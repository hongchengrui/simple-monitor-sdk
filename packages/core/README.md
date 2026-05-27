# @simple-monitor/core

> Simple Monitor SDK 核心业务逻辑包

## 简介

本包实现监控系统的核心能力，包含所有平台共享的业务逻辑。它是 SDK 的核心层，被所有平台适配层包依赖。

## 包内容

### 用户行为栈 (`breadcrumb.ts`)

记录用户操作路径，为错误排查提供上下文。

```typescript
class Breadcrumb {
  stack: BreadcrumbPushData[]     // 行为栈数据
  maxBreadcrumbs: number          // 最大记录数
  beforePushBreadcrumb: unknown   // 前置钩子

  push(data: BreadcrumbPushData): void    // 添加行为记录
  getStack(): BreadcrumbPushData[]        // 获取行为栈
  getCategory(type: BreadCrumbTypes): string  // 获取分类
  bindOptions(options: InitOptions): void // 绑定配置
}
```

### 错误 ID 生成 (`errorId.ts`)

为每个错误生成唯一标识符，用于去重和统计。

```typescript
function createErrorId(data: ReportDataType, apikey: string): number | null
function getRealPath(url: string): string                      // 规范化 URL
function hashCode(str: string): number                        // 字符串哈希
```

### 配置管理 (`options.ts`)

管理 SDK 的配置选项。

```typescript
class Options {
  // 钩子函数
  beforeAppAjaxSend: Function
  enableTraceId: boolean
  filterXhrUrlRegExp: RegExp
  traceIdFieldName: string
  throttleDelayTime: number
  maxDuplicateCount: number

  // 微信小程序钩子
  appOnLaunch: Function
  appOnShow: Function
  pageOnShow: Function
  // ...

  bindOptions(options: InitOptions): void
}

function setTraceId(httpUrl: string, callback: Function): void
```

### 事件订阅系统 (`subscribe.ts`)

发布-订阅模式的事件处理系统。

```typescript
interface ReplaceHandler {
  type: EventTypes | WxEvents
  callback: ReplaceCallback
}

function subscribeEvent(handler: ReplaceHandler): boolean  // 订阅事件
function triggerHandlers(type: EventTypes | WxEvents, data: any): void  // 触发事件
```

### 数据转换 (`transformData.ts`)

将原始监控数据转换为统一的上报格式。

```typescript
// HTTP 错误转换
function httpTransform(data: MonitorHttp): ReportDataType

// 资源错误转换
function resourceTransform(target: ResourceErrorTarget): ReportDataType

// Console 调用处理
function handleConsole(data: Replace.TriggerConsole): void
```

### 数据上报 (`transportData.ts`)

组装完整 payload 并通过多种方式发送到服务端。

```typescript
class TransportData {
  queue: Queue                    // 请求队列
  errorDsn: string                // 错误上报地址
  trackDsn: string                // 埋点上报地址

  // 上报方式
  xhrPost(data: TransportDataType, url: string): void    // XHR 上报
  imgRequest(data: TransportDataType, url: string): void // Image 上报
  wxPost(data: TransportDataType, url: string): void     // 微信小程序上报

  // 核心方法
  send(data: FinalReportType): Promise<void>             // 发送数据
  beforePost(data: FinalReportType): Promise<...>        // 上报前处理
  getTransportData(data: FinalReportType): TransportDataType  // 组装数据
  getAuthInfo(): AuthInfo                                 // 获取认证信息
  isSdkTransportUrl(targetUrl: string): boolean           // 判断 SDK 上报地址

  bindOptions(options: InitOptions): void                 // 绑定配置
}
```

### 手动上报 API (`external.ts`)

提供给业务方的主动监控接口。

```typescript
function log(options: LogTypes): void
```

使用示例：

```typescript
import { log } from 'simple-monitor'
import { Severity } from '@simple-monitor/types'

// 捕获业务异常并上报
try {
  processPayment()
} catch (err) {
  log({
    message: '支付处理失败',
    tag: 'payment',
    level: Severity.Critical,
    ex: err,
  })
}
```

### 全局支持 (`global.ts`)

全局状态管理和工具函数。

```typescript
interface MonitorSupport {
  logger: Logger
  breadcrumb: IBreadcrumb
  transportData: ITransportData
  replaceFlag: { [key: string]: boolean }
  record?: any[]
  deviceInfo?: TrackDeviceInfo
  options?: any
  track?: any
}

export const _support: MonitorSupport  // 全局支持对象
function silentConsoleScope<T>(callback: () => T): T  // 静默控制台作用域
function setSilentFlag(paramOptions: InitOptions): void  // 设置静默标志
```

### 日志系统 (`logger.ts`)

分级日志输出功能。

```typescript
class Logger {
  disable(): void
  enable(): void
  bindOptions(debug: boolean): void
  log/warn/error/info/debug(...args: any[]): void
}

export const logger: Logger  // 全局日志实例
```

## 数据流

```
原始错误发生
    ↓
transformData (数据转换)
    ↓
transportData.beforePost (生成 errorId)
    ↓
transportData.send (选择上报方式)
    ↓
Queue (队列)
    ↓
服务端
```

## 使用示例

```typescript
import { initOptions, transportData, breadcrumb } from '@simple-monitor/core'

// 初始化配置
initOptions({
  dsn: 'https://monitor.example.com/error',
  apikey: 'your-api-key',
  maxBreadcrumbs: 20,
})

// 手动添加行为记录
breadcrumb.push({
  type: BreadCrumbTypes.CLICK,
  category: 'user',
  data: { element: 'submit-button' },
  level: Severity.Info,
})

// 发送数据
transportData.send({
  type: ErrorTypes.JAVASCRIPT_ERROR,
  message: 'Something went wrong',
  level: Severity.Error,
  url: window.location.href,
  time: Date.now(),
})
```

## 依赖

- `@simple-monitor/types` - 类型定义
- `@simple-monitor/utils` - 工具函数
- `@simple-monitor/shared` - 共享常量
