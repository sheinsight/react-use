import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './index'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should count down correctly', () => {
    const future = new Date(Date.now() + 10000) // 10 seconds in the future
    const { result } = renderHook(() => useCountdown(future))

    expect(result.current).toBeGreaterThan(9000)
    expect(result.current).toBeLessThanOrEqual(10000)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current).toBeGreaterThan(4000)
    expect(result.current).toBeLessThanOrEqual(6000)
  })

  it('should stop at zero', () => {
    const past = new Date(Date.now() - 1000) // 1 second in the past
    const { result } = renderHook(() => useCountdown(past))

    expect(result.current).toBe(0)
  })

  it('should update when date changes', () => {
    const initialDate = new Date(Date.now() + 5000)
    const { result, rerender } = renderHook(({ date }) => useCountdown(date), {
      initialProps: { date: initialDate },
    })

    expect(result.current).toBeGreaterThan(4000)
    expect(result.current).toBeLessThanOrEqual(5000)

    const newDate = new Date(Date.now() + 10000)
    rerender({ date: newDate })

    expect(result.current).toBeGreaterThan(9000)
    expect(result.current).toBeLessThanOrEqual(10000)
  })

  it('should respect immediate option', () => {
    const future = new Date(Date.now() + 10000)
    const { result } = renderHook(() => useCountdown(future, { immediate: false }))

    expect(result.current).toBe(10000)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe(10000)
  })

  it('should expose controls when requested', () => {
    const future = new Date(Date.now() + 10000)
    const { result } = renderHook(() => useCountdown(future, { controls: true }))

    expect(result.current).toHaveProperty('ms')
    expect(result.current).toHaveProperty('isStop')
    expect(result.current).toHaveProperty('pause')
    expect(result.current).toHaveProperty('resume')
  })

  it('should call onUpdate callback', () => {
    const future = new Date(Date.now() + 10000)
    const onUpdate = vi.fn()
    renderHook(() => useCountdown(future, { onUpdate }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onUpdate).toHaveBeenCalled()
    expect(onUpdate).toHaveBeenCalledWith(expect.any(Number), expect.any(Number))
  })

  it('should call onStop callback when countdown reaches zero', () => {
    const future = new Date(Date.now() + 1000)
    const onStop = vi.fn()
    renderHook(() => useCountdown(future, { onStop }))

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(onStop).toHaveBeenCalled()
  })

  it('should work with custom interval', () => {
    const future = new Date(Date.now() + 10000)
    const { result } = renderHook(() => useCountdown(future, { interval: 2000 }))

    expect(result.current).toBeGreaterThan(9000)
    expect(result.current).toBeLessThanOrEqual(10000)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current).toBeGreaterThan(7000)
    expect(result.current).toBeLessThanOrEqual(8000)
  })

  it('should handle date as a function', () => {
    const getDate = () => new Date(Date.now() + 5000)
    const { result } = renderHook(() => useCountdown(getDate))

    expect(result.current).toBeGreaterThan(4000)
    expect(result.current).toBeLessThanOrEqual(5000)
  })

  it('should handle nullish date', () => {
    const { result } = renderHook(() => useCountdown(null))

    expect(result.current).toBe(0)
  })

  it('should handle date change', () => {
    const { result, rerender } = renderHook(({ date }) => useCountdown(date), {
      initialProps: { date: new Date(Date.now() + 5000) as Date | null },
    })

    expect(result.current).toBeGreaterThan(4000)
    expect(result.current).toBeLessThanOrEqual(5000)

    rerender({ date: null })

    expect(result.current).toBe(0)
  })
})
