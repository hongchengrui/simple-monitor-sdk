# Simple Monitor SDK

> 一个轻量级的前端监控 SDK，提供错误监控、性能监控、用户行为追踪等功能。

## 特性

- 错误监控：捕获 JavaScript 错误、Promise 错误、资源加载错误、HTTP 错误等
- 性能监控：收集页面性能指标（FP、FCP、LCP 等）
- 用户行为追踪：记录用户操作轨迹（面包屑）
- TraceId 追踪：自动生成和传递 TraceId 便于链路追踪
- 批量上报：支持批量上报和失败重试机制
- 采样配置：支持按事件类型配置采样率
- 过滤配置：支持过滤不需要监控的 URL 和错误
- 钩子函数：支持在上报前修改数据
- 静默配置：可以单独关闭某个监控功能
- TypeScript：完全使用 TypeScript 编写，提供完整的类型定义

## Monorepo 结构

```
simple-monitor-sdk/
├── packages/
│   ├── core/          # 核心监控模块
│   ├── integrations/  # 集成插件（Vue、React 等）
│   ├── shared/        # 共享类型和工具函数
│   └── custom-sdk/          # 打包输出目录
├── docs/              # 文档
└── examples/          # 示例代码
```

## 快速开始

### 安装

```bash
# 使用 npm
npm install @simple-monitor/sdk

# 使用 yarn
yarn add @simple-monitor/sdk

# 使用 pnpm
pnpm add @simple-monitor/sdk
```

### 基础用法

```typescript
import { initMonitor } from '@simple-monitor/sdk'

// 初始化监控
initMonitor({
  dsn: 'https://your-monitor-server.com/report',
  apiKey: 'your-app-key',

  // 可选配置
  sampleRate: {
    error: 1.0, // 错误采样率 100%
    performance: 0.1, // 性能采样率 10%
    behavior: 0.01, // 行为采样率 1%
  },

  enableTraceId: true, // 开启 TraceId

  hooks: {
    beforeSend: (data) => {
      // 在发送前修改数据
      data.userId = 'user-123'
      return data
    },
  },
})
```

## 配置项

### 基础配置

| 参数     | 类型    | 必填 | 默认值 | 说明         |
| -------- | ------- | ---- | ------ | ------------ |
| dsn      | string  | 是   | -      | 上报地址     |
| apiKey   | string  | 是   | -      | 应用唯一标识 |
| disabled | boolean | 否   | false  | 是否禁用监控 |

### 上报配置

| 参数         | 类型   | 默认值 | 说明                   |
| ------------ | ------ | ------ | ---------------------- |
| batchSize    | number | 10     | 批量上报大小           |
| batchTimeout | number | 5000   | 批量上报超时时间（ms） |
| maxRetries   | number | 3      | 失败重试次数           |
| retryDelay   | number | 1000   | 重试延迟（ms）         |

### 过滤配置

| 参数               | 类型     | 默认值 | 说明                |
| ------------------ | -------- | ------ | ------------------- |
| filterXhrUrlRegExp | RegExp   | -      | 过滤 XHR URL 的正则 |
| ignoreErrors       | RegExp[] | -      | 忽略错误的正则列表  |

### 采样配置

```typescript
sampleRate: {
  error: 1.0,        // 错误采样率（0-1）
  performance: 0.1,  // 性能采样率（0-1）
  behavior: 0.01     // 行为采样率（0-1）
}
```

### TraceId 配置

| 参数                        | 类型    | 默认值     | 说明                         |
| --------------------------- | ------- | ---------- | ---------------------------- |
| enableTraceId               | boolean | false      | 开启 TraceId                 |
| traceIdFieldName            | string  | 'Trace-Id' | TraceId 字段名               |
| includeHttpUrlTraceIdRegExp | RegExp  | -          | 需要添加 TraceId 的 URL 正则 |

### 面包屑配置

| 参数           | 类型   | 默认值 | 说明       |
| -------------- | ------ | ------ | ---------- |
| maxBreadcrumbs | number | 20     | 最大栈数量 |

### 钩子函数

```typescript
hooks: {
  beforeSend: (data) => any | null,           // 发送前钩子
  beforeAddBreadcrumb: (data) => any | null   // 添加面包屑前钩子
}
```

### 静默配置

```typescript
silent: {
  xhr: false,              // 静默 XHR 监控
  fetch: false,            // 静默 Fetch 监控
  console: false,          // 静默 Console 监控
  dom: false,              // 静默 DOM 监控
  history: false,          // 静默 History 监控
  error: false,            // 静默 Error 监控
  unhandledrejection: false // 静默 Promise 监控
}
```

## 监控类型

### 1. 错误监控

自动捕获以下错误类型：

- **JavaScript 错误**：运行时错误
- **Promise 错误**：未捕获的 Promise rejection
- **资源错误**：图片、脚本等资源加载失败
- **HTTP 错误**：XHR/Fetch 请求失败
- **Vue 错误**：Vue 组件错误（需要集成插件）

### 2. 性能监控

收集以下性能指标：

- FP (First Paint)：首次绘制时间
- FCP (First Contentful Paint)：首次内容绘制时间
- LCP (Largest Contentful Paint)：最大内容绘制时间
- FMP (First Meaningful Paint)：首次有意义绘制时间
- 页面加载时间
- DNS 查询时间
- TCP 连接时间
- 请求响应时间
- DOM 解析时间

### 3. 行为追踪

自动记录以下用户行为：

- HTTP 请求（XHR/Fetch）
- 路由变化
- DOM 点击
- Console 调用
- 页面跳转

## 开发

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
# 构建所有包
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```

### 代码检查

```bash
# 运行 ESLint
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

### 清理

```bash
# 清理构建产物和 node_modules
pnpm clean
```

## 技术栈

- TypeScript
- pnpm（Monorepo 管理）
- tsup（打包工具）
- ESLint + Prettier（代码规范）

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。
