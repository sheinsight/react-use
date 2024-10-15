import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuery } from './index'

import type { Mock } from 'vitest'

describe('useQuery', () => {
  let mockFetcher: Mock

  beforeEach(() => {
    mockFetcher = vi.fn().mockResolvedValue('data')
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with default values when ser manual', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { manual: true }))

    expect(mockFetcher).not.toHaveBeenCalled()

    expect(result.current.data).toBeUndefined()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.initializing).toBe(false)
    expect(result.current.refreshing).toBe(false)
    expect(result.current.loadingSlow).toBe(false)
    expect(result.current.params).toEqual([])

    expect(result.current.run).toBeDefined()
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.cancel).toBeInstanceOf(Function)
    expect(result.current.mutate).toBeInstanceOf(Function)
    expect(result.current.pause).toBeInstanceOf(Function)
    expect(result.current.resume).toBeInstanceOf(Function)
    expect(result.current.isActive).toBeInstanceOf(Function)
    expect(result.current.isActive()).toBe(true)
  })

  it('should handle fetcher when running', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher))

    expect(result.current.data).toBeUndefined()
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.initializing).toBe(true)
    expect(result.current.refreshing).toBe(false)
    expect(result.current.loadingSlow).toBe(false)
    expect(result.current.params).toEqual([])
  })

  it('should handle fetcher when operation done', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher))

    await act(async () => {}) // wait for fetcher to resolve

    expect(mockFetcher).toHaveBeenCalled()

    expect(result.current.data).toBe('data')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.initializing).toBe(false)
    expect(result.current.refreshing).toBe(false)
    expect(result.current.loadingSlow).toBe(false)
    expect(result.current.params).toEqual([])
  })

  it('should handle fetch error', async () => {
    mockFetcher.mockRejectedValue(new Error('fetch error'))

    const { result } = renderHook(() => useQuery(mockFetcher))

    await act(async () => {}) // wait for fetcher to reject

    expect(mockFetcher).toHaveBeenCalled()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.loading).toBe(false)
  })

  it('should handle dependencies refresh', async () => {
    const { result, rerender } = renderHook(({ id }) => useQuery(mockFetcher, { refreshDependencies: [id] }), {
      initialProps: { id: 1 },
    })

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    mockFetcher.mockResolvedValueOnce('newData')

    rerender({ id: 2 })

    expect(result.current.data).toBe('data') // not updated yet && not clear previous data

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('newData')
  })

  it('should refresh data on focus', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { refreshOnFocus: true }))

    await act(async () => {}) // wait for fetcher to reject

    expect(result.current.data).toBe('data')

    // Simulate focus event
    await act(async () => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('should not refresh data on focus if disabled', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { refreshOnFocus: false }))

    await act(async () => {}) // wait for fetcher to reject

    expect(result.current.data).toBe('data')

    // Simulate focus event
    act(() => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('should handle manual refresh', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { manual: true }))

    await act(async () => {}) // wait for fetcher to reject

    expect(result.current.data).toBeUndefined()

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.data).toBe('data')
  })

  it('should respect cache expiration', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, {
        cacheKey: 'test',
        cacheExpirationTime: 100,
      }),
    )

    await act(async () => {}) // wait for fetcher to reject

    expect(result.current.data).toBe('data')

    // Wait for cache to expire
    await vi.advanceTimersByTimeAsync(150)

    expect(result.current.data).toBe(undefined)
  })
})
