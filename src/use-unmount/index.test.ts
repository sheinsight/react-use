import { renderHook, renderHookServer } from '@/test'
import { describe, expect, test, vi } from 'vitest'
import { useUnmount } from './index'

describe('useUnmount', () => {
  test('should call the callback function when the component unmounts', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useUnmount(callback))

    expect(callback).not.toHaveBeenCalled()
    unmount()
    expect(callback).toHaveBeenCalled()
  })

  test('should not call the callback function when in SSR', () => {
    const callback = vi.fn()
    renderHookServer(() => useUnmount(callback))
    expect(callback).not.toHaveBeenCalled()
  })

  test('should not call the callback function if no callback is provided', () => {
    const { unmount } = renderHook(() => useUnmount())

    // No callback provided, so it should not be called
    expect(unmount).not.toThrow()
  })

  test('should not call the callback function if the callback is null', () => {
    const { unmount } = renderHook(() => useUnmount(null))

    // Null callback provided, so it should not be called
    expect(unmount).not.toThrow()
  })

  test('should not call the callback function if the callback is undefined', () => {
    const { unmount } = renderHook(() => useUnmount(undefined))

    // Undefined callback provided, so it should not be called
    expect(unmount).not.toThrow()
  })

  test('should not call the callback function if the callback is false', () => {
    const { unmount } = renderHook(() => useUnmount(false))

    // False callback provided, so it should not be called
    expect(unmount).not.toThrow()
  })
})
