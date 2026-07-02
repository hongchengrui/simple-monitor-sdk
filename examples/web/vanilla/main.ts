/**
 * M1 端到端 Demo 入口
 *
 * 初始化监控，并把按钮触发的错误函数挂到 window 上供 onclick 调用。
 */
import { init } from '@simple-monitor/web'

// 指向 examples/server mock 服务端
init({
  dsn: 'http://localhost:3000/report',
  apikey: 'demo-apikey',
  debug: true,
})

// 把触发函数挂到 window，供 index.html 的 onclick 调用
Object.assign(window, {
  throwSyncError() {
    throw new Error('boom: 同步错误')
  },
  throwInTimeout() {
    setTimeout(() => {
      throw new Error('boom: setTimeout 内错误')
    }, 0)
  },
  loadBadImage() {
    const img = new Image()
    img.src = 'https://example.invalid/this-image-does-not-exist.png'
    document.body.appendChild(img)
  },
  triggerMany() {
    // 连续抛 3 次相同错误，验证 maxDuplicateCount 去重
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        throw new Error('boom: 重复错误')
      }, i * 50)
    }
  },
  rejectError() {
    // Promise reject 一个 Error → PROMISE_ERROR
    Promise.reject(new Error('boom: promise rejection (Error)'))
  },
  rejectString() {
    // Promise reject 一个字符串 → 验证非 Error 原因也能规范化上报
    Promise.reject('boom: promise rejection (string)')
  },
  fetchOk() {
    // 正常 2xx 请求：只进面包屑，不上报
    fetch('http://localhost:3000/api/ok').catch(() => {})
  },
  fetchError() {
    // 5xx 请求 → 上报 FETCH_ERROR
    fetch('http://localhost:3000/api/error').catch(() => {})
  },
  xhrError() {
    // 5xx XHR → 上报 FETCH_ERROR
    const x = new XMLHttpRequest()
    x.open('GET', 'http://localhost:3000/api/error')
    x.send()
  },
  fetchFail() {
    // 不存在的域名 → status 0（跨域/失败）→ 上报 FETCH_ERROR
    fetch('https://example.invalid/api').catch(() => {})
  },
})
