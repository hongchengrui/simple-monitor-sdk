/**
 * Subscribe Module - Event Bus
 *
 * Manages event handler registration and triggering.
 * Serves as the event distribution hub for the entire SDK.
 *
 * @module subscribe
 */

import type { EventTypes } from '@simple-monitor/types'
import { getFlag, setFlag, nativeTryCatch } from '@simple-monitor/utils'

/**
 * Event callback function type
 * Receives event data as parameter
 */
export type ReplaceCallback = (data: any) => void

/**
 * Event handler interface
 * Combines event type with its callback
 */
export interface ReplaceHandler {
  /** Event type to listen to */
  type: EventTypes | string
  /** Callback function to execute when event is triggered */
  callback: ReplaceCallback
}

/**
 * Event handlers storage
 * Maps event type to array of callback functions
 *
 * @example
 * {
 *   'xhr': [callback1, callback2],
 *   'fetch': [callback3],
 *   'error': [callback4, callback5, callback6]
 * }
 */
const replaceHandlers: Record<string, ReplaceCallback[]> = {}

/**
 * Subscribe to an event
 * Registers a callback for the specified event type
 *
 * @param handler - Event handler containing type and callback
 * @returns true if subscription succeeded, false if already subscribed
 *
 * @example
 * ```typescript
 * subscribeEvent({
 *   type: 'xhr',
 *   callback: (data) => console.log('XHR:', data)
 * })
 * ```
 */
export function subscribeEvent(handler: ReplaceHandler): boolean {
  // Generate unique flag key for this handler
  const flagKey = `${handler.type}-${handler.callback.name || 'anonymous'}`

  // Check if already subscribed
  if (getFlag(flagKey)) {
    return false
  }

  // Initialize array if not exists
  if (!replaceHandlers[handler.type]) {
    replaceHandlers[handler.type] = []
  }

  // Add callback to handlers
  replaceHandlers[handler.type].push(handler.callback)

  // Mark as subscribed
  setFlag(flagKey, true)

  return true
}

/**
 * Trigger all handlers for a specific event type
 * Each callback is wrapped in try-catch to isolate errors
 *
 * @param type - Event type to trigger
 * @param data - Data to pass to each callback
 *
 * @example
 * ```typescript
 * triggerHandlers('xhr', { url: '/api/data', status: 200 })
 * ```
 */
export function triggerHandlers(type: EventTypes | string, data: any): void {
  // Get handlers for this event type
  const handlers = replaceHandlers[type]

  // No handlers registered
  if (!handlers || handlers.length === 0) {
    return
  }

  // Execute each handler with error isolation
  handlers.forEach((callback) => {
    nativeTryCatch(
      () => {
        callback(data)
      },
      (_error: Error) => {
        // Silent fail - log in debug mode if needed
        // Individual handler errors should not break the entire event system
      }
    )
  })
}
