import { renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCreation } from './index'

import type { DependencyList } from 'react'

describe('useCreation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the created value', () => {
    const createFn = vi.fn(() => 'test value')
    const { result } = renderHook(() => useCreation(createFn))

    expect(result.current).toBe('test value')
    expect(createFn).toHaveBeenCalledTimes(1)
  })

  it('should not recreate value if dependencies are not provided', () => {
    const createFn = vi.fn(() => ({ random: Math.random() }))
    const { result, rerender } = renderHook(() => useCreation(createFn))

    const initialValue = result.current

    rerender()

    expect(result.current).toBe(initialValue)
    expect(createFn).toHaveBeenCalledTimes(1)
  })

  it('should recreate value when dependencies change', () => {
    const createFn = vi.fn((value: number) => ({ value }))
    const { result, rerender } = renderHook(({ dep }) => useCreation(() => createFn(dep), [dep]), {
      initialProps: { dep: 1 },
    })

    expect(result.current).toEqual({ value: 1 })
    expect(createFn).toHaveBeenCalledTimes(1)

    rerender({ dep: 2 })

    expect(result.current).toEqual({ value: 2 })
    expect(createFn).toHaveBeenCalledTimes(2)
  })

  it('should not recreate value when dependencies are the same', () => {
    const createFn = vi.fn((value: number) => ({ value }))
    const { result, rerender } = renderHook(({ dep }) => useCreation(() => createFn(dep), [dep]), {
      initialProps: { dep: 1 },
    })

    expect(result.current).toEqual({ value: 1 })
    expect(createFn).toHaveBeenCalledTimes(1)

    rerender({ dep: 1 })

    expect(result.current).toEqual({ value: 1 })
    expect(createFn).toHaveBeenCalledTimes(1)
  })

  it('should handle complex dependencies', () => {
    const createFn = vi.fn((obj: { a: number; b: string }) => ({ ...obj }))
    const { result, rerender } = renderHook(({ dep }) => useCreation(() => createFn(dep), [dep]), {
      initialProps: { dep: { a: 1, b: 'test' } },
    })

    expect(result.current).toEqual({ a: 1, b: 'test' })
    expect(createFn).toHaveBeenCalledTimes(1)

    rerender({ dep: { a: 1, b: 'test' } })

    expect(result.current).toEqual({ a: 1, b: 'test' })
    expect(createFn).toHaveBeenCalledTimes(1)

    rerender({ dep: { a: 2, b: 'test' } })

    expect(result.current).toEqual({ a: 2, b: 'test' })
    expect(createFn).toHaveBeenCalledTimes(2)
  })

  it('should handle undefined dependencies', () => {
    const createFn = vi.fn(() => 'test value')
    const { result, rerender } = renderHook(({ dep }) => useCreation(createFn, dep), {
      initialProps: { dep: undefined as undefined | DependencyList },
    })

    expect(result.current).toBe('test value')
    expect(createFn).toHaveBeenCalledTimes(1)

    rerender({ dep: undefined })

    expect(result.current).toBe('test value')
    expect(createFn).toHaveBeenCalledTimes(1)

    rerender({ dep: [1] })

    expect(result.current).toBe('test value')
    expect(createFn).toHaveBeenCalledTimes(2)
  })
})
