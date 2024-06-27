import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useDebouncedFn } from './index'

describe('useDebouncedFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should debounce the function', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedFn(callback, { wait: 500 }))

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(500))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should clear the debounced function', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedFn(callback, { wait: 500 }))

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    expect(callback).toHaveBeenCalledTimes(0)
    act(() => result.current.clear())
    act(() => vi.advanceTimersByTime(500))
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
