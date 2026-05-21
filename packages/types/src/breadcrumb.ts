import { Severity } from './Severity'
import { BreadCrumbTypes } from './eventTypes'
import { ReportDataType } from './transportData'
import { IRouter, TriggerConsole } from './replace'
import { TNumStrObj } from './common'

export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: BreadCrumbTypes
  data: ReportDataType | IRouter | TriggerConsole | TNumStrObj
  category?: string
  time?: number
  level: Severity
}

export interface IBreadcrumb {
  stack: BreadcrumbPushData[]
  maxBreadcrumbs: number
  beforePushBreadcrumb: unknown
  push(data: BreadcrumbPushData): void
  immediatePush(data: BreadcrumbPushData): void
  shift(): boolean
  clear(): void
  getStack(): BreadcrumbPushData[]
  bindOptions(options?: any): void
}
