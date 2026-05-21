/**
 * 错误消息常量
 *
 * SDK 中使用的标准化错误消息。
 *
 * @module messages
 */

// ========== 初始化错误 ==========

/**
 * 错误：SDK 未初始化
 */
export const ERROR_NOT_INITIALIZED = 'SimpleMonitor SDK is not initialized. Call init() first.'

/**
 * 错误：SDK 已初始化
 */
export const ERROR_ALREADY_INITIALIZED = 'SimpleMonitor SDK is already initialized.'

/**
 * 错误：提供的 DSN 无效
 */
export const ERROR_INVALID_DSN = 'Invalid DSN provided. DSN must be a valid URL.'

/**
 * 错误：缺少必需选项
 */
export const ERROR_MISSING_REQUIRED_OPTION = 'Missing required option: '

/**
 * 错误：选项类型无效
 */
export const ERROR_INVALID_OPTION_TYPE = 'Invalid type for option: '

// ========== 配置错误 ==========

/**
 * 错误：配置无效
 */
export const ERROR_INVALID_CONFIG = 'Invalid SDK configuration.'

/**
 * 错误：配置解析失败
 */
export const ERROR_CONFIG_PARSE_FAILED = 'Failed to parse SDK configuration.'

/**
 * 错误：采样率超出范围
 */
export const ERROR_SAMPLE_RATE_OUT_OF_RANGE = 'Sample rate must be between 0 and 1.'

// ========== 上传错误 ==========

/**
 * 错误：上传失败
 */
export const ERROR_UPLOAD_FAILED = 'Failed to upload data to server.'

/**
 * 错误：网络错误
 */
export const ERROR_NETWORK_ERROR = 'Network error occurred.'

/**
 * 错误：请求超时
 */
export const ERROR_REQUEST_TIMEOUT = 'Request timed out.'

/**
 * 错误：服务器响应错误
 */
export const ERROR_SERVER_ERROR = 'Server responded with error.'

/**
 * 错误：请求被限流
 */
export const ERROR_RATE_LIMITED = 'Request rate limited.'

/**
 * 错误：载荷过大
 */
export const ERROR_PAYLOAD_TOO_LARGE = 'Upload payload too large.'

/**
 * 错误：未授权
 */
export const ERROR_UNAUTHORIZED = 'Unauthorized access. Check your API key.'

// ========== 数据处理错误 ==========

/**
 * 错误：数据格式无效
 */
export const ERROR_INVALID_DATA_FORMAT = 'Invalid data format.'

/**
 * 错误：缺少必需字段
 */
export const ERROR_MISSING_REQUIRED_FIELD = 'Missing required field: '

/**
 * 错误：数据转换失败
 */
export const ERROR_TRANSFORM_FAILED = 'Failed to transform data.'

/**
 * 错误：数据序列化失败
 */
export const ERROR_SERIALIZATION_FAILED = 'Failed to serialize data.'

/**
 * 错误：堆栈跟踪解析失败
 */
export const ERROR_STACK_PARSE_FAILED = 'Failed to parse stack trace.'

// ========== 面包屑错误 ==========

/**
 * 错误：面包屑数量超限
 */
export const ERROR_BREADCRUMB_LIMIT_EXCEEDED = 'Breadcrumb limit exceeded.'

/**
 * 错误：面包屑数据无效
 */
export const ERROR_INVALID_BREADCRUMB = 'Invalid breadcrumb data.'

// ========== 事件处理错误 ==========

/**
 * 错误：未找到事件处理器
 */
export const ERROR_HANDLER_NOT_FOUND = 'Event handler not found: '

/**
 * 错误：事件处理器注册失败
 */
export const ERROR_HANDLER_REGISTRATION_FAILED = 'Failed to register event handler.'

/**
 * 错误：不支持的事件类型
 */
export const ERROR_EVENT_TYPE_NOT_SUPPORTED = 'Event type not supported: '

/**
 * 错误：事件处理器过多
 */
export const ERROR_TOO_MANY_HANDLERS = 'Too many event handlers registered.'

// ========== 性能错误 ==========

/**
 * 错误：不支持 Performance API
 */
export const ERROR_PERFORMANCE_NOT_SUPPORTED = 'Performance API not supported in this environment.'

/**
 * 错误：未找到性能条目
 */
export const ERROR_PERFORMANCE_ENTRY_NOT_FOUND = 'Performance entry not found: '

/**
 * 错误：性能计时无效
 */
export const ERROR_PERFORMANCE_TIMING_INVALID = 'Invalid performance timing data.'

// ========== 拦截器错误 ==========

/**
 * 错误：方法替换失败
 */
export const ERROR_METHOD_REPLACEMENT_FAILED = 'Failed to replace method: '

