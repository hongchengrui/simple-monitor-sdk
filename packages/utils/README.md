# @simple-monitor/utils

> Simple Monitor SDK 工具函数包

## 简介

本包提供跨平台的基础能力工具函数，不包含监控业务逻辑。所有函数都是纯函数或工具类，可在任何环境中使用。

## 包内容

### 全局变量管理 (`global.ts`)

- `getGlobal()` - 获取当前环境的全局对象（浏览器/小程序/Node.js）
- `isBrowserEnv` - 浏览器环境检测
- `isWxMiniEnv` - 微信小程序环境检测
- `isNodeEnv` - Node.js 环境检测
- `supportsHistory()` - 检测是否支持 history API
- `setFlag() / getFlag()` - 替换标志位管理

### 类型检测 (`is.ts`)

- `variableTypeDetection` - 变量类型检测工具集
- `isError()` - 是否为 Error 对象
- `isEmptyObject()` - 是否为空对象
- `isEmpty()` - 是否为空值
- `isInstanceOf()` - 实例关系检测

### 字符串处理 (`string.ts`)

- `splitObjToQuery()` - 对象转查询字符串
- `interceptStr()` - 字符串截取
- `unknownToString()` - 任意值转字符串
- `setUrlQuery()` - URL 添加查询参数

### 时间处理 (`time.ts`)

- `getTimestamp()` - 获取当前时间戳
- `getBigVersion()` - 获取版本号主版本

### 函数工具 (`functional.ts`)

- `nativeTryCatch()` - 安全的 try-catch 包装
- `silentConsoleScope()` - 静默控制台作用域

### 日志系统 (`logger.ts`)

- `Logger` - 分级日志类
- `LogLevel` - 日志级别枚举
- `logger` - 全局日志实例

### 队列管理 (`queue.ts`)

- `Queue` - 微任务队列，用于批量处理异步任务

### 验证工具 (`validate.ts`)

- `validateOption()` - 选项类型验证
- `toStringValidateOption()` - toString 类型验证
- `typeofAny() / toStringAny()` - 类型检查函数

### UUID 生成 (`uuid.ts`)

- `generateUUID()` - 生成 UUID v4
- `uuidCompact()` - 生成紧凑型 UUID
- `nanoId()` - 生成 NanoID

### API 拦截器 (`interceptor.ts`)

- `replaceOld()` - 原型链方法重写/拦截
- `replaceHack()` - 拦截辅助函数
- `headerGenerator()` - 请求头生成器

### 错误解析 (`parser.ts`)

- `extractErrorStack()` - 解析错误堆栈
- `parseUrlToObj()` - URL 解析
- `htmlElementAsString()` - HTML 元素转字符串

### 辅助函数 (`helpers.ts`)

- `getLocationHref()` - 获取当前页面 URL
- `on()` - 事件监听器包装
- `isHttpFail()` - HTTP 状态码失败判断
- `getCurrentRoute()` - 获取微信小程序当前路由
- `getAppId()` - 获取微信小程序 AppId
- `parseErrorString()` - 解析字符串错误信息

## 使用示例

```typescript
import {
  getTimestamp,
  generateUUID,
  validateOption,
  logger,
} from '@simple-monitor/utils'

// 获取时间戳
const time = getTimestamp()

// 生成 UUID
const id = generateUUID()

// 验证配置
if (validateOption(dsn, 'dsn', 'string')) {
  // 使用 dsn
}

// 输出日志
logger.info('SDK initialized')
```

## 依赖

- `@simple-monitor/types` - 类型定义
