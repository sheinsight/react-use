import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWindowFocus } from './index'

describe('useWindowFocus', () => {
  let originalHasFocus: () => boolean

  beforeEach(() => {
    originalHasFocus = document.hasFocus
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.hasFocus = originalHasFocus
  })

  it('should return false when the window is not focused', () => {
    document.hasFocus = vi.fn(() => false)
    const { result } = renderHook(() => useWindowFocus())
    expect(result.current).toBe(false)
  })

  it('should return true when the window is focused', () => {
    document.hasFocus = vi.fn(() => true)
    const { result } = renderHook(() => useWindowFocus())
    expect(result.current).toBe(true)
  })

  it('should update state on focus event', () => {
    document.hasFocus = vi.fn(() => false)
    const { result } = renderHook(() => useWindowFocus())

    act(() => {
      window.dispatchEvent(new Event('focus'))
    })

    expect(result.current).toBe(true)
  })

  it('should update state on blur event', () => {
    document.hasFocus = vi.fn(() => true)
    const { result } = renderHook(() => useWindowFocus())

    act(() => {
      window.dispatchEvent(new Event('blur'))
    })

    expect(result.current).toBe(false)
  })

  it('should handle multiple focus and blur events', () => {
    document.hasFocus = vi.fn(() => false)
    const { result } = renderHook(() => useWindowFocus())

    act(() => {
      window.dispatchEvent(new Event('focus'))
    })
    expect(result.current).toBe(true)

    act(() => {
      window.dispatchEvent(new Event('blur'))
    })
    expect(result.current).toBe(false)

    act(() => {
      window.dispatchEvent(new Event('focus'))
    })
    expect(result.current).toBe(true)
  })
})
