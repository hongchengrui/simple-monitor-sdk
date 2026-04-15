/**
 * 事件类型定义
 */
export type EventHandler = (data: any) => void
export interface EventConfig {
  type: string
  callback: EventHandler
}
