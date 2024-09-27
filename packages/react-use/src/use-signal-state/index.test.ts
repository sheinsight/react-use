import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSignalState } from './index'

describe('useSignalState', () => {
  let initialState: number

  beforeEach(() => {
    initialState = 0
  })

  it('should initialize with the provided state', () => {
    const { result } = renderHook(() => useSignalState(() => initialState))
    expect(result.current[0]()).toBe(initialState)
  })

  it('should update state correctly', () => {
    const { result } = renderHook(() => useSignalState(() => initialState))
    const setState = result.current[1]

    act(() => {
      setState(1)
    })

    expect(result.current[0]()).toBe(1)
  })

  it('should maintain state across renders', () => {
    const { result, rerender } = renderHook(() => useSignalState(() => initialState))
    const setState = result.current[1]

    act(() => {
      setState(1)
    })

    rerender()

    expect(result.current[0]()).toBe(1)
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useSignalState(() => initialState))
    const setState = result.current[1]

    act(() => {
      setState((prev) => prev + 1)
    })

    expect(result.current[0]()).toBe(1)
  })

  it('should work with complex state', () => {
    const { result } = renderHook(() => useSignalState(() => ({ count: 0 })))
    const setState = result.current[1]

    act(() => {
      setState((prev) => ({ count: prev.count + 1 }))
    })

    expect(result.current[0]().count).toBe(1)
  })
})
