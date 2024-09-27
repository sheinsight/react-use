import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRetryFn } from './index'

describe('useRetryFn', () => {
  let mockFn: Mock

  beforeEach(() => {
    vi.useFakeTimers()
    mockFn = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should call the function once if it succeeds', async () => {
    mockFn.mockResolvedValue('success')
    const { result } = renderHook(() => useRetryFn(mockFn))

    await act(async () => {
      await result.current()
    })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should retry the function on failure', async () => {
    mockFn.mockRejectedValueOnce('error').mockResolvedValue('success')

    const { result } = renderHook(() => useRetryFn(mockFn, { count: 2 }))

    await act(async () => {
      result.current()
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should call onError callback on failure', async () => {
    const onError = vi.fn()
    mockFn.mockRejectedValue('error')
    const { result } = renderHook(() => useRetryFn(mockFn, { onError }))

    await act(async () => {
      result.current()
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(onError).toHaveBeenCalledWith('error')
  })

  it('should call onRetryFailed callback after all retries fail', async () => {
    const onRetryFailed = vi.fn()
    mockFn.mockRejectedValue('error')
    const { result } = renderHook(() => useRetryFn(mockFn, { count: 2, onRetryFailed }))

    await act(async () => {
      result.current()
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(onRetryFailed).toHaveBeenCalledWith('error', expect.any(Object))
  })

  it('should respect custom interval', async () => {
    mockFn.mockRejectedValue('error')
    const { result } = renderHook(() => useRetryFn(mockFn, { count: 2, interval: 100 }))

    await act(async () => {
      result.current()
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(mockFn).toHaveBeenCalledTimes(3) // 1 + 2 retries
  })

  it('should cancel the retry', async () => {
    mockFn.mockRejectedValue('error')
    const { result } = renderHook(() => useRetryFn(mockFn))

    await act(async () => {
      const retryFn = result.current
      retryFn.cancel()
      retryFn()
    })

    expect(mockFn).toHaveBeenCalledTimes(1) // 1 + 0 retries
  })
})
