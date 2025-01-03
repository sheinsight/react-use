import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePausableUpdateEffect } from './index'

describe('usePausableUpdateEffect', () => {
  let callback: Mock

  beforeEach(() => {
    callback = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should ignore first render', () => {
    renderHook(() => usePausableUpdateEffect(callback, []))

    expect(callback).not.toHaveBeenCalled()
  })

  it('should not call the effect when resume & no deps', () => {
    const { result } = renderHook(() => usePausableUpdateEffect(callback, []))

    act(() => result.current.resume())

    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('should resume calling the effect when dep changed', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender } = renderHook(({ count }) => usePausableUpdateEffect(callback, [count]), {
      initialProps: { count: 1 },
    })

    rerender({ count: 2 })

    expect(callback).toHaveBeenCalled()
  })

  it('should not trigger effect when paused', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { result, rerender } = renderHook(({ count }) => usePausableUpdateEffect(callback, [count]), {
      initialProps: { count: 1 },
    })

    act(() => {
      result.current.pause()
    })

    rerender({ count: 2 })

    expect(callback).toHaveBeenCalledTimes(0)

    rerender({ count: 3 })

    expect(callback).toHaveBeenCalledTimes(0)

    act(() => {
      result.current.resume()
    })

    rerender({ count: 4 })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple calls to pause and resume', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { result, rerender } = renderHook(({ count }) => usePausableUpdateEffect(callback, [count]), {
      initialProps: { count: 0 },
    })

    act(() => {
      result.current.pause()
      result.current.resume()
      result.current.pause()
    })

    expect(callback).not.toHaveBeenCalled()

    rerender({ count: 1 })

    expect(callback).not.toHaveBeenCalled()

    rerender({ count: 2 })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      result.current.resume()
    })

    expect(callback).not.toHaveBeenCalled()

    rerender({ count: 3 })

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
