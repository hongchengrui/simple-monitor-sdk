/**
 * HTTP 状态码到 Span 状态的映射模块
 * @see https://opentelemetry.io/docs/reference/specification/trace/api/#set-status
 */

/**
 * Span 状态枚举
 *
 * 表示一个 Span 的最终执行状态，遵循 OpenTelemetry 规范。
 * 这些状态提供了比简单的成功/失败更丰富的语义信息。
 */
export enum SpanStatus {
  /** 执行成功 */
  Ok = 'ok',
  /** 操作超时（如 gateway 超时、504） */
  DeadlineExceeded = 'deadline_exceeded',
  /** 未认证（如 401 未登录或 token 无效） */
  Unauthenticated = 'unauthenticated',
  /** 权限不足（如 403 已登录但无权访问） */
  PermissionDenied = 'permission_denied',
  /** 资源未找到（如 404） */
  NotFound = 'not_found',
  /** 资源耗尽（如 429 请求过多，被限流） */
  ResourceExhausted = 'resource_exhausted',
  /** 参数无效（如 400，通用客户端错误） */
  InvalidArgument = 'invalid_argument',
  /** 未实现（如 501，服务器不支持该功能） */
  Unimplemented = 'unimplemented',
  /** 服务不可用（如 503，服务过载或维护中） */
  Unavailable = 'unavailable',
  /** 内部错误（如 500，服务器意外错误） */
  InternalError = 'internal_error',
  /** 未知错误（无法明确分类的错误） */
  UnknownError = 'unknown_error',
  /** 操作已取消（如客户端主动取消请求） */
  Cancelled = 'cancelled',
  /** 资源已存在（如 409，创建冲突的资源） */
  AlreadyExists = 'already_exists',
  /** 前置条件失败（如 413，请求体过大） */
  FailedPrecondition = 'failed_precondition',
  /** 操作已中止（通常由并发冲突导致） */
  Aborted = 'aborted',
  /** 超出范围（如分页参数超出有效范围） */
  OutOfRange = 'out_of_range',
  /** 数据丢失（严重的不可恢复的数据损坏） */
  DataLoss = 'data_loss',
}

/**
 * 将 HTTP 状态码映射为 Span 状态
 *
 * @param httpStatus - 标准 HTTP 状态码 (100-599)
 * @returns 对应的 Span 状态
 */
export function fromHttpStatus(httpStatus: number): SpanStatus {
  if (httpStatus < 400) {
    return SpanStatus.Ok
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return SpanStatus.Unauthenticated
      case 403:
        return SpanStatus.PermissionDenied
      case 404:
        return SpanStatus.NotFound
      case 409:
        return SpanStatus.AlreadyExists
      case 413:
        return SpanStatus.FailedPrecondition
      case 429:
        return SpanStatus.ResourceExhausted
      default:
        return SpanStatus.InvalidArgument
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return SpanStatus.Unimplemented
      case 503:
        return SpanStatus.Unavailable
      case 504:
        return SpanStatus.DeadlineExceeded
      default:
        return SpanStatus.InternalError
    }
  }
  return SpanStatus.UnknownError
}
