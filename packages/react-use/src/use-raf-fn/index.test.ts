import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRafFn } from './index'

describe('useRafFn', () => {
  let callback: Mock

  beforeEach(() => {
    callback = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call the callback on the next animation frame', () => {
    const { result } = renderHook(() => useRafFn(callback))

    act(() => {
      result.current()
      vi.advanceTimersToNextFrame()
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should clean up the animation frame on unmount', () => {
    const { result, unmount } = renderHook(() => useRafFn(callback))

    act(() => {
      result.current()
      unmount()
    })
    act(() => {
      vi.advanceTimersToNextFrame()
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should fallback to pure callback if requestAnimationFrame is not available', () => {
    const originalRequestAnimationFrame = window.requestAnimationFrame

    // @ts-ignore
    // biome-ignore lint/performance/noDelete: <explanation>
    delete window.requestAnimationFrame

    const { result } = renderHook(() => useRafFn(callback))

    act(() => {
      result.current()
    })

    expect(callback).toHaveBeenCalled()

    // Restore original requestAnimationFrame
    window.requestAnimationFrame = originalRequestAnimationFrame
  })
})
