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
      vi.advanceTimersByTime(16) // Simulate the passage of time for the next frame
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should clean up the animation frame on unmount', () => {
    const { result, unmount } = renderHook(() => useRafFn(callback))

    act(() => {
      result.current()
      unmount()
    })

    setTimeout(() => {
      expect(callback).toHaveBeenCalled()
    })
  })

  it('should not call the callback if unmounted before the next frame', () => {
    const { result, unmount } = renderHook(() => useRafFn(callback))

    act(() => {
      result.current()
      unmount()
    })

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1) // Should only be called once
    })
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
