import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAsyncUpdateEffect } from './index'

describe('useAsyncUpdateEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not run effect on initial render', async () => {
    const effect = vi.fn()
    renderHook(() => useAsyncUpdateEffect(effect))

    expect(effect).not.toHaveBeenCalled()
  })

  it('should run effect on subsequent renders', async () => {
    const effect = vi.fn()
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender } = renderHook(({ dep }) => useAsyncUpdateEffect(effect, [dep]), {
      initialProps: { dep: 0 },
    })

    expect(effect).not.toHaveBeenCalled()

    await act(async () => {
      rerender({ dep: 1 })
    })

    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('should pass isCancelled function to effect', async () => {
    let isCancelledFn: (() => boolean) | undefined

    const effect = vi.fn((isCancelled) => {
      isCancelledFn = isCancelled
    })

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender, unmount } = renderHook(({ dep }) => useAsyncUpdateEffect(effect, [dep]), {
      initialProps: { dep: 0 },
    })

    await act(async () => {
      rerender({ dep: 1 })
    })

    expect(isCancelledFn).toBeDefined()
    expect(isCancelledFn?.()).toBe(false)

    unmount()

    expect(isCancelledFn?.()).toBe(true)
  })

  it('should handle async effects correctly', async () => {
    const asyncEffect = vi.fn(async (isCancelled) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!isCancelled()) {
        // Perform some async operation
      }
    })

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender, unmount } = renderHook(({ dep }) => useAsyncUpdateEffect(asyncEffect, [dep]), {
      initialProps: { dep: 0 },
    })

    await act(async () => {
      rerender({ dep: 1 })
      vi.advanceTimersByTime(50)
    })

    expect(asyncEffect).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    unmount()

    // Ensure the effect was called and completed
    expect(asyncEffect).toHaveBeenCalledTimes(1)
  })

  it('should cancel previous effect when dependencies change', async () => {
    const effectResults: string[] = []
    const asyncEffect = vi.fn(async (isCancelled) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!isCancelled()) {
        effectResults.push('effect completed')
      }
    })

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender } = renderHook(({ dep }) => useAsyncUpdateEffect(asyncEffect, [dep]), {
      initialProps: { dep: 0 },
    })

    await act(async () => {
      rerender({ dep: 1 })
      vi.advanceTimersByTime(50)
    })

    await act(async () => {
      rerender({ dep: 2 })
      vi.advanceTimersByTime(150)
    })

    expect(asyncEffect).toHaveBeenCalledTimes(2)
    expect(effectResults).toHaveLength(1)
    expect(effectResults[0]).toBe('effect completed')
  })

  it('should not run effect if unmounted before completion', async () => {
    const effectResults: string[] = []
    const asyncEffect = vi.fn(async (isCancelled) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!isCancelled()) {
        effectResults.push('effect completed')
      }
    })

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const { rerender, unmount } = renderHook(({ dep }) => useAsyncUpdateEffect(asyncEffect, [dep]), {
      initialProps: { dep: 0 },
    })

    await act(async () => {
      rerender({ dep: 1 })
      vi.advanceTimersByTime(50)
    })

    unmount()

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(asyncEffect).toHaveBeenCalledTimes(1)
    expect(effectResults).toHaveLength(0)
  })
})
