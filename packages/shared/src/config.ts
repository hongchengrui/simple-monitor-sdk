/**
 * 全局配置常量
 *
 * SDK 配置中使用的全局常量。
 *
 * @module config
 */

/**
 * 默认 DSN（数据源名称）占位符
 */
export const DEFAULT_DSN = ''

/**
 * 默认追踪 DSN 占位符
 */
export const DEFAULT_TRACK_DSN = ''

/**
 * 默认 API 密钥占位符
 */
export const DEFAULT_API_KEY = ''

/**
 * 默认追踪密钥占位符
 */
export const DEFAULT_TRACK_KEY = ''

/**
 * 强制刷新队列前最大事件数量
 */
export const MAX_QUEUE_SIZE = 100

/**
 * 最大存储面包屑数量
 */
export const MAX_BREADCRUMB_LIMIT = 50

/**
 * 最大捕获堆栈帧数量
 */
export const MAX_STACK_FRAMES = 50

/**
 * 每种事件类型的最大处理器数量
 */
export const MAX_HANDLERS_PER_EVENT = 100

/**
 * 上传失败时的最大重试次数
 */
export const MAX_UPLOAD_RETRIES = 3

/**
 * 上传载荷的最大大小（字节，约 5MB）
 */
export const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024

/**
 * 自动刷新的最小间隔时间（毫秒）
 */
export const MIN_FLUSH_INTERVAL = 1000

/**
 * 自动刷新的最大间隔时间（毫秒）
 */
export const MAX_FLUSH_INTERVAL = 60000

/**
 * 页面可见性变化防抖时间（毫秒）
 */
export const VISIBILITY_CHANGE_DEBOUNCE = 250

/**
 * 点击事件防抖时间（毫秒）
 */
export const CLICK_DEBOUNCE_TIME = 500

/**
 * 滚动事件节流时间（毫秒）
 */
export const SCROLL_THROTTLE_TIME = 200

/**
 * 窗口大小变化节流时间（毫秒）
 */
export const RESIZE_THROTTLE_TIME = 200

/**
 * 控制台消息日志的最大长度
 */
export const MAX_CONSOLE_MESSAGE_LENGTH = 10000

/**
 * 保留的最大控制台历史记录条数
 */
export const MAX_CONSOLE_HISTORY = 50

/**
 * 收集的最大性能条目数量
 */
export const MAX_PERFORMANCE_ENTRIES = 100

/**
 * 收集的最大资源计时条目数量
 */
export const MAX_RESOURCE_ENTRIES = 100

/**
 * 页面加载性能收集的默认超时时间（毫秒）
 */
export const PAGE_LOAD_TIMEOUT = 10000

/**
 * 资源计时收集的默认超时时间（毫秒）
 */
export const RESOURCE_TIMING_TIMEOUT = 5000

/**
 * 上报的最大 URL 长度
 */
export const MAX_URL_LENGTH = 2000

/**
 * 上报的最大查询字符串长度
 */
export const MAX_QUERY_STRING_LENGTH = 500

/**
 * 截断值的截断指示符
 */
export const TRUNCATION_INDICATOR = '...'

/**
 * 头部中敏感数据的掩码
 */
export const SENSITIVE_HEADER_MASK = '[REDACTED]'

/**
 * 需要掩码的敏感 HTTP 头部列表
 */
export const SENSITIVE_HEADERS: readonly string[] = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-csrf-token',
  'x-xsrf-token',
] as const

/**
 * 需要掩码的敏感查询参数列表
 */
export const SENSITIVE_QUERY_PARAMS: readonly string[] = [
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'access_token',
  'refresh_token',
  'session_token',
  'auth',
] as const

/**
 * 用于标识的 User-Agent 字符串
 */
export const USER_AGENTS = {
  DEFAULT: 'SimpleMonitor/1.0',
  JAVA: 'SimpleMonitor-Java/1.0',
  NODE: 'SimpleMonitor-Node/1.0',
  PYTHON: 'SimpleMonitor-Python/1.0',
  PHP: 'SimpleMonitor-PHP/1.0',
  RUBY: 'SimpleMonitor-Ruby/1.0',
  GO: 'SimpleMonitor-Go/1.0',
} as const

/**
 * Content-Type 头部
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  MULTIPART_FORM_DATA: 'multipart/form-data',
  TEXT_PLAIN: 'text/plain',
  OCTET_STREAM: 'application/octet-stream',
} as const

/**
 * HTTP 方法常量
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  CONNECT: 'CONNECT',
  TRACE: 'TRACE',
} as const

/**
 * 请求头部名称
 */
export const HEADERS = {
  ACCEPT: 'Accept',
  ACCEPT_ENCODING: 'Accept-Encoding',
  ACCEPT_LANGUAGE: 'Accept-Language',
  AUTHORIZATION: 'Authorization',
  CONNECTION: 'Connection',
  CONTENT_ENCODING: 'Content-Encoding',
  CONTENT_LENGTH: 'Content-Length',
  CONTENT_TYPE: 'Content-Type',
  COOKIE: 'Cookie',
  HOST: 'Host',
  ORIGIN: 'Origin',
  REFERER: 'Referer',
  USER_AGENT: 'User-Agent',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_MONITOR_SDK: 'X-Monitor-SDK',
} as const
