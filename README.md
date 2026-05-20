# Simple Monitor SDK

> 轻量级跨平台前端监控 SDK

[![npm version](https://badge.fury.io/js/%40simple-monitor%2Fweb.svg)](https://www.npmjs.com/package/@simple-monitor/web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 简介

Simple Monitor SDK 是一个轻量级、模块化的前端监控解决方案，支持多平台部署，提供**错误追踪**、**性能监控**、**用户行为分析**等核心功能。

### 特性

- **📦 模块化设计** - 按需引入，减小包体积
- **🎯 多平台支持** - 浏览器、React、Vue、微信小程序
- **🔍 错误追踪** - JS 错误、Promise 拒绝、HTTP 错误、资源加载错误
- **📊 性能监控** - Web Vitals、导航时序、资源时序
- **🔖 行为追踪** - 面包屑记录、用户交互、路由变化
- **⚡ 轻量高效** - 零依赖核心库，高性能采集
- **🔧 易于集成** - 简单的 API，开箱即用

## 快速开始

### 安装

```bash
# npm
npm install @simple-monitor/web

# yarn
yarn add @simple-monitor/web

# pnpm
pnpm add @simple-monitor/web
```

### 基础用法

```typescript
import { init } from '@simple-monitor/web';

init({
  dsn: 'https://your-monitoring-endpoint.com/upload',
  trackerId: 'user-123',
});
```

### 平台特定包

```bash
# 浏览器环境
npm install @simple-monitor/browser

# React 项目
npm install @simple-monitor/react

# Vue 项目
npm install @simple-monitor/vue

# 微信小程序
npm install @simple-monitor/wx-miniprogram
```

## 文档

详细文档请查看：

- [使用指南](./docs/guide.md)
- [API 参考](./docs/api.md)
- [配置选项](./docs/config.md)
- [平台适配](./docs/platforms.md)
- [包说明](./packages/README.md)

## 开发

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 项目结构

```
simple-monitor-sdk/
├── packages/
│   ├── types/              # 类型定义
│   ├── utils/              # 工具函数
│   ├── shared/             # 共享常量
│   ├── core/               # 核心逻辑
│   ├── browser/            # 浏览器适配
│   ├── react/              # React 适配
│   ├── vue/                # Vue 适配
│   ├── wx-miniprogram/     # 微信小程序适配
│   ├── web-performance/    # 性能监控
│   └── web/                # Web 集成包
├── docs/                   # 文档
├── examples/               # 示例
└── package.json
```

### 开发命令

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 开发模式
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 格式化
pnpm format

# 清理
pnpm clean
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建指定包
pnpm build:types
pnpm build:utils
pnpm build:shared
pnpm build:core
pnpm build:platforms
```

## 核心功能

### 错误追踪

自动捕获并上报以下错误：

- JavaScript 运行时错误
- Promise 未捕获拒绝
- HTTP 请求错误（XHR、Fetch）
- 资源加载错误（脚本、样式、图片）

```typescript
init({
  dsn: 'your-dsn',
  enableErrorTracking: true,
});
```

### 性能监控

采集核心 Web 性能指标：

- **LCP** - 最大内容绘制
- **FID** - 首次输入延迟
- **CLS** - 累积布局偏移
- **FCP** - 首次内容绘制
- **TTFB** - 首字节时间

```typescript
init({
  dsn: 'your-dsn',
  enablePerformanceTracking: true,
});
```

### 用户行为

自动记录用户操作轨迹：

- HTTP 请求记录
- 路由切换记录
- 用户点击记录
- Console 日志（可选）

```typescript
init({
  dsn: 'your-dsn',
  maxBreadcrumbs: 10,
});
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `dsn` | `string` | *必需* | 上报地址 |
| `trackerId` | `string \| number` | *自动生成* | 用户 ID |
| `enableErrorTracking` | `boolean` | `true` | 启用错误追踪 |
| `enablePerformanceTracking` | `boolean` | `true` | 启用性能监控 |
| `enableHttpTracking` | `boolean` | `true` | 启用 HTTP 监控 |
| `maxBreadcrumbs` | `number` | `10` | 面包屑最大数量 |
| `silent` | `boolean` | `true` | 关闭控制台日志 |

## License

[MIT](LICENSE)
