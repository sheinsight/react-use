import { act, renderHook } from '@/test'
// packages/react-use/src/use-query/index.test.ts
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuery } from './index'

describe('useQuery', () => {
  let fetcher: Mock
  let options: any

  beforeEach(() => {
    vi.useFakeTimers()
    fetcher = vi.fn()
    options = {}
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useQuery(fetcher, options))
    expect(result.current.data).toBeUndefined()
    expect(result.current.loading).toBe(true)
    expect(result.current.initializing).toBe(true)
  })

  it('should fetch data successfully', async () => {
    fetcher.mockResolvedValueOnce('data')
    const { result } = renderHook(() => useQuery(fetcher, options))

    await act(async () => {})

    expect(fetcher).toHaveBeenCalled()
    expect(result.current.data).toBe('data')
    expect(result.current.loading).toBe(false)
    expect(result.current.initializing).toBe(false)
  })

  it.skip('should handle fetch error', async () => {
    fetcher.mockRejectedValue(new Error('fetch error'))
    const { result } = renderHook(() => useQuery(fetcher, options))

    await act(async () => {})

    expect(fetcher).toHaveBeenCalled()
    expect(result.current.error).toBeInstanceOf(Error) // FIXME: fix it
    expect(result.current.loading).toBe(false)
  })

  it('should refresh data on focus', async () => {
    fetcher.mockResolvedValueOnce('data')
    options.refreshOnFocus = true
    const { result } = renderHook(() => useQuery(fetcher, options))

    await act(async () => {})

    expect(result.current.data).toBe('data')

    // Simulate focus event
    await act(async () => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('should not refresh data on focus if disabled', async () => {
    fetcher.mockResolvedValueOnce('data')
    options.refreshOnFocus = false
    const { result } = renderHook(() => useQuery(fetcher, options))

    await act(async () => {})

    expect(result.current.data).toBe('data')

    // Simulate focus event
    act(() => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('should handle manual refresh', async () => {
    fetcher.mockResolvedValueOnce('data')
    options.manual = true
    const { result } = renderHook(() => useQuery(fetcher, options))

    await act(async () => {})

    expect(result.current.data).toBeUndefined()

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.data).toBe('data')
  })

  it('should respect cache expiration', async () => {
    fetcher.mockResolvedValueOnce('data')
    options.cacheKey = 'test'
    options.cacheExpirationTime = 100 // 100 ms
    const { result } = renderHook(() => useQuery(fetcher, options))

    await act(async () => {})

    expect(result.current.data).toBe('data')

    // Wait for cache to expire
    await vi.advanceTimersByTimeAsync(150)

    expect(result.current.data).toBe(undefined)
  })
})
