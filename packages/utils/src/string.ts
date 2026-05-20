/**
 * 字符串工具
 *
 * 提供字符串处理和转换功能。
 *
 * @module string
 */

/**
 * 截断指示器
 * 用于表示字符串被截断
 */
export const TRUNCATION_INDICATOR = '...';

/**
 * 将任意类型转换为字符串
 *
 * @param target - 要转换的值
 * @returns 字符串表示
 */
export function unknownToString(target: unknown): string {
  if (target === null || target === undefined) {
    return '';
  }

  if (typeof target === 'string') {
    return target;
  }

  if (typeof target === 'number' || typeof target === 'boolean') {
    return String(target);
  }

  if (target instanceof Error) {
    return target.message || target.toString();
  }

  if (typeof target === 'object') {
    try {
      return JSON.stringify(target);
    } catch {
      return '[Object]';
    }
  }

  return String(target);
}

/**
 * 截断字符串到指定最大长度
 * 超过长度时添加截断指示器
 *
 * @param str - 要截断的字符串
 * @param maxLength - 最大长度
 * @param indicator - 截断指示器，默认为 '...'
 * @returns 截断后的字符串
 */
export function interceptStr(
  str: string | null | undefined,
  maxLength: number,
  indicator: string = TRUNCATION_INDICATOR,
): string {
  if (!str) {
    return '';
  }

  if (maxLength <= 0) {
    return '';
  }

  if (str.length <= maxLength) {
    return str;
  }

  // 计算保留的字符串长度（考虑指示器长度）
  const keepLength = Math.max(0, maxLength - indicator.length);
  return str.slice(0, keepLength) + indicator;
}

/**
 * 截断URL到安全长度
 * 用于上报时避免URL过长
 *
 * @param url - 要截断的URL
 * @param maxLength - 最大长度，默认2000
 * @returns 截断后的URL
 */
export function truncateUrl(url: string, maxLength: number = 2000): string {
  return interceptStr(url, maxLength);
}

/**
 * 截断消息到安全长度
 *
 * @param message - 要截断的消息
 * @param maxLength - 最大长度，默认2048
 * @returns 截断后的消息
 */
export function truncateMessage(message: string, maxLength: number = 2048): string {
  return interceptStr(message, maxLength);
}

/**
 * 生成随机字符串
 *
 * @param length - 字符串长度
 * @param charset - 字符集，默认为字母数字
 * @returns 随机字符串
 */
export function randomString(
  length: number = 8,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string {
  let result = '';
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetLength));
  }

  return result;
}

/**
 * 生成UUID v4格式的字符串
 *
 * @returns UUID字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 格式化JSON字符串
 * 处理循环引用等特殊情况
 *
 * @param obj - 要格式化的对象
 * @param space - 缩进空格数，默认2
 * @returns 格式化的JSON字符串
 */
export function safeStringify(obj: any, space: number = 2): string {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    // 处理循环引用
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, space);
}

/**
 * 掩码敏感信息（如API密钥、密码等）
 *
 * @param str - 要掩码的字符串
 * @param visibleChars - 开头和结尾保留的可见字符数，默认4
 * @param maskChar - 掩码字符，默认为 *
 * @returns 掩码后的字符串
 */
export function maskSensitiveString(
  str: string,
  visibleChars: number = 4,
  maskChar: string = '*',
): string {
  if (!str || str.length <= visibleChars * 2) {
    return maskChar.repeat(Math.max(str?.length || 0, 8));
  }

  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const maskLength = Math.max(str.length - visibleChars * 2, 3);

  return `${start}${maskChar.repeat(maskLength)}${end}`;
}

/**
 * 格式化文件大小为可读字符串
 *
 * @param bytes - 字节数
 * @returns 格式化后的字符串（如 "1.5 MB"）
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化持续时间为可读字符串
 * 注意：此函数已移至 @/time 模块，此处保留为兼容性
 *
 * @param milliseconds - 毫秒数
 * @returns 格式化后的字符串（如 "1h 23m 45s"）
 * @deprecated 请使用 time.formatDuration 代替
 */
export function formatDurationString(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours % 24 > 0) {
    parts.push(`${hours % 24}h`);
  }
  if (minutes % 60 > 0) {
    parts.push(`${minutes % 60}m`);
  }
  if (seconds % 60 > 0 || parts.length === 0) {
    parts.push(`${seconds % 60}s`);
  }

  return parts.join(' ');
}
