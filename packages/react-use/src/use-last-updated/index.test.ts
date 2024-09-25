import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLastUpdated } from './index'

describe('useLastUpdated', () => {
  let currentTime: number

  beforeEach(() => {
    currentTime = Date.now()
    vi.useFakeTimers()
    vi.setSystemTime(currentTime)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return null when no initial value is provided', () => {
    const { result } = renderHook(() => useLastUpdated({}))
    expect(result.current).toBeNull()
  })

  it('should return initial value when provided', () => {
    const { result } = renderHook(() => useLastUpdated({}, { initialValue: currentTime }))
    expect(result.current).toBe(currentTime)
  })

  it('should update timestamp on source change', () => {
    const { result, rerender } = renderHook(({ source }) => useLastUpdated(source), {
      initialProps: { source: {} },
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    rerender({ source: {} })
    expect(result.current).toBe(currentTime + 1000)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    rerender({ source: { new: 'data' } })
    expect(result.current).toBe(currentTime + 2000)
  })

  it('should update timestamp if deep is false and source is the "same"', () => {
    const { result, rerender } = renderHook(({ source }) => useLastUpdated(source, { deep: false }), {
      initialProps: { source: {} },
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    rerender({ source: {} })
    expect(result.current).toBe(currentTime + 1000)
  })

  it('should be null if deep is true and source is the same', () => {
    const { result, rerender } = renderHook(({ source }) => useLastUpdated(source, { deep: true }), {
      initialProps: { source: {} },
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    rerender({ source: {} })
    expect(result.current).toBe(null)
  })

  it('should update timestamp with deep comparison', () => {
    const { result, rerender } = renderHook(({ source }) => useLastUpdated(source, { deep: true }), {
      initialProps: { source: { a: 1 } },
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    rerender({ source: { a: 1 } })
    expect(result.current).toBe(null)

    rerender({ source: { a: 2 } })
    expect(result.current).toBe(currentTime + 1000)
  })
})
