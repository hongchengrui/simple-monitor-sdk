/**
 * 事件总线
 */
type EventHandler = (data: any) => void
interface EventConfig {
  type: string
  callback: EventHandler
}
const eventHandlers: EventConfig[] = []
export function subscribeEvent(config: EventConfig): void {
  eventHandlers.push(config)
}
export function triggerHandlers(type: string, data: any): void {
  eventHandlers
    .filter(handler => handler.type === type)
    .forEach(handler => {
      try {
        handler.callback(data)
      } catch (error) {
        console.error('[EventBus] Error in event handler:', error)
      }
    })
}
