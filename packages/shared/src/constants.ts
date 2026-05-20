/**
 * SDK Constants
 *
 * Global constants for the Simple Monitor SDK.
 * Contains version info, SDK identifiers, and metadata.
 *
 * @module constants
 */

/**
 * SDK name identifier
 */
export const SDK_NAME = 'simple-monitor';

/**
 * SDK version - will be replaced by build process
 */
export const SDK_VERSION = '1.0.0';

/**
 * SDK package name
 */
export const SDK_PACKAGE_NAME = '@simple-monitor/sdk';

/**
 * 错误类型解析正则表达式
 * 用于解析 window.onerror 事件中的错误信息
 * 匹配格式: "Uncaught ErrorType: error message"
 */
export const ERROR_TYPE_RE = /^(?:[Uu]ncaught\s*)?(?:\w*Error|[\w:]+):\s*(.*)$/;

/**
 * 全局变量键名前缀
 * 用于在全局对象上存储 SDK 相关数据
 */
export const GLOBAL_VAR_PREFIX = '__simple_monitor__';

/**
 * 全局变量键名
 */
export const GLOBAL_VAR = {
  /** SDK 实例 */
  INSTANCE: `${GLOBAL_VAR_PREFIX}instance__`,

  /** 当前会话 ID */
  SESSION_ID: `${GLOBAL_VAR_PREFIX}session_id__`,

  /** 追踪 ID */
  TRACKER_ID: `${GLOBAL_VAR_PREFIX}tracker_id__`,

  /** 标志位前缀 */
  FLAG_PREFIX: `${GLOBAL_VAR_PREFIX}flag_`,
} as const;

/**
 * Default user tracker ID key for localStorage
 */
export const TRACKER_ID_KEY = 'simple_monitor_tracker_id';

/**
 * Default session ID key for sessionStorage
 */
export const SESSION_ID_KEY = 'simple_monitor_session_id';

/**
 * Default device ID key for localStorage
 */
export const DEVICE_ID_KEY = 'simple_monitor_device_id';

/**
 * Maximum length for tracker ID
 */
export const MAX_TRACKER_ID_LENGTH = 128;

/**
 * Maximum length for user ID
 */
export const MAX_USER_ID_LENGTH = 256;

/**
 * Default SDK locale
 */
export const DEFAULT_LOCALE = 'en-US';

/**
 * SDK build timestamp - injected at build time
 */
export const BUILD_TIME = '';
