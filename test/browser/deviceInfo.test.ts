import { describe, it, expect } from 'vitest'
import { parseUA } from '../../packages/browser/src/deviceInfo'

describe('parseUA', () => {
  it('识别 Chrome on Windows（桌面）', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    const r = parseUA(ua)
    expect(r.browser).toBe('chrome')
    expect(r.browserVersion).toBe('120.0.0.0')
    expect(r.os).toBe('windows')
    expect(r.deviceType).toBe('desktop')
  })

  it('识别 Edge（须先于 Chrome 命中）', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    expect(parseUA(ua).browser).toBe('edge')
  })

  it('识别 Safari on macOS', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
    const r = parseUA(ua)
    expect(r.browser).toBe('safari')
    expect(r.browserVersion).toBe('17.0')
    expect(r.os).toBe('mac')
    expect(r.deviceType).toBe('desktop')
  })

  it('识别 iPhone（iOS / mobile）', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'
    const r = parseUA(ua)
    expect(r.os).toBe('ios')
    expect(r.deviceType).toBe('mobile')
  })

  it('识别 Android Chrome（mobile）', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    const r = parseUA(ua)
    expect(r.browser).toBe('chrome')
    expect(r.os).toBe('android')
    expect(r.deviceType).toBe('mobile')
  })

  it('识别 Firefox', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
    expect(parseUA(ua).browser).toBe('firefox')
  })

  it('空 UA 返回空对象（不抛错）', () => {
    expect(parseUA('')).toEqual({})
  })
})
