import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useThrottledFn } from './index'

describe('useThrottledFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should call the throttled function with the correct arguments', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledFn(fn, { wait: 100 }))

    act(() => result.current(1, 2, 3))
    expect(fn).toHaveBeenCalledWith(1, 2, 3)
  })

  test('should throttle the function call based on the provided wait time', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledFn(fn, { wait: 100 }))

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    expect(fn).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(120))

    act(() => {
      result.current()
      result.current()
    })

    expect(fn).toHaveBeenCalledTimes(2)
    act(() => vi.advanceTimersByTime(120))
    expect(fn).toHaveBeenCalledTimes(3)
  })

  test('should clear the throttled function', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledFn(fn, { wait: 100 }))

    act(() => {
      result.current()
    })

    expect(fn).toHaveBeenCalledTimes(1)
    act(() => result.current.clear())
    act(() => vi.advanceTimersByTime(120))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
