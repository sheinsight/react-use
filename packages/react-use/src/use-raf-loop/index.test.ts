import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRafLoop } from './index'

describe('useRafLoop', () => {
  let callback: Mock

  beforeEach(() => {
    vi.useFakeTimers()
    callback = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call the callback immediately if immediate is true', () => {
    renderHook(() => useRafLoop(callback, { immediate: true }))

    act(() => {
      vi.advanceTimersByTime(1000 / 60) // Simulate frame
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should not call the callback immediately if immediate is false', () => {
    renderHook(() => useRafLoop(callback, { immediate: false }))

    act(() => {
      vi.advanceTimersByTime(1000 / 60) // Simulate frame
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should respect fpsLimit', async () => {
    const count = { value: 0 }
    renderHook(() => useRafLoop(() => count.value++, { fpsLimit: 30 }))

    act(() => {
      vi.advanceTimersByTime(1_000) // Simulate 1 second
    })

    setTimeout(() => {
      expect(count.value).toBeLessThan(30)
      expect(count.value).toBeGreaterThan(0)
    })
  })

  it('should pause and resume correctly', () => {
    const { result } = renderHook(() => useRafLoop(callback))

    act(() => {
      result.current.pause()
      vi.advanceTimersByTime(1000 / 60) // Simulate frame
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      result.current.resume()
      vi.advanceTimersByTime(1000 / 60) // Simulate frame
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should call immediateCallback before the first frame', () => {
    const immediateCallback = vi.fn()

    renderHook(() =>
      useRafLoop(callback, {
        immediate: true,
        immediateCallback: true,
      }),
    )

    setTimeout(() => {
      expect(immediateCallback).toHaveBeenCalled()
    })
  })
})
