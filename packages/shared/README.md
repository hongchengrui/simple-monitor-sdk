# @simple-monitor/shared

Simple Monitor SDK 的共享常量与默认配置包。位于分层底层（依赖 `@simple-monitor/types`），为上层包提供 SDK 版本号、全局键名、默认阈值、设备/网络/浏览器分类常量、错误消息等不可变值，本身不含运行时逻辑。

## 安装

```bash
npm i @simple-monitor/shared
```

> 该包通常作为其它 `@simple-monitor/*` 包的依赖被间接引入，一般无需单独安装。

## 用法

```ts
import { SDK_NAME, SDK_VERSION, DEFAULT_MAX_BREADCRUMBS, DEVICE_TYPE_MOBILE } from '@simple-monitor/shared'

console.log(`${SDK_NAME} v${SDK_VERSION}`)

// 复用 SDK 默认值兜底用户配置
const maxBreadcrumbs = userConfig.maxBreadcrumbs ?? DEFAULT_MAX_BREADCRUMBS
```

## API

导出按模块分组，全部为 `as const` 不可变常量（`defaults` 中含一个 `DEFAULT_OPTIONS` 对象）。

### SDK 常量（`constants`）

- `SDK_NAME` — SDK 名称标识（`'simple-monitor'`）。
- `SDK_VERSION` — SDK 版本号。
- `SDK_PACKAGE_NAME` — SDK 包名。
- `ERROR_TYPE_RE` — `window.onerror` 错误信息解析正则。
- `GLOBAL_VAR_PREFIX` / `GLOBAL_VAR` — 在全局对象上存储 SDK 数据的键名前缀及各键（`INSTANCE` / `SESSION_ID` / `TRACKER_ID` / `FLAG_PREFIX`）。
- `TRACKER_ID_KEY` / `SESSION_ID_KEY` / `DEVICE_ID_KEY` — localStorage / sessionStorage 中的存储键名。

### 默认配置（`defaults`）

各阈值的默认值，命名自解释：

- `DEFAULT_MAX_BREADCRUMBS`（10）/ `DEFAULT_MIN_BREADCRUMBS`（5）— 面包屑数量上下限。
- `DEFAULT_THROTTLE_DELAY`（100）/ `DEFAULT_DEBOUNCE_DELAY`（300）— 高频事件节流 / 防抖延迟（ms）。
- `DEFAULT_REQUEST_TIMEOUT`（10000）/ `DEFAULT_MAX_RETRIES`（3）/ `DEFAULT_RETRY_DELAY`（1000）— 请求超时与重试。
- `DEFAULT_SAMPLE_RATE`（1）/ `DEFAULT_FLUSH_INTERVAL`（5000）/ `DEFAULT_MAX_BATCH_SIZE`（10）— 采样率与批量上报。
- 各类长度上限：`DEFAULT_MAX_STACK_DEPTH` / `DEFAULT_MAX_ERROR_MESSAGE_LENGTH` / `DEFAULT_MAX_URL_LENGTH` / `DEFAULT_MAX_PARAM_LENGTH` / `DEFAULT_MAX_BODY_LENGTH`。
- `DEFAULT_OPTIONS` — 完整的默认 `InitOptions` 对象（部分字段）。

### 全局配置（`config`）

运行时配置常量：

- 上限类：`MAX_QUEUE_SIZE` / `MAX_BREADCRUMB_LIMIT` / `MAX_STACK_FRAMES` / `MAX_PAYLOAD_SIZE` / `MAX_PERFORMANCE_ENTRIES` / `MAX_RESOURCE_ENTRIES` 等。
- 节流 / 超时：`MIN_FLUSH_INTERVAL` / `MAX_FLUSH_INTERVAL` / `PAGE_LOAD_TIMEOUT` / `RESOURCE_TIMING_TIMEOUT` / `VISIBILITY_CHANGE_DEBOUNCE` / `CLICK_DEBOUNCE_TIME` 等。
- 安全：`SENSITIVE_HEADERS` / `SENSITIVE_QUERY_PARAMS` / `SENSITIVE_HEADER_MASK` / `TRUNCATION_INDICATOR`。
- 协议常量：`HTTP_METHODS` / `HEADERS` / `CONTENT_TYPES` / `USER_AGENTS`。

### 设备与浏览器分类（`device`）

⚠️ 本模块为纯常量，目前无运行时采集逻辑使用；实际采集见 `@simple-monitor/browser` 的 `collectDeviceInfo()`。

- 设备类型：`DEVICE_TYPE_MOBILE` / `DEVICE_TYPE_TABLET` / `DEVICE_TYPE_DESKTOP` / `DEVICE_TYPE_UNKNOWN`，及聚合数组 `DEVICE_TYPES`。
- 浏览器：`BROWSER_CHROME` / `BROWSER_FIREFOX` / `BROWSER_SAFARI` / `BROWSER_EDGE` / `BROWSER_OPERA` / `BROWSER_IE` / `BROWSER_UNKNOWN`，及 `BROWSER_TYPES`。
- 操作系统：`OS_WINDOWS` / `OS_MAC` / `OS_LINUX` / `OS_ANDROID` / `OS_IOS` / `OS_UNKNOWN`，及 `OPERATING_SYSTEMS`。
- 平台：`PLATFORM_BROWSER` / `PLATFORM_NODE` / `PLATFORM_WEB_WORKER` / `PLATFORM_REACT_NATIVE` / `PLATFORM_WX_MINIPROGRAM`，及 `PLATFORM_TYPES`。
- 网络类型：`NETWORK_TYPE_WIFI` / `NETWORK_TYPE_4G` / `NETWORK_TYPE_3G` / `NETWORK_TYPE_2G` 等。
- 屏幕断点：`SCREEN_XS`~`SCREEN_XXL` / `BREAKPOINT_XS`~`BREAKPOINT_XXL` / `BREAKPOINTS`。
- 方向 / 能力：`ORIENTATION_PORTRAIT` / `ORIENTATION_LANDSCAPE` / `CAPABILITY_TOUCH` 等。

### 错误消息（`messages`）

SDK 内部使用的标准化错误 / 警告 / 信息消息常量，按类别组织：

- 初始化：`ERROR_NOT_INITIALIZED` / `ERROR_ALREADY_INITIALIZED` / `ERROR_INVALID_DSN` 等。
- 上传 / 网络 / 数据处理 / 面包屑 / 事件 / 性能 / 拦截器 / 队列 / 存储 / 验证各类 `ERROR_*`。
- 警告与信息：`WARNING_DEBUG_MODE` / `WARNING_SAMPLE_RATE` / `INFO_SDK_INITIALIZED` 等。
- 错误类别：`ERROR_CATEGORY_INIT` / `ERROR_CATEGORY_NETWORK` / `ERROR_CATEGORY_DATA` 等。
