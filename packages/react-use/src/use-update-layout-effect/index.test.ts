import { renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUpdateLayoutEffect } from './index'

describe('useUpdateLayoutEffect', () => {
  let effect: Mock

  beforeEach(() => {
    effect = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not call effect on initial render', () => {
    renderHook(() => useUpdateLayoutEffect(effect))
    expect(effect).not.toHaveBeenCalled()
  })

  it('should call effect on subsequent renders', () => {
    const { rerender } = renderHook(() => useUpdateLayoutEffect(effect))
    rerender()
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('should call effect after state change', () => {
    const { rerender } = renderHook(() => useUpdateLayoutEffect(effect), {
      initialProps: { count: 0 },
    })
    rerender({ count: 1 })
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('should handle cleanup function', () => {
    const cleanup = vi.fn()
    const { rerender } = renderHook(
      ({ count }) => {
        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        useUpdateLayoutEffect(() => {
          return cleanup
        }, [count])
      },
      { initialProps: { count: 0 } },
    )
    rerender({ count: 1 })
    expect(cleanup).toHaveBeenCalledTimes(0)
    rerender({ count: 2 })
    rerender({ count: 2 })
    rerender({ count: 2 })
    expect(cleanup).toHaveBeenCalledTimes(1)
    rerender({ count: 3 })
    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  it('should work with multiple effects', () => {
    const effect1 = vi.fn()
    const effect2 = vi.fn()
    const { rerender } = renderHook(() => {
      useUpdateLayoutEffect(effect1)
      useUpdateLayoutEffect(effect2)
    })
    rerender()
    expect(effect1).toHaveBeenCalledTimes(1)
    expect(effect2).toHaveBeenCalledTimes(1)
  })
})
