/**
 * Core Data Type Definitions
 * Defines core data structures used across the SDK
 */

import { ErrorData } from './error';
import { BreadcrumbData } from './breadcrumb';

/**
 * Device information
 */
export interface DeviceInfo {
  /** User agent string */
  ua?: string;

  /** Browser type (chrome, firefox, safari, etc.) */
  browser?: string;

  /** Browser version */
  browserVersion?: string;

  /** Operating system */
  os?: string;

  /** OS version */
  osVersion?: string;

  /** Device type (mobile, tablet, desktop) */
  deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';

  /** Screen resolution */
  screen?: string;

  /** Viewport size */
  viewport?: string;

  /** Device pixel ratio */
  dpr?: number;

  /** Language */
  language?: string;

  /** Timezone */
  timezone?: string;

  /** Network type (4g, 3g, 2g, wifi, etc.) */
  netType?: string;

  /** Connection effective type */
  effectiveType?: string;
}

/**
 * Authentication/user information
 */
export interface AuthInfo {
  /** User/tracker ID */
  trackerId: string | number;

  /** SDK version */
  sdkVersion: string;

  /** SDK name */
  sdkName: string;

  /** API key for authentication (optional) */
  apiKey?: string;

  /** Track key for analytics (optional) */
  trackKey?: string;
}

/**
 * SDK initialization options
 */
export interface InitOptions {
  /** DSN (Data Source Name) for error reporting */
  dsn: string;

  /** DSN for analytics tracking (optional) */
  trackDsn?: string;

  /** API key (optional) */
  apiKey?: string;

  /** Track key (optional) */
  trackKey?: string;

  /** User/tracker ID (optional, will be generated if not provided) */
  trackerId?: string | number;

  /** SDK version (auto-set) */
  sdkVersion?: string;

  /** SDK name (auto-set) */
  sdkName?: string;

  /** Enable/disable automatic error tracking */
  enableErrorTracking?: boolean;

  /** Enable/disable automatic performance tracking */
  enablePerformanceTracking?: boolean;

  /** Enable/disable automatic HTTP tracking */
  enableHttpTracking?: boolean;

  /** Maximum breadcrumbs to keep (default: 10) */
  maxBreadcrumbs?: number;

  /** Throttle delay for high-frequency events (ms) */
  throttleDelayTime?: number;

  /** Use image upload for reporting (default: false, uses XHR POST) */
  useImageUpload?: boolean;

  /** Callback before data is sent to server */
  beforeDataReport?: (data: TransportDataType) => TransportDataType | null | Promise<TransportDataType | null>;

  /** Callback to customize report URL */
  configReportUrl?: (data: TransportDataType, url: string) => string;

  /** Callback before sending XHR report */
  configReportXhr?: (xhr: XMLHttpRequest, data: any) => void;

  /** Callback to get tracker ID */
  backTrackerId?: () => string | number;

  /** Callback before pushing breadcrumb */
  beforePushBreadcrumb?: (breadcrumb: any, data: BreadcrumbData) => BreadcrumbData | null;

  /** Callback before sending AJAX request */
  beforeAppAjaxSend?: (req: { method: string; url: string }, xhr: XMLHttpRequest | Headers) => void;

  /** Callback on route change */
  onRouteChange?: (from: string, to: string) => void;

  /** Enable/disable silent console for SDK logs */
  silent?: boolean;

  /** Debug mode */
  debug?: boolean;
}

/**
 * Complete transport data structure for reporting
 */
export interface TransportDataType {
  /** Authentication information */
  authInfo: AuthInfo;

  /** Breadcrumb stack (user behavior) */
  breadcrumb: BreadcrumbData[];

  /** Actual report data (error, performance, etc.) */
  data: ReportData;

  /** Session recording data (reserved) */
  record?: any[];

  /** Device information */
  deviceInfo: DeviceInfo;
}

/**
 * Report data types
 */
export type ReportData = ErrorReportData | PerformanceReportData | BehaviorReportData;

/**
 * Error report data
 */
export interface ErrorReportData {
  /** Report type identifier */
  eventType: 'error';

  /** Error details */
  errorInfo: ErrorData;
}

/**
 * Performance report data
 */
export interface PerformanceReportData {
  /** Report type identifier */
  eventType: 'performance';

  /** Performance metrics */
  metrics: PerformanceMetrics;
}

/**
 * Behavior report data
 */
export interface BehaviorReportData {
  /** Report type identifier */
  eventType: 'behavior';

  /** Behavior data */
  behavior: Record<string, any>;
}

/**
 * Web Vitals metrics
 */
export interface PerformanceMetrics {
  /** Largest Contentful Paint (ms) */
  LCP?: number;

  /** First Input Delay (ms) */
  FID?: number;

  /** First Contentful Paint (ms) */
  FCP?: number;

  /** Time to First Byte (ms) */
  TTFB?: number;

  /** Cumulative Layout Shift (score) */
  CLS?: number;

  /** First Paint (ms) */
  FP?: number;

  /** Time to Interactive (ms) */
  TTI?: number;

  /** Total blocking time (ms) */
  TBT?: number;

  /** Speed Index */
  SI?: number;

  /** Frame rate (FPS) */
  FPS?: number;

  /** Page load time (ms) */
  loadTime?: number;

  /** DNS lookup time (ms) */
  dnsTime?: number;

  /** TCP connection time (ms) */
  tcpTime?: number;

  /** SSL/TLS negotiation time (ms) */
  sslTime?: number;

  /** Request time (ms) */
  requestTime?: number;

  /** Response time (ms) */
  responseTime?: number;

  /** DOM processing time (ms) */
  domProcessingTime?: number;

  /** Resource load time (ms) */
  resourceLoadTime?: number;
}

/**
 * Queue task function type
 */
export type QueueTaskFn = () => void;

/**
 * Generic callback type
 */
export type Callback = (...args: any[]) => any;

/**
 * Any object type for flexible data structures
 */
export type AnyObject = Record<string, any>;
