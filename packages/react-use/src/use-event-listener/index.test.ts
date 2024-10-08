import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEventListener } from './index'

describe('useEventListener', () => {
  let target: any

  beforeEach(() => {
    target = document.createElement('div')
    document.body.appendChild(target)
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.removeChild(target)
    vi.useRealTimers()
  })

  it('should add event listener on mount and remove on unmount', async () => {
    const listener = vi.fn()
    const { unmount } = renderHook(() => useEventListener(() => target, 'click', listener))

    await act(async () => {
      target.dispatchEvent(new MouseEvent('click'))
    })

    expect(listener).toHaveBeenCalledTimes(1)

    unmount()

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
    })

    expect(listener).toHaveBeenCalledTimes(1) // Should not be called again
  })

  it('should handle multiple events', () => {
    const listener = vi.fn()
    const { unmount } = renderHook(() => useEventListener(() => target, ['click', 'mouseover'], listener))

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
      target.dispatchEvent(new MouseEvent('mouseover'))
    })

    expect(listener).toHaveBeenCalledTimes(2)

    unmount()

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
      target.dispatchEvent(new MouseEvent('mouseover'))
    })

    expect(listener).toHaveBeenCalledTimes(2) // Should not be called again
  })

  it('should work with custom target', () => {
    const listener = vi.fn()
    const { unmount } = renderHook(() => useEventListener(target, 'click', listener))

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
    })

    expect(listener).toHaveBeenCalledTimes(1)

    unmount()

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
    })

    expect(listener).toHaveBeenCalledTimes(1) // Should not be called again
  })

  it('should handle options correctly', () => {
    const listener = vi.fn()
    const { unmount } = renderHook(() => useEventListener(() => target, 'click', listener, { passive: true }))

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
    })

    expect(listener).toHaveBeenCalledTimes(1)

    unmount()

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
    })

    expect(listener).toHaveBeenCalledTimes(1) // Should not be called again
  })

  it('should not throw error when target is null', () => {
    const listener = vi.fn()
    const { unmount } = renderHook(() => useEventListener(null, 'click', listener))

    act(() => {
      target.dispatchEvent(new MouseEvent('click'))
    })

    expect(listener).toHaveBeenCalledTimes(0) // Should not be called

    unmount()
  })
})