/**
 * 错误：未找到方法
 */
export const ERROR_METHOD_NOT_FOUND = 'Method not found: '

/**
 * 错误：方法已被替换
 */
export const ERROR_METHOD_ALREADY_REPLACED = 'Method already replaced: '

// ========== 队列错误 ==========

/**
 * 错误：队列已满
 */
export const ERROR_QUEUE_FULL = 'Event queue is full.'

/**
 * 错误：队列刷新失败
 */
export const ERROR_QUEUE_FLUSH_FAILED = 'Failed to flush event queue.'

/**
 * 错误：队列处理错误
 */
export const ERROR_QUEUE_PROCESSING_ERROR = 'Error processing queued events.'

// ========== 存储错误 ==========

/**
 * 错误：存储不可用
 */
export const ERROR_STORAGE_NOT_AVAILABLE = 'Storage not available in this environment.'

/**
 * 错误：存储配额超限
 */
export const ERROR_STORAGE_QUOTA_EXCEEDED = 'Storage quota exceeded.'

/**
 * 错误：存储访问被拒绝
 */
export const ERROR_STORAGE_ACCESS_DENIED = 'Storage access denied.'

/**
 * 错误：存储读取失败
 */
export const ERROR_STORAGE_READ_FAILED = 'Failed to read from storage.'

/**
 * 错误：存储写入失败
 */
export const ERROR_STORAGE_WRITE_FAILED = 'Failed to write to storage.'

// ========== 验证错误 ==========

/**
 * 错误：URL 无效
 */
export const ERROR_INVALID_URL = 'Invalid URL: '

/**
 * 错误：时间戳无效
 */
export const ERROR_INVALID_TIMESTAMP = 'Invalid timestamp: '

/**
 * 错误：用户 ID 无效
 */
export const ERROR_INVALID_USER_ID = 'Invalid user ID.'

/**
 * 错误：追踪器 ID 无效
 */
export const ERROR_INVALID_TRACKER_ID = 'Invalid tracker ID.'

// ========== 警告消息 ==========

/**
 * 警告：调试模式已启用
 */
export const WARNING_DEBUG_MODE = 'SimpleMonitor debug mode is enabled.'

/**
 * 警告：弃用通知
 */
export const WARNING_DEPRECATED = 'Feature is deprecated and will be removed in a future version: '

/**
 * 警告：静默模式已启用
 */
export const WARNING_SILENT_MODE = 'SimpleMonitor is running in silent mode.'

/**
 * 警告：采样率将丢弃数据
 */
export const WARNING_SAMPLE_RATE = 'Sample rate is less than 1, some data will be dropped.'

/**
 * 警告：自动追踪已禁用
 */
export const WARNING_AUTO_TRACK_DISABLED = 'Automatic tracking is disabled.'

/**
 * 警告：当前环境不支持该功能
 */
export const WARNING_FEATURE_NOT_SUPPORTED = 'Feature not supported in current environment: '

// ========== 信息消息 ==========

/**
 * 信息：SDK 已初始化
 */
export const INFO_SDK_INITIALIZED = 'SimpleMonitor SDK initialized successfully.'

/**
 * 信息：SDK 已销毁
 */
export const INFO_SDK_DESTROYED = 'SimpleMonitor SDK destroyed.'

/**
 * 信息：数据已上传
 */
export const INFO_DATA_UPLOADED = 'Data uploaded successfully.'

/**
 * 信息：事件已捕获
 */
export const INFO_EVENT_CAPTURED = 'Event captured: '

/**
 * 信息：用户已识别
 */
export const INFO_USER_IDENTIFIED = 'User identified: '

/**
 * 信息：会话已开始
 */
export const INFO_SESSION_STARTED = 'Session started.'

/**
 * 信息：会话已结束
 */
export const INFO_SESSION_ENDED = 'Session ended.'

// ========== 错误类别 ==========

/**
 * 错误类别：初始化
 */
export const ERROR_CATEGORY_INIT = 'init'

/**
 * 错误类别：配置
 */
export const ERROR_CATEGORY_CONFIG = 'config'

/**
 * 错误类别：网络
 */
export const ERROR_CATEGORY_NETWORK = 'network'

/**
 * 错误类别：数据
 */
export const ERROR_CATEGORY_DATA = 'data'

/**
 * 错误类别：验证
 */
export const ERROR_CATEGORY_VALIDATION = 'validation'

/**
 * 错误类别：存储
 */
export const ERROR_CATEGORY_STORAGE = 'storage'

/**
 * 错误类别：性能
 */
export const ERROR_CATEGORY_PERFORMANCE = 'performance'

/**
 * 错误类别：未知
 */
export const ERROR_CATEGORY_UNKNOWN = 'unknown'
