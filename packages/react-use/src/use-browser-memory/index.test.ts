import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useBrowserMemory } from './index'

describe('useBrowserMemory', () => {
  it('should defined', () => {
    expect(useBrowserMemory).toBeDefined()
  })

  it('should return initial state', async () => {
    const { result } = renderHook(() => useBrowserMemory())

    await act(async () => {})

    expect(result.current.isSupported).toBe(false)
    expect(result.current.memory).toBe(undefined)
    expect(result.current.jsHeapSizeLimit).toBe(0)
    expect(result.current.totalJSHeapSize).toBe(0)
    expect(result.current.usedJSHeapSize).toBe(0)
    expect(result.current.timestamp).toBeDefined()
  })

  it('should handle update', async () => {
    vi.useFakeTimers()
    // @ts-expect-error for test
    performance.memory = {
      jsHeapSizeLimit: 1,
      usedJSHeapSize: 2,
      totalJSHeapSize: 3,
    }

    const { result } = renderHook(() =>
      useBrowserMemory({
        interval: 1_000,
      }),
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_200)
    })

    expect(result.current.isSupported).toBe(true)

    expect(result.current.memory).toEqual({
      jsHeapSizeLimit: 1,
      usedJSHeapSize: 2,
      totalJSHeapSize: 3,
    })

    await act(async () => {
      result.current.update()
    })

    expect(result.current.jsHeapSizeLimit).toBe(1)
    expect(result.current.usedJSHeapSize).toBe(2)
    expect(result.current.totalJSHeapSize).toBe(3)
    expect(result.current.timestamp).toBeDefined()

    // @ts-expect-error for test
    // biome-ignore lint/performance/noDelete: for test
    delete performance.memory
    vi.useRealTimers()
  })
})
