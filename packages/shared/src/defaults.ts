import type { InitOptions } from '@simple-monitor/types'

/**
 * 默认配置选项
 *
 * SDK 初始化选项的默认值。
 * 当用户未提供自定义值时应用这些默认值。
 *
 * @module defaults
 */

/**
 * 默认最大面包屑数量
 */
export const DEFAULT_MAX_BREADCRUMBS = 10

/**
 * 默认最小面包屑数量
 */
export const DEFAULT_MIN_BREADCRUMBS = 5

/**
 * 默认高频事件节流延迟（毫秒）
 */
export const DEFAULT_THROTTLE_DELAY = 100

/**
 * 默认搜索/输入事件防抖延迟（毫秒）
 */
export const DEFAULT_DEBOUNCE_DELAY = 300

/**
 * 默认请求超时时间（毫秒）
 */
export const DEFAULT_REQUEST_TIMEOUT = 10000

/**
 * 默认失败请求的最大重试次数
 */
export const DEFAULT_MAX_RETRIES = 3

/**
 * 默认重试延迟基数（毫秒）
 */
export const DEFAULT_RETRY_DELAY = 1000

/**
 * 默认最大堆栈跟踪深度
 */
export const DEFAULT_MAX_STACK_DEPTH = 20

/**
 * 默认最大错误消息长度
 */
export const DEFAULT_MAX_ERROR_MESSAGE_LENGTH = 2048

/**
 * 默认最大上报 URL 长度
 */
export const DEFAULT_MAX_URL_LENGTH = 2000

/**
 * 默认最大参数值长度
 */
export const DEFAULT_MAX_PARAM_LENGTH = 512

/**
 * 默认最大上报 body 长度
 */
export const DEFAULT_MAX_BODY_LENGTH = 4096

/**
 * 默认采样率（0-1），1 表示全部上报
 */
export const DEFAULT_SAMPLE_RATE = 1

/**
 * 默认 before unload 超时时间（毫秒）
 */
export const DEFAULT_BEFORE_UNLOAD_TIMEOUT = 5000

/**
 * 默认批量上报刷新间隔（毫秒）
 */
export const DEFAULT_FLUSH_INTERVAL = 5000

/**
 * 默认批量上报最大批次大小
 */
export const DEFAULT_MAX_BATCH_SIZE = 10

/**
 * 默认静默模式（无控制台输出）
 */
export const DEFAULT_SILENT_MODE = true

/**
 * 默认调试模式
 */
export const DEFAULT_DEBUG_MODE = false

/**
 * 默认启用错误追踪
 */
export const DEFAULT_ENABLE_ERROR_TRACKING = true

/**
 * 默认启用性能追踪
 */
export const DEFAULT_ENABLE_PERFORMANCE_TRACKING = true

/**
 * 默认启用 HTTP 追踪
 */
export const DEFAULT_ENABLE_HTTP_TRACKING = true

/**
 * 默认启用用户交互追踪
 */
export const DEFAULT_ENABLE_INTERACTION_TRACKING = true

/**
 * 默认启用路由变化追踪
 */
export const DEFAULT_ENABLE_ROUTE_TRACKING = true

/**
 * 默认启用控制台追踪
 */
export const DEFAULT_ENABLE_CONSOLE_TRACKING = false

/**
 * 默认使用图片上传（而非 XHR POST）
 */
export const DEFAULT_USE_IMAGE_UPLOAD = false

/**
 * 默认启用自动追踪
 */
export const DEFAULT_ENABLE_AUTO_TRACK = true

/**
 * 完整的默认选项对象
 */
export const DEFAULT_OPTIONS: Partial<InitOptions> = {
  maxBreadcrumbs: DEFAULT_MAX_BREADCRUMBS,
  throttleDelayTime: DEFAULT_THROTTLE_DELAY,
  useImageUpload: DEFAULT_USE_IMAGE_UPLOAD,
  enableErrorTracking: DEFAULT_ENABLE_ERROR_TRACKING,
  enablePerformanceTracking: DEFAULT_ENABLE_PERFORMANCE_TRACKING,
  enableHttpTracking: DEFAULT_ENABLE_HTTP_TRACKING,
  silent: DEFAULT_SILENT_MODE,
  debug: DEFAULT_DEBUG_MODE,
}
