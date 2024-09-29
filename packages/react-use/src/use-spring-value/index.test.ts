import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSpringValue } from './index'

describe('useSpringValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with the correct start value', () => {
    const { result } = renderHook(() => useSpringValue(0, 100))
    expect(result.current.value).toBe(0)
  })

  it('should animate towards the end value', () => {
    const { result } = renderHook(() => useSpringValue(0, 100))

    act(() => {
      vi.advanceTimersByTime(1000) // Simulate time passing
    })

    expect(result.current.value).toBeGreaterThan(0)
    expect(result.current.value).toBeLessThan(100)
  })

  it('should restart the spring correctly', () => {
    const { result } = renderHook(() => useSpringValue(0, 100))

    act(() => {
      vi.advanceTimersByTime(1000) // Simulate time passing
    })

    act(() => {
      result.current.restart()
    })

    expect(result.current.value).toBe(0)
  })

  it('should handle custom config values', () => {
    const { result } = renderHook(() => useSpringValue(0, 100, { stiffness: 300, damping: 20 }))

    act(() => {
      vi.advanceTimersByTime(1000) // Simulate time passing
    })

    expect(result.current.value).toBeGreaterThan(0)
  })
})
