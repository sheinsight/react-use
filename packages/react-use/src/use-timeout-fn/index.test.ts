import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimeoutFn } from './index'

describe('useTimeoutFn', () => {
  let callback: Mock
  let interval: number

  beforeEach(() => {
    vi.useFakeTimers()
    callback = vi.fn()
    interval = 100
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should call the callback after the specified interval', async () => {
    const { result } = renderHook(() => useTimeoutFn(callback, interval))

    await act(async () => {
      result.current.resume()
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not call the callback if paused', async () => {
    const { result } = renderHook(() => useTimeoutFn(callback, interval))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.pause()
      result.current.resume()
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should clear the timer when clearTimer is called', async () => {
    const { result } = renderHook(() => useTimeoutFn(callback, interval))

    await act(async () => {
      result.current.pause()
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('should call the callback immediately if immediate is true', async () => {
    renderHook(() => useTimeoutFn(callback, interval, { immediate: true }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(callback).toHaveBeenCalledTimes(0)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should update on end if updateOnEnd is true', async () => {
    const { result } = renderHook(() => useTimeoutFn(callback, interval, { updateOnEnd: true }))

    await act(async () => {
      result.current.resume()
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple calls correctly', async () => {
    const { result } = renderHook(() => useTimeoutFn(callback, interval))

    await act(async () => {
      result.current.resume()
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.resume()
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(interval + 50)
    })

    expect(callback).toHaveBeenCalledTimes(2)
  })
})
