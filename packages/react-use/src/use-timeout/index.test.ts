import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimeout } from './index'

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not timeout initially', () => {
    const { result } = renderHook(() => useTimeout(1_000))
    expect(result.current).toBe(false)
  })

  it('should timeout after specified interval', () => {
    const { result } = renderHook(() => useTimeout(1_000))
    act(() => {
      vi.advanceTimersByTime(1_000)
    })
    expect(result.current).toBe(true)
  })

  it('should reset timeout', async () => {
    const { result } = renderHook(() =>
      useTimeout(1_000, {
        immediate: true,
        controls: true,
      }),
    )

    expect(result.current.isTimeout).toBe(false)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_050)
    })

    expect(result.current.isTimeout).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.isTimeout).toBe(false)
  })

  it('should call callback on timeout', () => {
    const callback = vi.fn()
    renderHook(() => useTimeout(1_000, { callback }))

    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    expect(callback).toHaveBeenCalled()
  })

  it('should expose controls when requested', () => {
    const { result } = renderHook(() =>
      useTimeout(1_000, {
        immediate: true,
        controls: true,
      }),
    )

    expect(result.current.isTimeout).toBe(false)
    expect(typeof result.current.reset).toBe('function')
  })

  it('should not call callback if timeout is reset', () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useTimeout(1_000, {
        immediate: true,
        callback,
        controls: true,
      }),
    )

    act(() => {
      vi.advanceTimersByTime(500)
      result.current.reset()
      vi.advanceTimersByTime(500)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle immediate option', async () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useTimeout(1_000, {
        immediate: false,
        callback,
        controls: true,
      }),
    )

    expect(result.current.isTimeout).toBe(false)
    expect(callback).not.toHaveBeenCalled()

    await act(async () => {
      result.current.resume()
      await vi.advanceTimersByTimeAsync(1_050)
    })

    expect(result.current.isTimeout).toBe(true)
    expect(callback).toHaveBeenCalled()
  })
})
