import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottledFn } from './index'

describe('useThrottledFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return a function', () => {
    const { result } = renderHook(() => useThrottledFn(vi.fn(), { wait: 100 }))
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should return a function that can be cancelled', () => {
    const { result } = renderHook(() => useThrottledFn(vi.fn(), { wait: 100 }))
    expect(result.current.cancel).toBeInstanceOf(Function)
  })

  it('should return a function that can be clear (deprecated alias of cancel)', () => {
    const { result } = renderHook(() => useThrottledFn(vi.fn(), { wait: 100 }))
    expect(result.current.clear).toBeInstanceOf(Function)
  })

  it('should return a function that can be flushed', () => {
    const { result } = renderHook(() => useThrottledFn(vi.fn(), { wait: 100 }))
    expect(result.current.flush).toBeInstanceOf(Function)
  })

  it('should call the throttled function with the correct arguments', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledFn(fn, { wait: 100 }))

    act(() => result.current(1, 2, 3))
    expect(fn).toHaveBeenCalledWith(1, 2, 3)
  })

  it('should throttle the function call based on the provided wait time', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledFn(fn, { wait: 100 }))

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    expect(fn).toHaveBeenCalledTimes(1) // leading call

    act(() => vi.advanceTimersByTime(120))
    expect(fn).toHaveBeenCalledTimes(2) // trailing call

    act(() => {
      result.current()
      result.current()
    })

    expect(fn).toHaveBeenCalledTimes(3) // leading call
    act(() => vi.advanceTimersByTime(120))
    expect(fn).toHaveBeenCalledTimes(4) // trailing call
  })

  it('should cancel the throttled function', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledFn(fn, { wait: 100 }))

    act(() => {
      result.current()
    })

    expect(fn).toHaveBeenCalledTimes(1)
    act(() => result.current.cancel())
    act(() => vi.advanceTimersByTime(120))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
