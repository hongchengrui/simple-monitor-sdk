import { describe, it, expect, vi, afterEach } from 'vitest'
import createReporter from './lib/createReporter'

describe('createReporter（普通/紧急上报分流）', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('urgent=true：同步调 callback，不走 idle', () => {
    const idle = vi.fn()
    vi.stubGlobal('window', { requestIdleCallback: idle })
    const cb = vi.fn()
    const reporter = createReporter('s1', 'app1', 'v1', cb)

    reporter({ name: 'x', value: 1 }, true)

    expect(cb).toHaveBeenCalledTimes(1)
    expect(idle).not.toHaveBeenCalled()
    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: 's1',
        appId: 'app1',
        version: 'v1',
        data: { name: 'x', value: 1 },
      })
    )
    expect(typeof cb.mock.calls[0][0].timestamp).toBe('number')
  })

  it('urgent=false 且支持 idle：通过 requestIdleCallback 异步调', () => {
    const idle = vi.fn()
    vi.stubGlobal('window', { requestIdleCallback: idle })
    const cb = vi.fn()
    const reporter = createReporter('s1', 'app1', 'v1', cb)

    reporter({ name: 'x', value: 1 })

    // 走 idle，callback 尚未执行
    expect(idle).toHaveBeenCalledTimes(1)
    expect(idle).toHaveBeenCalledWith(expect.any(Function), { timeout: 3000 })
    expect(cb).not.toHaveBeenCalled()

    // 模拟浏览器触发 idle 回调
    const idleCallback = idle.mock.calls[0][0] as () => void
    idleCallback()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('urgent=false 且不支持 idle：同步降级调 callback', () => {
    vi.stubGlobal('window', {}) // 无 requestIdleCallback
    const cb = vi.fn()
    const reporter = createReporter('s1', 'app1', 'v1', cb)

    reporter({ name: 'x', value: 1 })

    expect(cb).toHaveBeenCalledTimes(1)
  })
})
