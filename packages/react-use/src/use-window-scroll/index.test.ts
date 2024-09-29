import { act, renderHook } from '@/test'
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWindowScroll } from './index'

describe('useWindowScroll', () => {
  let originalScrollTo: (options: ScrollToOptions) => void

  const initial = {
    x: 100,
    y: 200,
    scrollWidth: 2400,
    scrollHeight: 2400,
  }

  let mockScrollWidth: MockInstance
  let mockScrollHeight: MockInstance
  let mockScrollX: MockInstance
  let mockScrollY: MockInstance

  beforeEach(() => {
    window.innerHeight = 1000
    window.innerWidth = 1000
    mockScrollWidth = vi.spyOn(document.documentElement, 'scrollWidth', 'get').mockReturnValue(initial.scrollWidth)
    mockScrollHeight = vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(initial.scrollHeight)
    mockScrollX = vi.spyOn(window, 'scrollX', 'get').mockReturnValue(initial.x)
    mockScrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(initial.y)
    originalScrollTo = window.scrollTo
    window.scrollTo = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    // @ts-ignore
    window.scrollTo = originalScrollTo
    vi.useRealTimers()
    mockScrollHeight.mockReset()
    mockScrollWidth.mockReset()
    mockScrollX.mockReset()
    mockScrollY.mockReset()
  })

  it('should initialize with first render values', () => {
    const { result } = renderHook(() => useWindowScroll())

    expect(result.current).toEqual({
      x: initial.x,
      y: initial.y,
      maxX: initial.scrollWidth - window.innerWidth,
      maxY: initial.scrollHeight - window.innerHeight,
      scrollTo: expect.any(Function),
      scrollToTop: expect.any(Function),
      scrollToBottom: expect.any(Function),
      scrollToLeft: expect.any(Function),
      scrollToRight: expect.any(Function),
    })
  })

  it('should update state on scroll', async () => {
    const { result } = renderHook(() => useWindowScroll())

    await act(async () => {
      mockScrollX.mockReturnValue(120)
      mockScrollY.mockReturnValue(240)

      window.scrollTo(120, 240)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.x).toBe(120)
    expect(result.current.y).toBe(240)
  })

  it('should scroll to specified position', () => {
    const { result } = renderHook(() => useWindowScroll())

    act(() => {
      result.current.scrollTo({ x: 50, y: 75 })
    })

    expect(window.scrollTo).toHaveBeenCalledWith({ left: 50, top: 75, behavior: 'auto' })
  })

  it('should scroll to top', () => {
    const { result } = renderHook(() => useWindowScroll())

    act(() => {
      result.current.scrollToTop()
    })

    expect(window.scrollTo).toHaveBeenCalledWith({ left: initial.x, top: 0, behavior: 'auto' })
  })

  it('should scroll to bottom', () => {
    const { result } = renderHook(() => useWindowScroll())

    act(() => {
      result.current.scrollToBottom()
    })

    expect(window.scrollTo).toHaveBeenCalledWith({ left: initial.x, top: result.current.maxY, behavior: 'auto' })
  })

  it('should scroll to left', () => {
    const { result } = renderHook(() => useWindowScroll())

    act(() => {
      result.current.scrollToLeft()
    })

    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: result.current.y, behavior: 'auto' })
  })

  it('should scroll to right', () => {
    const { result } = renderHook(() => useWindowScroll())

    act(() => {
      result.current.scrollToRight()
    })

    expect(window.scrollTo).toHaveBeenCalledWith({ left: result.current.maxX, top: result.current.y, behavior: 'auto' })
  })

  it('should update maxX and maxY on resize', async () => {
    const { result } = renderHook(() => useWindowScroll())

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.maxX).toBeGreaterThan(0)
    expect(result.current.maxY).toBeGreaterThan(0)
  })
})
