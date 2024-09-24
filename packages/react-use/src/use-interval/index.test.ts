import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInterval } from './index'

describe('useInterval', () => {
  let interval: number

  beforeEach(() => {
    interval = 1000
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should start counting from 0', () => {
    const { result } = renderHook(() => useInterval(interval))

    expect(result.current).toBe(0)
  })

  it('should increment count on interval', () => {
    const { result } = renderHook(() => useInterval(interval))

    act(() => {
      vi.advanceTimersByTime(interval)
    })

    expect(result.current).toBe(1)
  })

  it('should call callback on each interval', async () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useInterval(interval, { callback }))

    act(() => {
      vi.advanceTimersByTime(interval)
    })

    expect(result.current).toBe(1)
    expect(callback).toHaveBeenCalledWith(0)
  })

  it('should reset count when reset is called', () => {
    const { result } = renderHook(() => useInterval(interval, { controls: true }))

    act(() => {
      vi.advanceTimersByTime(interval)
      result.current[1].reset()
    })

    expect(result.current[0]).toBe(0)
  })

  it('should expose controls when controls option is true', () => {
    const { result } = renderHook(() => useInterval(interval, { controls: true }))

    expect(result.current[1]).toHaveProperty('reset')
  })

  it('should not call callback if not provided', () => {
    const { result } = renderHook(() => useInterval(interval, { controls: true }))

    act(() => {
      vi.advanceTimersByTime(interval)
    })

    expect(() => result.current[1].reset()).not.toThrow()
  })
})
