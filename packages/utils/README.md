# @simple-monitor/utils

Simple Monitor SDK 的工具函数包。平台无关的基础能力（类型检测、UUID、日志、方法拦截、时间、字符串、DOM helper 等），不含任何监控业务逻辑，被所有上层包依赖。

## 安装

```bash
npm i @simple-monitor/utils
```

> 该包通常作为其它 `@simple-monitor/*` 包的依赖被间接引入，一般无需单独安装。

## 用法

```ts
import { getTimestamp, generateUUID, logger, validateOption } from '@simple-monitor/utils'

const time = getTimestamp()
const id = generateUUID()

if (validateOption(dsn, 'dsn', 'string')) {
  // dsn 合法
}

logger.info('SDK initialized')
```

## API

### 全局对象与环境（`global`）

- `getGlobal<T>()` — 获取当前环境的全局对象（浏览器 window / 小程序 / Node.js global）。
- `_global` — 缓存的全局对象。
- `isBrowserEnv` / `isWxMiniEnv` / `isNodeEnv` — 环境探测布尔值。
- `supportsHistory()` — 当前环境是否支持 History API。
- `setFlag(replaceType, isSet)` / `getFlag(replaceType)` — 采集器替换标志位读写（用于静默开关与幂等保护）。

### 类型检测（`is`）

- `variableTypeDetection` — 覆盖各类型的检测方法集。
- `isError(wat)` — 是否为 Error 对象。
- `isEmptyObject(obj)` / `isEmpty(wat)` — 空对象 / 空值判断。
- `isInstanceOf(wat, base)` — 实例关系检测。
- `isExistProperty(obj, key)` — 是否存在指定属性。
- `nativeToString` — `Object.prototype.toString` 引用。

### 队列（`queue`）

- `Queue` — 微任务队列，用于批量 / 有序处理异步任务（`addFn` 入队）。
- `voidFun` — `() => void` 类型别名。

### 日志（`logger`）

- `Logger` — 分级日志类（`enable` / `disable` / `bindOptions(debug)` / `log` / `warn` / `error` / `info` / `debug`）。
- `LogLevel` — 日志级别枚举。
- `getLogger()` — 获取 logger 实例。
- `logger` — 全局日志实例。

### 方法拦截（`interceptor`）

- `replaceOld(source, name, callback, isForce?)` — 包装对象上的原方法，返回新方法（原型链劫持的基础）。
- `restoreMethod(source, name, original)` — 还原被替换的方法。
- `isMethodReplaced(source, name)` — 判断方法是否已被替换。
- `replaceTrackable(...)` — 带可追踪标记的方法替换。
- `AnyObject` / `InterceptorCallback` — 辅助类型。

### 字符串（`string`）

- `splitObjToQuery(obj)` — 对象转 URL 查询字符串。
- `interceptStr(str, len)` — 字符串截断（超长加省略号）。
- `unknownToString(target)` — 任意值安全转字符串。
- `setUrlQuery(url, query)` — 给 URL 追加查询参数。

### 时间（`time`）

- `getTimestamp()` — 当前毫秒时间戳。
- `getBigVersion(version)` — 取版本号主版本数字。

### 校验（`validate`）

- `validateOption(target, name, expectType)` — 按 `typeof` 校验配置项类型。
- `toStringValidateOption(target, name, type)` — 按 `Object.prototype.toString` 校验（如正则）。
- `typeofAny(target, type)` / `toStringAny(target, type)` — 底层类型判断。

### UUID（`uuid`）

- `generateUUID()` — 标准 UUID v4。
- `uuidCompact()` — 紧凑型 UUID（无连字符）。
- `nanoId(length = 21)` — 短 ID。

### 函数工具（`functional`）

- `throttle(fn, delay)` — 节流。
- `getFunctionName(fn)` — 获取函数名（拿不到记 `<anonymous>`）。
- `defaultFunctionName` — 默认匿名函数名。
- `silent(fn)` — 静默执行（吞异常，返回 `T | undefined`）。
- `nativeTryCatch(fn, errorFn?)` — try-catch 包装。

### DOM / 平台 helper（`helpers`）

- `getLocationHref()` — 当前页面 URL（非浏览器环境返回空）。
- `on(target, event, handler, options?)` — 事件监听包装。
- `isHttpFail(code)` — HTTP 状态码是否失败。
- `getCurrentRoute()` — 微信小程序当前路由。
- `getAppId()` — 微信小程序 AppId。
- `parseErrorString(str)` — 字符串解析为错误结构。

### 解析器（`parser`）

- `extractErrorStack(ex, level)` — 从 Error 提取堆栈并组装为 `ReportDataType`。
- `parseUrlToObj(url)` — URL 拆分为 `{ host / path / query / hash }`。
- `htmlElementAsString(target)` — DOM 元素序列化为可读字符串（用于点击埋点）。
