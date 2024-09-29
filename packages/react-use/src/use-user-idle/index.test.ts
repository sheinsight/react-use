import { act, renderHook } from '@/test'
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserIdle } from './index'

describe('useUserIdle', () => {
  let mockHidden: MockInstance
  let originalDateNow: () => number

  beforeEach(() => {
    mockHidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    vi.useFakeTimers()
    originalDateNow = Date.now
    Date.now = vi.fn(() => 1000)
  })

  afterEach(() => {
    vi.useRealTimers()
    Date.now = originalDateNow
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserIdle())
    expect(result.current.isIdle).toBe(false)
    expect(result.current.lastActive).toBe(1000)
  })

  it('should set isIdle to true after timeout', () => {
    const { result } = renderHook(() => useUserIdle(2000))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.isIdle).toBe(true)
  })

  it('should reset idle state on user activity', () => {
    const { result } = renderHook(() => useUserIdle(2000))
    act(() => {
      result.current.reset()
    })
    expect(result.current.isIdle).toBe(false)
    expect(result.current.lastActive).toBe(1000)
  })

  it('should update lastActive timestamp on reset when `updateTimestamp` is true', async () => {
    const { result } = renderHook(() => useUserIdle(2000))
    await act(async () => {
      Date.now = vi.fn(() => 2000)
      result.current.reset(true, true)
      await vi.advanceTimersByTimeAsync(3000)
    })
    expect(result.current.lastActive).toBe(2000)
  })

  it('should handle visibility change', () => {
    const { result } = renderHook(() => useUserIdle(2000, { watchVisibility: true }))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.isIdle).toBe(true)
    act(() => {
      mockHidden.mockReturnValue(false)
      result.current.reset()
    })
    expect(result.current.isIdle).toBe(false)
  })

  it('should respect immediate option', () => {
    const { result } = renderHook(() => useUserIdle(2000, { immediate: false }))
    expect(result.current.isIdle).toBe(false)
  })
})
