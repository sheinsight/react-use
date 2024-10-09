import { act, renderHook } from '@/test'
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNetwork } from './index'

describe('useNetwork', () => {
  const mockOnLine: MockInstance = vi.spyOn(navigator, 'onLine', 'get')

  beforeEach(() => {
    mockOnLine.mockReturnValue(true)
  })

  afterEach(() => {
    mockOnLine.mockReset()
  })

  it('should update state when online', () => {
    const { result } = renderHook(() => useNetwork())
    act(() => {
      mockOnLine.mockReturnValue(true)
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current.isOnline).toBe(true)
  })

  it('should update state when offline', () => {
    const { result } = renderHook(() => useNetwork())
    act(() => {
      mockOnLine.mockReturnValue(false)
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current.isOnline).toBe(false)
  })

  it('should handle fake timers correctly', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useNetwork())

    act(() => {
      mockOnLine.mockReturnValue(false)
      window.dispatchEvent(new Event('offline'))
    })

    act(() => {
      vi.advanceTimersByTime(1000)
      mockOnLine.mockReturnValue(true)
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current.isOnline).toBe(true)
    vi.useRealTimers()
  })
})
