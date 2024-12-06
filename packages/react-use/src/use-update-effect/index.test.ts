import { renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUpdateEffect } from './index'

describe('useUpdateEffect', () => {
  let effect: Mock

  beforeEach(() => {
    effect = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not call effect on initial render', () => {
    renderHook(() => useUpdateEffect(effect))

    expect(effect).not.toHaveBeenCalled()
  })

  it('should call effect on subsequent renders', () => {
    const { rerender } = renderHook(() => useUpdateEffect(effect))

    rerender()
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('should call effect when dependencies change', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender } = renderHook(({ count }) => useUpdateEffect(effect, [count]), {
      initialProps: { count: 0 },
    })

    rerender({ count: 1 })
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('should not call effect if dependencies do not change', () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender } = renderHook(({ count }) => useUpdateEffect(effect, [count]), {
      initialProps: { count: 0 },
    })

    rerender({ count: 0 })
    expect(effect).not.toHaveBeenCalled()
  })

  it('should call effect multiple times on multiple updates', () => {
    const { rerender } = renderHook(() => useUpdateEffect(effect), {
      initialProps: { count: 0 },
    })

    rerender({ count: 1 })
    rerender({ count: 2 })
    expect(effect).toHaveBeenCalledTimes(2)
  })
})
