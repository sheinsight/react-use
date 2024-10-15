import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWindowSize } from './index'

describe('useWindowSize', () => {
  let originalInnerWidth: number
  let originalInnerHeight: number
  let originalMatchMedia: typeof window.matchMedia

  const mockMatchMedia = vi.fn()

  beforeEach(() => {
    mockMatchMedia.mockReturnValue({ matches: false })
    originalMatchMedia = window.matchMedia
    window.matchMedia = mockMatchMedia
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
  })

  afterEach(() => {
    mockMatchMedia.mockReset()
    window.matchMedia = originalMatchMedia
    window.innerWidth = originalInnerWidth
    window.innerHeight = originalInnerHeight
  })

  it('should return initial size', () => {
    window.innerWidth = 1600
    window.innerHeight = 800

    const { result } = renderHook(() => useWindowSize())
    expect(result.current.width).toBe(1600)
    expect(result.current.height).toBe(800)
  })

  it('should update size on window resize', () => {
    const { result } = renderHook(() => useWindowSize())
    act(() => {
      window.innerWidth = 1024
      window.innerHeight = 768
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
  })

  it('should include scrollbar width when specified', () => {
    const { result } = renderHook(() => useWindowSize({ includeScrollbar: true }))
    act(() => {
      window.innerWidth = 1200
      window.innerHeight = 800
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(1200)
    expect(result.current.height).toBe(800)
  })

  it('should not include scrollbar width when specified', () => {
    const { result } = renderHook(() => useWindowSize({ includeScrollbar: false }))
    act(() => {
      window.innerWidth = 1200
      window.innerHeight = 800
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(document.documentElement.clientWidth)
    expect(result.current.height).toBe(document.documentElement.clientHeight)
  })

  it('should update on orientation change', () => {
    const { result } = renderHook(() => useWindowSize({ listenOrientation: true }))
    act(() => {
      window.innerWidth = 800
      window.innerHeight = 600
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)

    act(() => {
      window.dispatchEvent(new Event('orientationchange'))
    })
    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)
  })

  it('should not handle portrait orientation when disabled', () => {
    mockMatchMedia.mockReturnValue({ matches: true })
    const { result } = renderHook(() => useWindowSize({ listenOrientation: false }))
    act(() => {
      window.innerWidth = 600
      window.innerHeight = 800
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(600)
    expect(result.current.height).toBe(800)
  })
})
