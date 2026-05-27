# @simple-monitor/shared

> Simple Monitor SDK 共享常量和默认配置包

## 简介

本包仅包含 SDK 中使用的共享常量和默认配置值，不包含任何逻辑代码。所有值都是不可变的常量。

## 包内容

### SDK 常量 (`constants.ts`)

- `SDK_NAME` - SDK 名称标识
- `SDK_VERSION` - SDK 版本号
- `ERROR_TYPE_RE` - 错误类型解析正则表达式
- `GLOBAL_VAR` - 全局变量键名
- `TRACKER_ID_KEY` - 本地存储中 tracker ID 的键名

### 默认配置 (`defaults.ts`)

- `DEFAULT_MAX_BREADCRUMBS` - 默认最大面包屑数量 (10)
- `DEFAULT_THROTTLE_DELAY` - 默认节流延迟 (100ms)
- `DEFAULT_REQUEST_TIMEOUT` - 默认请求超时 (10000ms)
- `DEFAULT_SAMPLE_RATE` - 默认采样率 (1)
- `DEFAULT_OPTIONS` - 完整的默认配置对象

### 设备类型 (`device.ts`)

设备、浏览器、操作系统相关常量：

- **设备类型**: `mobile`, `tablet`, `desktop`, `unknown`
- **浏览器**: `chrome`, `firefox`, `safari`, `edge`, `opera`, `ie`
- **操作系统**: `windows`, `mac`, `linux`, `android`, `ios`
- **平台**: `browser`, `node`, `web-worker`, `react-native`, `wx-miniprogram`
- **网络类型**: `wifi`, `4g`, `5g`, `2g`, `3g`
- **屏幕断点**: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

### 全局配置 (`config.ts`)

运行时可变的全局配置

### 错误消息 (`messages.ts`)

SDK 内部使用的错误消息模板

## 使用示例

```typescript
import {
  SDK_NAME,
  SDK_VERSION,
  DEFAULT_MAX_BREADCRUMBS,
  DEVICE_TYPE_MOBILE,
} from '@simple-monitor/shared'

// 使用 SDK 常量
console.log(`${SDK_NAME} v${SDK_VERSION}`)

// 使用默认值
const maxBreadcrumbs = userConfig.maxBreadcrumbs ?? DEFAULT_MAX_BREADCRUMBS

// 设备类型判断
if (deviceType === DEVICE_TYPE_MOBILE) {
  // 移动端逻辑
}
```

## 设计原则

1. **纯常量** - 所有导出都是不可变的常量
2. **无逻辑** - 不包含任何函数或逻辑代码
3. **类型安全** - 使用 `as const` 确保类型推断

## 依赖

- `@simple-monitor/types` - 仅用于类型标注（InitOptions）
