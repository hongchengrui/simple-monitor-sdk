/**
 * 支持的响应类型列表
 * 只有这些类型的响应可以安全地读取为文本
 */
const SUPPORTED_RESPONSE_TYPES = ['', 'json', 'text'] as const

/**
 * 生成追踪 ID
 * 用于唯一标识每个请求
 */
export function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * 安全地序列化请求数据
 *
 * 处理无法序列化的类型，避免 JSON.stringify 报错
 */
export function safeStringifyRequestData(data: unknown): string {
  if (data === undefined || data === null) {
    return String(data)
  }

  // 处理常见的无法序列化的类型
  if (data instanceof FormData) {
    const entries: Record<string, string> = {}
    data.forEach((value: FormDataEntryValue, key: string) => {
      if (typeof value === 'string') {
        entries[key] = value
      } else {
        // File 对象
        entries[key] = `[File](${value.name}, ${value.size} bytes, ${value.type})`
      }
    })
    return JSON.stringify(entries)
  }

  if (data instanceof Blob) {
    return `[Blob](${data.size} bytes, ${data.type})`
  }

  if (data instanceof ArrayBuffer) {
    return `[ArrayBuffer](${data.byteLength} bytes)`
  }

  if (data instanceof ReadableStream) {
    return '[ReadableStream]'
  }

  if (typeof data === 'object') {
    try {
      return JSON.stringify(data)
    } catch (error) {
      return '[Object] (unable to serialize)'
    }
  }

  return String(data)
}

/**
 * 响应体最大大小限制（100KB）
 * 超过这个大小的响应体会被截断，避免内存问题
 */
const MAX_RESPONSE_SIZE = 1024 * 100

/**
 * 截断过长的响应体
 */
export function truncateResponseText(text: string): string {
  if (text.length > MAX_RESPONSE_SIZE) {
    return text.substring(0, MAX_RESPONSE_SIZE) + `... [truncated, total ${text.length} chars]`
  }
  return text
}

/**
 * 安全地读取 XHR 响应数据
 *
 * 安全考虑：
 * 1. 只有特定的响应类型才能安全地读取为文本（避免 blob、arraybuffer 等类型报错）
 * 2. 只有成功的响应才记录内容（避免记录错误页面的敏感信息）
 */
export function safeGetResponseText(xhr: XMLHttpRequest): string | undefined {
  // 1. 检查响应类型是否支持
  if (
    !SUPPORTED_RESPONSE_TYPES.includes(
      xhr.responseType as (typeof SUPPORTED_RESPONSE_TYPES)[number]
    )
  ) {
    return undefined
  }

  // 2. 检查状态码（> 401 的响应才记录内容，避免敏感信息）
  if (xhr.status <= 401) {
    return undefined
  }

  // 3. 尝试读取响应文本
  try {
    return xhr.responseText
  } catch (error) {
    // 读取失败时返回 undefined，不影响监控
    return undefined
  }
}
