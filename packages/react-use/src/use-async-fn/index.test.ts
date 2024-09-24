import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAsyncFn } from './index'

describe('useAsyncFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllTimers()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useAsyncFn(async () => {}))

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBeUndefined()
    expect(result.current.params).toEqual([])
  })

  it('should handle successful async function', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn))

    expect(result.current.loading).toBe(false)

    await act(async () => {
      const runResult = result.current.run()
      expect(result.current.loading).toBe(true)
      await runResult
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle async function with parameters', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn))

    await act(async () => {
      await result.current.run('param1', 'param2')
    })

    expect(result.current.params).toEqual(['param1', 'param2'])
    expect(mockFn).toHaveBeenCalledWith('param1', 'param2')
  })

  it('should handle error in async function', async () => {
    const error = new Error('Test error')
    const mockFn = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useAsyncFn(mockFn))

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(error)
    expect(result.current.value).toBeUndefined()
  })

  it('should handle immediate option', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn, { immediate: true }))

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.value).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle initialParams option', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn, { immediate: true, initialParams: ['initial'] }))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(mockFn).toHaveBeenCalledWith('initial')
    expect(result.current.params).toEqual(['initial'])
  })

  it('should handle clearBeforeRun option', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn, { clearBeforeRun: true }))

    await act(async () => {
      result.current.mutate('initial')
      expect(result.current.value).toBe('initial')
      await result.current.run()
    })

    expect(result.current.value).toBe('success')
  })

  it('should not clear value before run when clearBeforeRun is false', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn, { clearBeforeRun: false }))

    await act(async () => {
      result.current.mutate('initial')
      expect(result.current.value).toBe('initial')
      const runPromise = result.current.run()
      expect(result.current.value).toBe('initial')
      await runPromise
    })

    expect(result.current.value).toBe('success')
  })

  it('should handle cancel function', async () => {
    const mockFn = vi.fn().mockImplementation(() => new Promise(() => {}))
    const onCancel = vi.fn()
    const { result } = renderHook(() => useAsyncFn(mockFn, { onCancel }))

    act(() => {
      result.current.run()
      expect(result.current.loading).toBe(true)
      result.current.cancel()
    })

    expect(result.current.loading).toBe(false)
    expect(onCancel).toHaveBeenCalled()
  })

  it('should handle refresh function', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn))

    await act(async () => {
      await result.current.run('param1')
      await result.current.refresh()
    })

    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenLastCalledWith('param1')
  })

  it('should handle mutate function', () => {
    const { result } = renderHook(() => useAsyncFn(async () => ''))

    act(() => {
      result.current.mutate('new value')
    })

    expect(result.current.value).toBe('new value')
  })

  it('should handle all lifecycle callbacks', async () => {
    const callbacks = {
      onBefore: vi.fn(),
      onSuccess: vi.fn(),
      onError: vi.fn(),
      onFinally: vi.fn(),
      onMutate: vi.fn(),
      onRefresh: vi.fn(),
      onCancel: vi.fn(),
    }

    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn, callbacks))

    await act(async () => {
      await result.current.run()
      result.current.mutate('mutated')
      await result.current.refresh()
      result.current.cancel()
    })

    expect(callbacks.onBefore).toHaveBeenCalledTimes(2)
    expect(callbacks.onSuccess).toHaveBeenCalledTimes(2)
    expect(callbacks.onFinally).toHaveBeenCalledTimes(2)
    expect(callbacks.onMutate).toHaveBeenCalledTimes(1)
    expect(callbacks.onRefresh).toHaveBeenCalledTimes(1)
    expect(callbacks.onCancel).toHaveBeenCalledTimes(1)
  })

  it('should handle compare option', async () => {
    const compare = vi.fn().mockReturnValue(true)
    const mockFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn, { compare }))

    await act(async () => {
      await result.current.run()
    })

    expect(compare).toHaveBeenCalled()
  })

  it('should not update state when compare returns true', async () => {
    const compare = vi.fn().mockReturnValue(true)
    const mockFn = vi.fn().mockResolvedValue('new value')
    const { result } = renderHook(() => useAsyncFn(mockFn, { compare }))

    await act(async () => {
      result.current.mutate('initial value')
      await result.current.run()
    })

    expect(result.current.value).toBe('initial value')
  })

  it('should update state when compare returns false', async () => {
    const compare = vi.fn().mockReturnValue(false)
    const mockFn = vi.fn().mockResolvedValue('new value')
    const { result } = renderHook(() => useAsyncFn(mockFn, { compare }))

    await act(async () => {
      result.current.mutate('initial value')
      await result.current.run()
    })

    expect(result.current.value).toBe('new value')
  })

  it('should handle multiple consecutive runs', async () => {
    const mockFn = vi.fn().mockResolvedValueOnce('first').mockResolvedValueOnce('second').mockResolvedValueOnce('third')
    const { result } = renderHook(() => useAsyncFn(mockFn))

    await act(async () => {
      const promise1 = result.current.run()
      const promise2 = result.current.run()
      const promise3 = result.current.run()
      await Promise.all([promise1, promise2, promise3])
    })

    expect(mockFn).toHaveBeenCalledTimes(3)
    expect(result.current.value).toBe('third')
  })
})
