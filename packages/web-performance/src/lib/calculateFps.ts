import { roundByFour } from '../utils'

/**
 * 采样 FPS：每秒结算一次帧数，采满 count 个样本后取平均。
 *
 * 三个易错点（encode 旧实现都踩了）：
 *  1. 计时必须用 performance.now()（单调高精度），不能用 Date.now()
 *     ——后者毫秒精度低，且系统时钟会因 NTP 校时回跳，可能算出负值或异常 fps。
 *  2. 后台 tab 时浏览器会暂停/节流 requestAnimationFrame，calculate 不再被调用，
 *     若不处理，Promise 会永久 pending。这里在页面隐藏时主动结算已采样本。
 *  3. 停止条件用 >= count，避免多采一个样本（off-by-one）。
 *
 * @param count 采样次数（如 5 = 采 5 个「每秒帧数」取平均）
 */
const calculateFps = (count: number): Promise<number> => {
  return new Promise((resolve) => {
    let frame = 0
    let lastFrameTime = performance.now()
    const fpsQueue: number[] = []
    let timerId = 0
    let settled = false

    const finish = (): void => {
      if (settled) return
      settled = true
      cancelAnimationFrame(timerId)
      document.removeEventListener('visibilitychange', onVisibility)
      const fps = fpsQueue.length
        ? roundByFour(fpsQueue.reduce((sum, f) => sum + f, 0) / fpsQueue.length, 2)
        : 0 // 隐藏时样本不足，记 0 表示「未采到有效 FPS」
      resolve(fps)
    }

    const onVisibility = (): void => {
      // 后台时 rAF 停摆，主动结算，避免 Promise 永久 pending
      if (document.visibilityState === 'hidden') finish()
    }

    const calculate = (): void => {
      const now = performance.now()
      frame += 1

      if (now >= lastFrameTime + 1000) {
        const fps = Math.round(frame / ((now - lastFrameTime) / 1000))
        fpsQueue.push(fps)
        frame = 0
        lastFrameTime = now

        if (fpsQueue.length >= count) {
          finish()
          return
        }
      }
      timerId = requestAnimationFrame(calculate)
    }

    document.addEventListener('visibilitychange', onVisibility)
    calculate()
  })
}

export default calculateFps
