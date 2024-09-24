import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useAsyncEffect } from './index'

describe('useAsyncEffect', () => {
  it('should call the async effect callback', async () => {
    const effectCallback = vi.fn().mockResolvedValue(undefined)

    renderHook(() => useAsyncEffect(effectCallback))

    // Wait for the async effect to complete
    await act(async () => {
      expect(effectCallback).toHaveBeenCalled()
    })
  })

  it('should call the async effect callback when mount with empty dependencies', async () => {
    const effectCallback = vi.fn().mockResolvedValue(undefined)

    renderHook(() => useAsyncEffect(effectCallback, []))

    // Wait for the async effect to complete
    await act(async () => {
      expect(effectCallback).toHaveBeenCalled()
    })
  })

  it('should call the async effect callback with dependencies', async () => {
    const effectCallback = vi.fn().mockResolvedValue(undefined)
    const dependencies = [1, 2, 3]

    renderHook(() => useAsyncEffect(effectCallback, dependencies))

    // Wait for the async effect to complete
    await act(async () => {
      expect(effectCallback).toHaveBeenCalled()
    })
  })

  it('should call the async effect when dependencies change', async () => {
    const effectCallback = vi.fn().mockResolvedValue(undefined)

    const deps = [1, 2, 3]

    const { rerender } = renderHook((deps) => useAsyncEffect(effectCallback, deps), {
      initialProps: deps,
    })

    // Wait for the async effect to complete
    await act(async () => {
      expect(effectCallback).toHaveBeenCalled()
    })

    const newDeps = [4, 5, 6]

    rerender(newDeps)

    // Wait for the async effect to complete
    await act(async () => {
      expect(effectCallback).toHaveBeenCalledTimes(2)
    })
  })
})
