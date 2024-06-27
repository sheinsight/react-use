import { renderHook, act } from '@/test'
import { useCountdown } from './index'
import { describe, expect, test, vi } from 'vitest'

describe('useCountdown', () => {
  test('should start the countdown immediately by default', () => {
    const { result } = renderHook(() => useCountdown(Date.now() + 1_000))
    expect(result.current).toBeGreaterThan(0)
  })

  test('should start the countdown immediately when immediate option is true', () => {
    const { result } = renderHook(() => useCountdown(Date.now() + 1_000, { immediate: true }))
    expect(result.current).toBeGreaterThan(0)
  })

  test('should not start the countdown immediately when immediate option is false', () => {
    const { result } = renderHook(() => useCountdown(Date.now() + 1_000, { immediate: false }))
    expect(result.current).toBe(1000)
    const util = vi.useFakeTimers()
    act(() => util.advanceTimersByTime(1000))
    expect(result.current).toBe(1000)
  })

  test('should update the countdown when the date changes', () => {
    const { result } = renderHook(({ date }) => useCountdown(date), {
      initialProps: { date: Date.now() + 1_000 },
    })
    const initialCountdown = result.current
    const util = vi.useFakeTimers()
    act(() => util.advanceTimersByTime(100))
    expect(result.current).toBeLessThan(initialCountdown)
  })

  test('should call onUpdate callback when the countdown is updated', () => {
    const onUpdate = vi.fn()
    renderHook(() => useCountdown(Date.now() + 1_000, { onUpdate }))
    act(() => vi.advanceTimersByTime(1000))
    expect(onUpdate).toHaveBeenCalledWith(expect.any(Number), expect.any(Number))
  })

  test('should call onStop callback when the countdown is stopped', () => {
    const onStop = vi.fn()
    renderHook(() => useCountdown(Date.now() + 1_000, { onStop, controls: true }))
    act(() => vi.advanceTimersByTime(2000))
    expect(onStop).toHaveBeenCalled()
  })
})
