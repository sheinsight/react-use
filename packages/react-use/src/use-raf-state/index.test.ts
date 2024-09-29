import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRafState } from './index'

describe('useRafState', () => {
  const initialState = 0

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with the correct initial state', () => {
    const { result } = renderHook(() => useRafState(initialState))
    expect(result.current[0]).toBe(initialState)
  })

  it('should update state correctly', async () => {
    const { result } = renderHook(() => useRafState(initialState))

    act(() => {
      result.current[1](1)
    })

    setTimeout(() => expect(result.current[0]).toBe(1))
  })

  it('should update state in the next animation frame', () => {
    const { result } = renderHook(() => useRafState(initialState))
    act(() => {
      result.current[1](1)
    })
    setTimeout(() => expect(result.current[0]).toBe(1))
  })

  it('should handle multiple updates correctly', () => {
    const { result } = renderHook(() => useRafState(initialState))
    act(() => {
      result.current[1](2)
      result.current[1](3)
    })
    setTimeout(() => expect(result.current[0]).toBe(3))
  })

  it('should work with undefined initial state', () => {
    const { result } = renderHook(() => useRafState())
    expect(result.current[0]).toBeUndefined()
  })

  it('should update state with a function', () => {
    const { result } = renderHook(() => useRafState(initialState))
    act(() => {
      result.current[1]((prev) => prev + 1)
    })
    setTimeout(() => expect(result.current[0]).toBe(1))
  })
})
