/**
 * Event Type Enums
 * Defines all interceptable event types for the SDK
 */

/**
 * Browser events that can be intercepted and monitored
 */
export enum EventTypes {
  /** XMLHttpRequest events */
  XHR = 'xhr',

  /** Fetch API events */
  FETCH = 'fetch',

  /** JavaScript errors */
  ERROR = 'error',

  /** Unhandled promise rejection */
  UNHANDLEDREJECTION = 'unhandledrejection',

  /** DOM click events */
  DOM = 'dom',

  /** History route changes */
  HISTORY = 'history',

  /** Hash route changes */
  HASHCHANGE = 'hashchange',

  /** Console method calls */
  CONSOLE = 'console',

  /** Page visibility changes */
  VISIBILITY = 'visibility',

  /** Page beforeunload */
  BEFOREUNLOAD = 'beforeunload',

  /** Page load performance */
  LOAD = 'load',
}

/**
 * WeChat Mini Program specific events
 */
export enum WxEvents {
  /** Mini program request errors */
  REQUEST = 'request',

  /** Mini program errors */
  ERROR = 'error',

  /** Mini program route changes */
  NAVIGATE = 'navigate',
}

/**
 * Union type for all supported event types
 */
export type AllEventTypes = EventTypes | WxEvents

/**
 * Event handler callback type
 */
export type EventHandlerCallback = (data: any) => void

/**
 * Event handler definition
 */
export interface EventHandler {
  /** Event type to handle */
  type: AllEventTypes

  /** Callback function when event is triggered */
  callback: EventHandlerCallback
}
