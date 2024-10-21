import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mutate, useQuery } from './index'

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
    mutate(() => true, undefined, [])
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

  it('should handle refreshInterval', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { refreshInterval: 100 }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(mockFetcher).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(120)

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('should handle refreshInterval when set manual', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { refreshInterval: 100, manual: true }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(mockFetcher).toHaveBeenCalledTimes(0)

    await vi.advanceTimersByTimeAsync(120)

    expect(mockFetcher).toHaveBeenCalledTimes(0) // have not started
  })

  it('should handle onMutate', async () => {
    const onMutate = vi.fn()
    const { result } = renderHook(() => useQuery(mockFetcher, { onMutate }))
    expect(onMutate).not.toHaveBeenCalled()

    await act(async () => {
      result.current.mutate('newData')
    })

    expect(onMutate).toHaveBeenCalledWith('newData', [])
  })

  it('should handle clearBeforeRun', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { clearBeforeRun: true }))

    expect(result.current.data).not.toBeDefined()

    await act(async () => {})

    expect(result.current.data).toBe('data')

    act(() => {
      result.current.run()
    })

    expect(result.current.data).not.toBeDefined()

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')
  })

  it('should handle onErrorRetryFailed', async () => {
    const onErrorRetryFailed = vi.fn()
    mockFetcher.mockRejectedValue(new Error('fetch error'))

    const { result } = renderHook(() =>
      useQuery(mockFetcher, {
        errorRetryCount: 2,
        onErrorRetryFailed,
        errorRetryInterval: 100,
      }),
    )

    expect(onErrorRetryFailed).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(320) // wait for retry to fail
    })

    expect(onErrorRetryFailed).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple fetcher run', async () => {
    mockFetcher.mockImplementation(async (value = 1, wait = 100) => {
      await new Promise((resolve) => setTimeout(resolve, wait))
      return value
    })

    const { result } = renderHook(() => useQuery(mockFetcher))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(120) // wait for fetcher to resolve
    }) // wait for fetcher to resolve

    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(result.current.data).toBe(1)

    await act(async () => {
      result.current.run(3, 200)
      await vi.advanceTimersByTimeAsync(10)
      result.current.run(4, 100)
      await vi.advanceTimersByTimeAsync(10)
      result.current.run(6, 20)
      await vi.advanceTimersByTimeAsync(10)
      result.current.run(5, 50)
    })

    expect(result.current.data).toBe(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300) // wait for fetcher to resolve
    })

    expect(result.current.data).toBe(5)

    expect(mockFetcher).toHaveBeenCalledTimes(5)
  })

  it('should return previous promise when use cache in different hooks', async () => {
    mockFetcher.mockImplementation(async (value = 1, wait = 100) => {
      await new Promise((resolve) => setTimeout(resolve, wait))
      return value
    })

    const { result: result1 } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'cache' })) // called once

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20) // simulate offset mount
    })

    const { result: result2 } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'cache' })) // reuse promise

    await act(async () => {
      await vi.advanceTimersByTimeAsync(120) // wait for fetcher to resolve
    })

    expect(mockFetcher).toHaveBeenCalledTimes(1)

    let p1: Promise<any> | undefined
    let p2: Promise<any> | undefined

    await act(async () => {
      p1 = result1.current.run(1) // called once
      await vi.advanceTimersByTimeAsync(20)
      p2 = result2.current.run(1) // reuse promise
    })

    await vi.advanceTimersByTimeAsync(200)

    expect(await p1).toBe(await p2)
    expect(mockFetcher).toHaveBeenCalledTimes(2) // should reuse promise, so only called twice
  })

  it('should handle custom isOnline', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, {
        refreshOnReconnect: true,
        isOnline() {
          return false
        },
      }),
    )

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')
    expect(result.current.loading).toBe(false)
  })

  it('should handle onFinally', async () => {
    const onFinally = vi.fn()

    const { result } = renderHook(() => useQuery(mockFetcher, { onFinally }))

    expect(onFinally).not.toHaveBeenCalled()

    await act(async () => {}) // wait for fetcher to resolve

    expect(onFinally).toHaveBeenCalledTimes(1)
  })

  it('should handle onSuccess', async () => {
    const onSuccess = vi.fn()

    const { result } = renderHook(() => useQuery(mockFetcher, { onSuccess }))

    expect(onSuccess).not.toHaveBeenCalled()

    await act(async () => {}) // wait for fetcher to resolve

    expect(onSuccess).toHaveBeenCalledWith('data', [])
  })

  it('should handle onError', async () => {
    const onError = vi.fn()

    mockFetcher.mockRejectedValue(new Error('fetch error'))

    const { result } = renderHook(() => useQuery(mockFetcher, { onError }))

    expect(onError).not.toHaveBeenCalled()

    await act(async () => {}) // wait for fetcher to reject

    expect(onError).toHaveBeenCalledWith(expect.any(Error), [])
  })

  it('should handle onCancel', async () => {
    const onCancel = vi.fn()

    const { result } = renderHook(() => useQuery(mockFetcher, { onCancel }))

    await act(async () => {
      result.current.cancel()
    })

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should handle onBefore', async () => {
    const onBefore = vi.fn()

    const { result } = renderHook(() => useQuery(mockFetcher, { onBefore }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(onBefore).toHaveBeenCalledTimes(1)
  })

  it('should handle pause and resume', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, {
        refreshOnFocus: true,
        refreshOnFocusThrottleWait: 100,
        isVisible() {
          return true
        },
      }),
    )

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    mockFetcher.mockResolvedValue('newData')

    await act(async () => {
      result.current.pause()
    })

    // Simulate focus event
    await act(async () => {
      window.dispatchEvent(new FocusEvent('focus'))
      await vi.advanceTimersByTimeAsync(200)
    })

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data') // not cleared

    await act(async () => {
      result.current.resume()
    })

    // Simulate focus event
    await act(async () => {
      window.dispatchEvent(new FocusEvent('focus'))
      await vi.advanceTimersByTimeAsync(200)
    })

    expect(result.current.data).toBe('newData') // not cleared
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

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    // Simulate focus event
    await act(async () => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('should refresh data on focus when enable cache', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { refreshOnFocus: true, cacheKey: 'refresh' }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    // Simulate focus event
    await act(async () => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('should refresh data on focus when custom isVisible', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, {
        refreshOnFocus: true,
        refreshWhenHidden: false,
        isVisible: () => false,
      }),
    )

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    // Simulate focus event
    await act(async () => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(1) // not refresh when not visible
  })

  it('should not refresh data on focus if disabled', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { refreshOnFocus: false }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    // Simulate focus event
    act(() => {
      window.dispatchEvent(new FocusEvent('focus'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('should handle manual refresh', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { manual: true }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBeUndefined()

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.data).toBe('data')
  })

  it('should respect cache expiration', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, {
        cacheKey: 'expiration',
        cacheExpirationTime: 100,
      }),
    )

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    // Wait for cache to expire
    await vi.advanceTimersByTimeAsync(150)

    expect(result.current.data).toBe(undefined)
  })

  it('should handle throttle', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { immediate: false, throttle: 100 }))

    await act(async () => {
      result.current.run()
      result.current.run()
      result.current.run()
    })

    await vi.advanceTimersByTimeAsync(200)

    expect(mockFetcher).toHaveBeenCalledTimes(2) // leading call + trailing call
  })

  it('should handle throttle in object', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, { immediate: false, throttle: { wait: 100, trailing: false } }),
    )

    await act(async () => {
      result.current.run()
      result.current.run()
      result.current.run()
    })

    await vi.advanceTimersByTimeAsync(200)

    expect(mockFetcher).toHaveBeenCalledTimes(1) // leading call
  })

  it('should handle debounce', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { immediate: false, debounce: 100 }))

    await act(async () => {
      result.current.run()
      result.current.run()
      result.current.run()
    })

    await vi.advanceTimersByTimeAsync(200)

    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('should handle debounce in object', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { immediate: false, debounce: { wait: 100 } }))

    await act(async () => {
      result.current.run()
      result.current.run()
      result.current.run()
    })

    await vi.advanceTimersByTimeAsync(200)

    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('should handle refreshOnReconnect', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { refreshOnReconnect: true }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    expect(mockFetcher).toHaveBeenCalledTimes(1)

    // Simulate online event
    await act(async () => {
      window.dispatchEvent(new Event('online'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('should handle refreshOnReconnect when enable cache', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, { refreshOnReconnect: true, cacheKey: 'refreshOnReconnect' }),
    )

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    expect(mockFetcher).toHaveBeenCalledTimes(1)

    // Simulate online event
    await act(async () => {
      window.dispatchEvent(new Event('online'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('should handle refreshOnReconnect when custom isOnline', async () => {
    const { result } = renderHook(() =>
      useQuery(mockFetcher, {
        refreshOnReconnect: true,
        isOnline() {
          return false
        },
      }),
    )

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    expect(mockFetcher).toHaveBeenCalledTimes(1)

    // Simulate online event
    await act(async () => {
      window.dispatchEvent(new Event('online'))
    })

    expect(mockFetcher).toHaveBeenCalledTimes(1) // not refresh when offline
  })

  it('should handle mutate with cache', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'mutate' }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')

    await act(async () => {
      result.current.mutate('newData')
    })

    expect(result.current.data).toBe('newData')
  })

  it('should handle refresh with cache', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'refresh-with-cache' }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')
    expect(result.current.params).toEqual([])

    mockFetcher.mockResolvedValue('newData')

    await act(async () => {
      result.current.refresh()
    })

    expect(result.current.data).toBe('newData')
    expect(result.current.params).toEqual([])

    await act(async () => {
      result.current.refresh(['newParams'])
    })

    expect(result.current.data).toBe('newData')
    expect(result.current.params).toEqual(['newParams'])
  })

  it('should handle refresh with params', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'refresh-with-params' }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')
    expect(result.current.params).toEqual([])

    mockFetcher.mockResolvedValueOnce('newData')

    await act(async () => {
      await result.current.refresh(['newParams'])
    })

    expect(result.current.data).toBe('newData')
    expect(result.current.params).toEqual(['newParams'])
  })

  it('should handle refresh with params and rate control', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'refresh-with-rate-control', debounce: 100 }))

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.data).toBe('data')
    expect(result.current.params).toEqual([])
    expect(result.current.loading).toBe(false)

    expect(mockFetcher).toHaveBeenCalledTimes(1)

    mockFetcher.mockResolvedValue('newData')

    await act(async () => {
      result.current.refresh(['newParams 1'])
      result.current.refresh(['newParams 2'])
      result.current.refresh(['newParams 3'])
    })

    await vi.advanceTimersByTimeAsync(200)

    expect(result.current.data).toBe('newData')
    expect(result.current.params).toEqual(['newParams 3'])
  })

  it('should handle refreshing state', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'refreshing' }))

    expect(result.current.data).toBe(undefined)
    expect(result.current.refreshing).toBe(false)

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.refreshing).toBe(false)

    act(() => {
      result.current.refresh()
    })

    expect(result.current.refreshing).toBe(true)

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.refreshing).toBe(false)
  })

  it('should handle initializing state', async () => {
    const { result } = renderHook(() => useQuery(mockFetcher, { cacheKey: 'initializing' }))

    expect(result.current.data).toBe(undefined)
    expect(result.current.initializing).toBe(true)

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.initializing).toBe(false)

    act(() => {
      result.current.refresh()
    })

    expect(result.current.initializing).toBe(false)

    await act(async () => {}) // wait for fetcher to resolve

    expect(result.current.initializing).toBe(false)
  })
})
