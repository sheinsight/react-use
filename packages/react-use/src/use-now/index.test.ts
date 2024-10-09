import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNow } from './index'

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the current date by default', () => {
    const { result } = renderHook(() => useNow())
    const now = new Date()
    expect(result.current).toBeInstanceOf(Date)
    expect(result.current.getTime()).toBeCloseTo(now.getTime(), -1)
  })

  it('should update the date at the specified interval', () => {
    const { result } = renderHook(() => useNow({ interval: 1000 }))
    const initialNow = result.current

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.getTime()).toBeGreaterThan(initialNow.getTime())
  })

  it('should call the callback function on each update', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useNow({ callback, interval: 1000 }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should expose controls when controls option is true', () => {
    const { result } = renderHook(() => useNow({ controls: true }))
    expect(result.current).toHaveProperty('now')
    expect(result.current).toHaveProperty('pause')
    expect(result.current).toHaveProperty('resume')
  })

  it('should not expose controls when controls option is false', () => {
    const { result } = renderHook(() => useNow({ controls: false }))
    expect(result.current).toBeInstanceOf(Date)
    expect(result.current).not.toHaveProperty('pause')
    expect(result.current).not.toHaveProperty('resume')
  })

  it('should handle requestAnimationFrame as interval', () => {
    const { result } = renderHook(() => useNow({ interval: 'requestAnimationFrame' }))
    const initialNow = result.current

    act(() => {
      vi.advanceTimersByTime(16) // Simulate a frame
    })

    expect(result.current.getTime()).toBeGreaterThan(initialNow.getTime())
  })
})
