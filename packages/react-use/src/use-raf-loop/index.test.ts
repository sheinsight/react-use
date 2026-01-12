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
      vi.advanceTimersToNextFrame()
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should not call the callback immediately if immediate is false', () => {
    renderHook(() => useRafLoop(callback, { immediate: false }))

    act(() => {
      vi.advanceTimersToNextFrame()
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should respect fpsLimit', async () => {
    const count = { value: 0 }
    renderHook(() => useRafLoop(() => count.value++, { fpsLimit: 30 }))

    act(() => {
      vi.advanceTimersByTime(1_000) // Simulate 1 second
    })
    act(() => {
      vi.advanceTimersToNextFrame()
    })

    expect(count.value).toSatisfy((v: number) => v > 0 && v <= 30, 'within (0, 30] range')
  })

  it('should pause and resume correctly', () => {
    const { result } = renderHook(() => useRafLoop(callback))

    act(() => {
      result.current.pause()
      vi.advanceTimersToNextFrame()
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      result.current.resume()
      vi.advanceTimersToNextFrame()
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should call immediateCallback before the first frame', () => {
    renderHook(() =>
      useRafLoop(callback, {
        immediate: true,
        immediateCallback: true,
      }),
    )

    expect(callback).toHaveBeenCalled()
  })
})
