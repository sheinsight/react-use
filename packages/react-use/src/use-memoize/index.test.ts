import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMemoize } from './index'

describe('useMemoize', () => {
  let resolver: Mock
  let options: any

  beforeEach(() => {
    resolver = vi.fn((x: number) => x * 2)
    options = {}
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should defined', () => {
    expect(useMemoize).toBeDefined()
  })

  it('should return the same value for the same arguments', () => {
    const { result } = renderHook(() => useMemoize(resolver, options))

    act(() => {
      const value1 = result.current(2)
      const value2 = result.current(2)
      expect(value1).toBe(4)
      expect(value2).toBe(4)
      expect(resolver).toHaveBeenCalledTimes(1)
    })
  })

  it('should call resolver with new arguments', () => {
    const { result } = renderHook(() => useMemoize(resolver, options))

    act(() => {
      result.current(2)
      result.current(3)
    })

    expect(resolver).toHaveBeenCalledTimes(2)
    expect(resolver).toHaveBeenCalledWith(2)
    expect(resolver).toHaveBeenCalledWith(3)
  })

  it('should load data and replace the cache', () => {
    const { result } = renderHook(() => useMemoize(resolver, options))

    act(() => {
      result.current(2)
      result.current.load(2)
    })

    expect(resolver).toHaveBeenCalledTimes(2)
    expect(result.current(2)).toBe(4)
  })

  it('should delete cache by args', () => {
    const { result } = renderHook(() => useMemoize(resolver, options))

    act(() => {
      result.current(2)
      result.current.delete(2)
    })

    expect(result.current(2)).toBe(4)
    expect(resolver).toHaveBeenCalledTimes(2) // Called again after delete
  })

  it('should clear all cache', () => {
    const { result } = renderHook(() => useMemoize(resolver, options))

    act(() => {
      result.current(2)
      result.current(3)
      result.current.clear()
    })

    expect(result.current(2)).toBe(4)
    expect(result.current(3)).toBe(6)
    expect(resolver).toHaveBeenCalledTimes(4) // Called again after clear
  })

  it('should use custom cache key generator', () => {
    options.getKey = (x: number) => `key-${x}`
    const { result } = renderHook(() => useMemoize(resolver, options))

    act(() => {
      result.current(2)
      result.current(2)
    })

    expect(resolver).toHaveBeenCalledTimes(1)
  })

  it('should handle async resolver', async () => {
    resolver = vi.fn(async (x: number) => x * 2)
    const { result } = renderHook(() => useMemoize(resolver, options))

    await act(async () => {
      const value = await result.current(2)
      expect(value).toBe(4)
    })

    expect(resolver).toHaveBeenCalledTimes(1)
  })

  it('should handle timers correctly', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useMemoize(resolver, options))

    act(() => {
      result.current(2)
      vi.advanceTimersByTime(1000)
      result.current(2)
    })

    expect(resolver).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
