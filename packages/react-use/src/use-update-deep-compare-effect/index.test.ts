import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUpdateDeepCompareEffect } from './index'

describe('useUpdateDeepCompareEffect', () => {
  let effectFn: Mock

  beforeEach(() => {
    effectFn = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not call effect on initial render', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: for test
    renderHook(() => useUpdateDeepCompareEffect(effectFn, [1]))
    expect(effectFn).not.toHaveBeenCalled()
  })

  it('should call effect on subsequent renders with different dependencies', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: for test
    const { result, rerender } = renderHook(({ count }) => useUpdateDeepCompareEffect(effectFn, [count]), {
      initialProps: { count: 1 },
    })

    rerender({ count: 2 })
    expect(effectFn).toHaveBeenCalledTimes(1)
  })

  it('should not call effect when dependencies are the same', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: for test
    const { result, rerender } = renderHook(({ count }) => useUpdateDeepCompareEffect(effectFn, [count]), {
      initialProps: { count: 1 },
    })

    rerender({ count: 1 })
    expect(effectFn).not.toHaveBeenCalled()
  })

  it('should call effect when dependencies deeply change', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: for test
    const { result, rerender } = renderHook(({ obj }) => useUpdateDeepCompareEffect(effectFn, [obj]), {
      initialProps: { obj: { a: 1 } },
    })

    rerender({ obj: { a: 1 } }) // Same reference
    expect(effectFn).not.toHaveBeenCalled()

    rerender({ obj: { a: 2 } }) // Different reference
    expect(effectFn).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple dependencies', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: for test
    const { result, rerender } = renderHook(({ obj, count }) => useUpdateDeepCompareEffect(effectFn, [obj, count]), {
      initialProps: { obj: { a: 1 }, count: 1 },
    })

    rerender({ obj: { a: 1 }, count: 1 }) // No change
    expect(effectFn).not.toHaveBeenCalled()

    rerender({ obj: { a: 2 }, count: 1 }) // Change in obj
    expect(effectFn).toHaveBeenCalledTimes(1)

    rerender({ obj: { a: 2 }, count: 2 }) // Change in count
    expect(effectFn).toHaveBeenCalledTimes(2)
  })
})
