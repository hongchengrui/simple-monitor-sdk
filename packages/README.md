# Simple Monitor SDK

轻量级跨平台前端监控 SDK，提供错误追踪、性能监控和用户行为分析。

## 概述

Simple Monitor SDK 是一个模块化、可扩展的前端监控解决方案，专为现代 Web 应用设计。支持多平台监控，包括浏览器、React、Vue 和微信小程序。

## 项目结构

```
simple-monitor-sdk/
├── packages/
│   ├── types/              # 类型定义
│   ├── utils/              # 工具函数
│   ├── shared/             # 共享常量和配置
│   ├── core/               # 核心监控逻辑
│   ├── browser/            # 浏览器平台适配器
│   ├── react/              # React 平台适配器
│   ├── vue/                # Vue 平台适配器
│   ├── wx-miniprogram/     # 微信小程序适配器
│   ├── web-performance/    # Web 性能监控
│   └── web/                # Web 集成包
├── docs/                   # 文档
├── examples/               # 使用示例
└── package.json            # 根 package.json
```

## 包依赖关系

```
types ← utils ← shared ← core ← browser ← react/vue/web
         ↑                     ↑
         └───── web-performance ──┴── web
```

## 核心功能

### 错误追踪
- **JavaScript 错误**：通过 `window.onerror` 捕获运行时错误
- **Promise 拒绝**：处理未捕获的 Promise 拒绝
- **HTTP 错误**：监控失败的 XHR 和 Fetch 请求
- **资源错误**：跟踪资源加载失败（脚本、样式、图片）
- **堆栈解析**：解析和格式化错误堆栈帧

### 性能监控
- **Web Vitals**：LCP、FID、CLS、FCP、TTFB
- **导航时序**：页面加载、DNS、TCP、SSL、请求/响应时间
- **资源时序**：单个资源加载指标
- **自定义指标**：支持应用特定的性能数据

### 用户行为追踪
- **面包屑**：自动记录用户交互轨迹
- **HTTP 监控**：请求/响应跟踪及耗时统计
- **路由变化**：SPA 导航跟踪
- **日志拦截**：可选的 console 拦截
- **DOM 事件**：点击和交互跟踪

### 平台支持
- **Browser**：原生 JavaScript 应用
- **React**：React 应用，集成 Error Boundary
- **Vue**：Vue 应用，集成错误处理器
- **WeChat Mini Program**：原生小程序 API

## 包详细说明

### @simple-monitor/types
SDK 的完整类型定义。

**导出内容：**
- 错误类型：`ErrorTypes`、`Severity`、`StackFrame`、`ErrorData`
- 事件类型：`EventTypes`、`WxEvents`、`EventHandler`
- 面包屑类型：`BreadCrumbTypes`、`BreadCrumbCategory`、`BreadcrumbData`
- HTTP 类型：`HttpMethod`、`HttpCodes`、`HttpRequestData`、`HttpResponseData`、`MonitorHttp`
- 核心类型：`DeviceInfo`、`AuthInfo`、`InitOptions`、`TransportDataType`、`PerformanceMetrics`

### @simple-monitor/utils
平台无关的工具函数。

**模块列表：**
- `global`：全局变量管理
- `is`：类型检测工具
- `string`：字符串处理工具
- `flag`：功能标志管理
- `event`：事件监听工具
- `logger`：内部日志系统
- `time`：时间和时间戳工具
- `function`：函数组合工具
- `throttle`：节流和防抖实现
- `queue`：队列数据结构
- `env`：环境检测
- `stack-trace`：错误堆栈解析器
- `interceptor`：API 拦截工具
- `error-catch`：错误捕获辅助函数

### @simple-monitor/shared
共享常量和默认配置。

**模块列表：**
- `constants`：SDK 版本、标识符、全局变量键名
- `defaults`：默认配置值
- `http-status`：HTTP 状态码映射
- `config`：全局配置限制和常量
- `device`：设备和浏览器类型定义
- `messages`：错误消息模板

### @simple-monitor/core
核心监控逻辑（待实现）。

**计划功能：**
- SDK 初始化和生命周期管理
- 数据传输和队列管理
- 事件订阅系统
- 面包屑管理
- 数据转换和验证

### @simple-monitor/browser
浏览器特定监控能力（待实现）。

**计划功能：**
- 浏览器 API 拦截（XHR、Fetch、Console）
- DOM 事件监听
- 可见性变化检测
- 页面生命周期管理

### @simple-monitor/react
React 平台适配器（待实现）。

**计划功能：**
- React Error Boundary 集成
- 路由集成（React Router）
- 组件生命周期跟踪
- Hook API

### @simple-monitor/vue
Vue 平台适配器（待实现）。

**计划功能：**
- Vue 错误处理器集成
- 路由集成（Vue Router）
- 组件生命周期跟踪
- 指令式 API

### @simple-monitor/wx-miniprogram
微信小程序适配器（待实现）。

**计划功能：**
- 小程序请求监控
- 页面生命周期跟踪
- 路由导航跟踪
- 小程序错误处理

### @simple-monitor/web-performance
Web 性能监控模块（待实现）。

**计划功能：**
- Web Vitals 收集（LCP、FID、CLS）
- Navigation Timing API 集成
- Resource Timing API 集成
- Performance Observer 集成
- 自定义性能指标

### @simple-monitor/web
完整的 Web 集成包（待实现）。

**计划功能：**
- 一体化浏览器 SDK
- 预配置的集成
- 简化的设置 API

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 开发模式运行
pnpm dev
```

### 基础用法

```typescript
import { init } from '@simple-monitor/web';

init({
  dsn: 'https://your-monitoring-endpoint.com',
  trackerId: 'user-123',
  enableErrorTracking: true,
  enablePerformanceTracking: true,
  enableHttpTracking: true,
});
```

### 开发命令

```bash
# 构建指定包
pnpm build:types      # 构建 types 包
pnpm build:utils      # 构建 utils 包
pnpm build:shared     # 构建 shared 包
pnpm build:core       # 构建 core 包
pnpm build:platforms  # 构建所有平台包

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
pnpm lint:fix

# 格式化代码
pnpm format

# 清理构建产物
pnpm clean
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `dsn` | `string` | *必需* | 错误上报的数据源地址 |
| `trackDsn` | `string` | `undefined` | 统计分析的上报地址 |
| `trackerId` | `string \| number` | *自动生成* | 用户/追踪 ID |
| `enableErrorTracking` | `boolean` | `true` | 启用自动错误追踪 |
| `enablePerformanceTracking` | `boolean` | `true` | 启用性能监控 |
| `enableHttpTracking` | `boolean` | `true` | 启用 HTTP 请求监控 |
| `maxBreadcrumbs` | `number` | `10` | 最大面包屑数量 |
| `throttleDelayTime` | `number` | `100` | 高频事件的节流延迟（毫秒） |
| `useImageUpload` | `boolean` | `false` | 使用图片上报方式 |
| `silent` | `boolean` | `true` | 禁用 SDK 控制台日志 |
| `debug` | `boolean` | `false` | 启用调试模式 |

## 数据流程

```
用户行为/事件
       ↓
   平台适配器
       ↓
   核心处理
       ↓
   数据转换
       ↓
   队列管理
       ↓
   传输层
       ↓
   监控服务器
```

## 许可证

MIT
