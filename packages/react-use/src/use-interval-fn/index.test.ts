import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIntervalFn } from './index'

describe('useIntervalFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call the callback at the specified interval', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useIntervalFn(callback, 1000))

    act(() => {
      result.current.resume()
    })

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should not call the callback if interval is 0', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useIntervalFn(callback, 0))

    act(() => {
      result.current.resume()
    })

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('should call the callback immediately if immediateCallback is true', async () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useIntervalFn(callback, 1000, { immediateCallback: true }))

    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.resume()
    })

    expect(callback).toHaveBeenCalledTimes(2)

    await act(async () => {
      vi.advanceTimersByTime(1200)
    })

    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('should not call the callback immediately if immediate is false', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useIntervalFn(callback, 1000, { immediate: false }))

    expect(callback).toHaveBeenCalledTimes(0)

    act(() => {
      result.current.resume()
    })

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should clear the interval when paused', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useIntervalFn(callback, 1000))

    act(() => {
      result.current.resume()
    })

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.pause()
    })

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle requestAnimationFrame interval', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useIntervalFn(callback, 'requestAnimationFrame'))

    act(() => {
      result.current.resume()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(callback).toHaveBeenCalled()
  })
})
