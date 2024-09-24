import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFps } from './index'

describe('useFps', () => {
  let originalPerformanceNow: () => number

  beforeEach(() => {
    originalPerformanceNow = performance.now
    performance.now = vi.fn(() => Date.now())
  })

  afterEach(() => {
    performance.now = originalPerformanceNow
  })

  it('should return initial fps as 0', () => {
    const { result } = renderHook(() => useFps())
    expect(result.current.fps).toBe(0)
  })

  it('should calculate fps correctly', async () => {
    const { result } = renderHook(() => useFps({ every: 1 }))

    act(() => {
      // Simulate frame updates
      for (let i = 0; i < 10; i++) {
        performance.now = vi.fn(() => Date.now() + i * 100)
        act(() => {
          // Trigger the RAF loop
          result.current.resume()
        })
      }
    })

    expect(result.current.fps).toBeGreaterThan(0)
  })

  it('should respect the every option', async () => {
    const { result } = renderHook(() => useFps({ every: 5 }))

    act(() => {
      for (let i = 0; i < 10; i++) {
        performance.now = vi.fn(() => Date.now() + i * 100)
        act(() => {
          result.current.resume()
        })
      }
    })

    expect(result.current.fps).toBeGreaterThan(0)
  })

  it('should not update fps if not enough frames', async () => {
    const { result } = renderHook(() => useFps({ every: 10 }))

    act(() => {
      for (let i = 0; i < 5; i++) {
        performance.now = vi.fn(() => Date.now() + i * 100)
        act(() => {
          result.current.resume()
        })
      }
    })

    expect(result.current.fps).toBe(0)
  })

  it('should handle pausing and resuming', async () => {
    const { result } = renderHook(() => useFps())

    act(() => {
      result.current.pause()
    })

    expect(result.current.fps).toBe(0)

    act(() => {
      result.current.resume()
    })

    expect(result.current.fps).toBe(0) // Should still be 0 until frames are counted
  })
})
