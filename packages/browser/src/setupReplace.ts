/**
 * 采集编排（setupReplace）
 *
 * 把「采集器绑定（replace.ts）」和「处理器订阅（handleEvents.ts）」装配起来。
 * 顺序固定：先订阅（subscribeEvent，注册回调），再装采集器（addEventListener / replaceOld），
 * 否则先触发的事件没有回调可分发。
 */

import { getFlag } from '@simple-monitor/utils'
import { EventTypes } from '@simple-monitor/types'
import { listenError, listenUnhandledRejection, xhrReplace, fetchReplace } from './replace'
import {
  handleError,
  handleResourceError,
  handleUnhandledRejection,
  handleHttp,
} from './handleEvents'

/**
 * 安装全部采集器。
 * 每个采集器自身有 flag 幂等保护（subscribeEvent / silentFlag），可安全重复调用。
 */
export function setupReplace(): void {
  // 1. 先订阅处理器（注册回调到事件总线）
  handleError()
  handleResourceError()
  handleUnhandledRejection()
  handleHttp()

  // 2. 再绑定原生 API 采集器
  listenError()
  listenUnhandledRejection()
  xhrReplace()
  fetchReplace()
}

/**
 * 供外部查询某类采集是否被静默。
 */
export function isErrorSilent(): boolean {
  return getFlag(EventTypes.ERROR)
}
