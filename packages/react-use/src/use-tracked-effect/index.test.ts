import { renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTrackedEffect } from './index'

describe('useTrackedEffect', () => {
  let callback: Mock

  beforeEach(() => {
    callback = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should call callback when dependencies change', () => {
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(callback, deps), {
      initialProps: { deps: [1, 2] },
    })

    rerender({ deps: [1, 3] })
    expect(callback).toHaveBeenCalledWith([0, 1], undefined, [1, 3])
  })

  it('should not call callback when dependencies do not change', () => {
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(callback, deps), {
      initialProps: { deps: [1, 2] },
    })

    rerender({ deps: [1, 2] })
    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle undefined dependencies', () => {
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(callback, deps), {
      initialProps: { deps: [0, 0] },
    })

    rerender({ deps: [1, 2] })
    expect(callback).toHaveBeenCalledWith([0, 1], undefined, [1, 2])
  })

  it('should handle empty dependencies', () => {
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(callback, deps), {
      initialProps: { deps: [] },
    })

    rerender({ deps: [] })
    expect(callback).not.toHaveBeenCalled()
  })

  it('should call callback with correct indexes when multiple dependencies change', () => {
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(callback, deps), {
      initialProps: { deps: [1, 2, 3] },
    })

    rerender({ deps: [4, 2, 5] })
    expect(callback).toHaveBeenCalledWith([0, 1, 2], undefined, [4, 2, 5])
  })

  it('should handle multiple dependencies changing', () => {
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(callback, deps), {
      initialProps: { deps: [1, 2, 3] },
    })

    rerender({ deps: [4, 5, 6] })
    expect(callback).toHaveBeenCalledWith([0, 1, 2], undefined, [4, 5, 6])
  })
})

describe('useTrackedEffect', () => {
  it('should detect changed dependencies', () => {
    const callback = vi.fn()

    const { rerender } = renderHook(({ deps }) => useTrackedEffect(callback, deps), {
      initialProps: { deps: [1, 2, 3] as number[] | undefined },
    })

    rerender({ deps: [1, 2, 4] })
    rerender({ deps: [3, 3, 4] })

    expect(callback).toHaveBeenLastCalledWith([0, 1], [1, 2, 4], [3, 3, 4])
  })
})
