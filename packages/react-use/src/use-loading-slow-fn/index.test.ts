import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLoadingSlowFn } from './index'

describe('useLoadingSlowFn', () => {
  let mockFn: Mock

  beforeEach(() => {
    mockFn = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should defined', () => {
    expect(useLoadingSlowFn).toBeDefined()
  })

  it('should not mark loading as slow when loading is fast', async () => {
    mockFn.mockResolvedValueOnce('data')

    const { result } = renderHook(() => useLoadingSlowFn(mockFn, { loadingTimeout: 100 }))

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.loadingSlow).toBe(false)
    expect(mockFn).toHaveBeenCalled()
  })

  it('should mark loading as slow when loading exceeds timeout', async () => {
    mockFn.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('data'), 200)))

    const { result } = renderHook(() => useLoadingSlowFn(mockFn, { loadingTimeout: 100 }))

    act(() => {
      result.current.run()
    })

    vi.advanceTimersByTime(150) // Advance time to exceed loadingTimeout

    expect(result.current.loadingSlow).toBe(true)
    expect(mockFn).toHaveBeenCalled()
  })

  it('should call onLoadingSlow callback when loading is slow', async () => {
    const onLoadingSlow = vi.fn()
    mockFn.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('data'), 200)))

    const { result } = renderHook(() => useLoadingSlowFn(mockFn, { loadingTimeout: 100, onLoadingSlow }))

    act(() => {
      result.current.run()
    })

    vi.advanceTimersByTime(150) // Advance time to exceed loadingTimeout

    expect(onLoadingSlow).toHaveBeenCalled()
  })

  it('should cancel loading and not mark as slow when cancelled', async () => {
    mockFn.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('data'), 200)))

    const { result } = renderHook(() => useLoadingSlowFn(mockFn, { loadingTimeout: 100 }))

    act(() => {
      result.current.run()
    })

    act(() => {
      result.current.cancel() // Cancel the loading
    })

    vi.advanceTimersByTime(150) // Advance time to exceed loadingTimeout

    expect(result.current.loadingSlow).toBe(false) // Should not be marked as slow
  })
})
