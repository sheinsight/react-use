import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAsyncFn } from './index'

describe('useAsyncFn', () => {
  const mockFn = vi.fn()

  beforeEach(() => {
    mockFn.mockResolvedValue('success')
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.restoreAllMocks()
  })

  it('should return initial loading properly, false by default', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.loading).toBe(false)
  })

  it('should return initial loading properly when set `immediate` to true', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn, { immediate: true }))
    expect(result.current.loading).toBe(true)
  })

  it('should return initial loading properly when set `immediate` to false', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn, { immediate: false }))
    expect(result.current.loading).toBe(false)
  })

  it('should return initial error properly', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.error).toBeUndefined()
  })

  it('should return initial value properly', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.value).toBeUndefined()
  })

  it('should return initial value properly when set `initialValue`', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn, { initialValue: 'initial' }))
    expect(result.current.value).toBe('initial')
  })

  it('should return initial params properly', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.params).toEqual([])
  })

  it('should return initial params properly when set `initialParams`', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn, { initialParams: ['initial'] }))
    expect(result.current.params).toEqual(['initial'])
  })

  it('should return initial refresh properly', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.refresh).toBeInstanceOf(Function)
  })

  it('should return initial run properly', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.run).toBeInstanceOf(Function)
  })

  it('should return initial mutate properly', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.mutate).toBeInstanceOf(Function)
  })

  it('should return initial cancel properly', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.cancel).toBeInstanceOf(Function)
  })

  it('should handle `immediate` option value `true`', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn, { immediate: true }))
    expect(result.current.loading).toBe(true)
  })

  it('should handle `immediate` option value `false`', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn, { immediate: false }))
    expect(result.current.loading).toBe(false)
  })

  it('should set `immediate` to `false` by default', () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))
    expect(result.current.loading).toBe(false)
  })

  it('should handle successful async function', async () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))

    act(() => {
      result.current.run()
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBeUndefined()
    expect(result.current.params).toEqual([])

    await act(async () => {}) // wait for async function to resolve

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBe('success')
    expect(result.current.params).toEqual([])

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith()
  })

  it('should handle successful async function with params', async () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))

    act(() => {
      result.current.run('a', 'b')
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBeUndefined()
    expect(result.current.params).toEqual(['a', 'b'])

    await act(async () => {}) // wait for async function to resolve

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBe('success')
    expect(result.current.params).toEqual(['a', 'b'])

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('a', 'b')
  })

  it('should handle successful async function with multiple run', async () => {
    mockFn.mockImplementation((a: string, b: string) => Promise.resolve(a + b))

    const { result } = renderHook(() => useAsyncFn(mockFn))

    act(() => {
      result.current.run('a', 'b')
      result.current.run('c', 'd')
      result.current.run('e', 'f')
      result.current.run('g', 'h')
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBeUndefined()
    expect(result.current.params).toEqual(['g', 'h'])

    await act(async () => {}) // wait for async function to resolve

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBe('gh')
    expect(result.current.params).toEqual(['g', 'h'])

    expect(mockFn).toHaveBeenCalledTimes(4)
    expect(mockFn).toHaveBeenCalledWith('g', 'h')
  })

  it('should handle successful async function with multiple run (uncertain response time)', async () => {
    mockFn.mockImplementation(async (a: string, b: string, time: number = 100) => {
      await new Promise((resolve) => setTimeout(resolve, time))
      return a + b
    })

    const { result } = renderHook(() => useAsyncFn(mockFn))

    act(() => {
      result.current.run('a', 'b', 300)
      result.current.run('c', 'd', 50)
      result.current.run('e', 'f', 100)
      result.current.run('g', 'h', 60)
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBeUndefined()
    expect(result.current.params).toEqual(['g', 'h', 60])

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.value).toBe('gh')
    expect(result.current.params).toEqual(['g', 'h', 60])

    expect(mockFn).toHaveBeenCalledTimes(4)
    expect(mockFn).toHaveBeenCalledWith('g', 'h', 60)
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

  it('should handle async function with parameters', async () => {
    const mockFn = vi.fn((a: string, b: string) => Promise.resolve('')).mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn))

    await act(async () => {
      await result.current.run('param1', 'param2')
    })

    expect(result.current.params).toEqual(['param1', 'param2'])
    expect(mockFn).toHaveBeenCalledWith('param1', 'param2')
  })

  it('should handle multiple operation with parameters', async () => {
    const mockFn = vi.fn((a: string, b: string) => Promise.resolve('')).mockResolvedValue('success')
    const { result } = renderHook(() => useAsyncFn(mockFn))

    await act(async () => {
      await result.current.run('param1', 'param2')
    })

    expect(result.current.params).toEqual(['param1', 'param2'])
    expect(mockFn).toHaveBeenCalledWith('param1', 'param2')

    await act(async () => {
      await result.current.run('param3', 'param4')
    })

    expect(result.current.params).toEqual(['param3', 'param4'])
    expect(mockFn).toHaveBeenCalledWith('param3', 'param4')

    await act(async () => {
      result.current.run('param3', 'param4')
      result.current.run('param5', 'param6')
    })

    expect(result.current.params).toEqual(['param5', 'param6'])
    expect(mockFn).toHaveBeenCalledWith('param5', 'param6')
  })

  it('should handle refresh function', async () => {
    const { result } = renderHook(() => useAsyncFn(mockFn))

    await act(async () => {
      await result.current.run()
      await result.current.refresh()
    })

    expect(mockFn).toHaveBeenCalledTimes(2)

    await act(async () => {
      await result.current.run('param1', 'param2')
      await result.current.refresh()
    })

    expect(mockFn).toHaveBeenCalledTimes(4)
    expect(mockFn).toHaveBeenCalledWith('param1', 'param2')
    expect(result.current.params).toEqual(['param1', 'param2'])

    await act(async () => {
      await result.current.refresh(['param3', 'param4'])
    })

    expect(mockFn).toHaveBeenCalledTimes(5)
    expect(mockFn).toHaveBeenCalledWith('param3', 'param4')
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
