/**
 * Breadcrumb Type Enums
 * Defines user behavior tracking types (breadcrumb stack)
 */

/**
 * Individual breadcrumb types for categorizing user actions
 */
export enum BreadCrumbTypes {
  /** XHR requests */
  XHR = 'xhr',

  /** Fetch requests */
  FETCH = 'fetch',

  /** DOM click events */
  CLICK = 'click',

  /** Route navigation */
  ROUTE = 'route',

  /** Console logging */
  CONSOLE = 'console',

  /** Custom user-added breadcrumbs */
  CUSTOMER = 'customer',

  /** Code errors */
  CODE_ERROR = 'code_error',

  /** Resource errors */
  RESOURCE_ERROR = 'resource_error',

  /** Promise errors */
  PROMISE_ERROR = 'promise_error',

  /** Lifecycle events */
  LIFECYCLE = 'lifecycle',
}

/**
 * Breadcrumb categories for grouping related behaviors
 */
export enum BreadCrumbCategory {
  /** HTTP related activities (XHR, Fetch) */
  HTTP = 'http',

  /** User interactions (Click, Route) */
  USER = 'user',

  /** Debug activities (Console, Custom) */
  DEBUG = 'debug',

  /** Exception/Error events */
  EXCEPTION = 'exception',

  /** Application lifecycle events */
  LIFECYCLE = 'lifecycle',
}

/**
 * Breadcrumb data structure
 */
export interface BreadcrumbData {
  /** Type of the breadcrumb */
  type: BreadCrumbTypes;

  /** Category grouping */
  category: BreadCrumbCategory;

  /** Associated data */
  data: Record<string, any>;

  /** Severity level */
  level: Severity;

  /** Timestamp (optional, will be set if not provided) */
  time?: number;
}

/**
 * Import Severity from error types
 */
import { Severity } from './error';
