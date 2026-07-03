/**
 * Simple Monitor SDK - Vue Platform Adapter
 *
 * MonitorVue 插件：install 时重写 app.config.errorHandler（Vue3）/ Vue.config.errorHandler（Vue2），
 * 捕获组件 render / setup / 生命周期错误，封装为 VUE_ERROR 上报。
 *
 * 设计要点（路线图 3.2 决策）：
 *  - Vue2 + Vue3 双兼容（errorHandler 赋值方式一致，无需版本分支）
 *  - 组件名 best-effort：`<script setup>` 匿名导出拿不到 → 记 anonymous
 *  - 受 silentVue 开关控制；保留用户既有的 errorHandler，不吞错
 *  - 不 import vue 类型（peerDep，发布时声明；开发态用最小形状接口）
 */

import { ErrorTypes, EventTypes, BreadCrumbTypes, Severity } from '@simple-monitor/types'
import type { ReportDataType } from '@simple-monitor/types'
import { extractErrorStack, getFlag } from '@simple-monitor/utils'
import { transportData, breadcrumb } from '@simple-monitor/core'

/** Vue app / 构造器的最小形状（兼容 Vue2 Vue.config 与 Vue3 app.config） */
interface VueApp {
  config?: {
    errorHandler?: (err: unknown, instance: unknown, info: string) => unknown
  }
  version?: string
}

/** best-effort 提取组件名：拿不到记 anonymous */
function getComponentName(instance: unknown): string {
  if (!instance) return 'anonymous'
  const opts = (instance as { $options?: { name?: string; _componentTag?: string } })?.$options
  return opts?.name || opts?._componentTag || 'anonymous'
}

/** 把 Vue 错误封装为 VUE_ERROR 并上报 + 进面包屑 */
function reportVueError(err: unknown, instance: unknown, info: string): void {
  if (getFlag(EventTypes.VUE)) return // silentVue
  const parsed = extractErrorStack(err as Error, Severity.Normal) as ReportDataType | null
  if (!parsed) return
  parsed.type = ErrorTypes.VUE_ERROR
  ;(parsed as ReportDataType & { componentName?: string; propsData?: unknown }).componentName =
    getComponentName(instance)
  ;(parsed as ReportDataType & { propsData?: unknown }).propsData = info // 错误来源标记（render / setup hook / lifecycle）

  breadcrumb.push({
    type: BreadCrumbTypes.VUE,
    category: breadcrumb.getCategory(BreadCrumbTypes.VUE),
    data: { message: parsed.message, componentName: getComponentName(instance), info },
    level: Severity.Normal,
    time: parsed.time,
  })

  transportData.send(parsed)
}

export const MonitorVue = {
  install(app: VueApp): void {
    const config = app?.config
    if (!config) return
    const prev = config.errorHandler

    config.errorHandler = (err: unknown, instance: unknown, info: string): unknown => {
      // 采集失败不影响用户既有错误处理
      try {
        reportVueError(err, instance, info)
      } catch {
        /* noop */
      }
      // 保留用户自定义 errorHandler
      if (typeof prev === 'function') {
        return prev(err, instance, info)
      }
      // 无自定义：保持错误可见性（不吞错）
      console.error('[Vue error]', err)
      return undefined
    }
  },
}

export default MonitorVue
