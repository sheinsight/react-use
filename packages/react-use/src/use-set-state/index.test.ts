import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useSetState } from './index'

describe('useSetState', () => {
  it('should initialize with the given state', () => {
    const { result } = renderHook(() => useSetState({ count: 0, text: 'hello' }))
    expect(result.current[0]).toEqual({ count: 0, text: 'hello' })
  })

  it('should update state partially', () => {
    const { result } = renderHook(() => useSetState({ count: 0, text: 'hello' }))
    act(() => {
      result.current[1]({ count: 1 })
    })
    expect(result.current[0]).toEqual({ count: 1, text: 'hello' })
  })

  it('should handle multiple updates', () => {
    const { result } = renderHook(() => useSetState({ count: 0, text: 'hello' }))
    act(() => {
      result.current[1]({ count: 1 })
      result.current[1]({ text: 'world' })
    })
    expect(result.current[0]).toEqual({ count: 1, text: 'world' })
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useSetState({ count: 0, text: 'hello' }))
    act(() => {
      result.current[1]((prevState) => ({ count: prevState.count + 1 }))
      result.current[1]((prevState) => ({ count: prevState.count + 1, text: 'world' }))
    })
    expect(result.current[0]).toEqual({ count: 2, text: 'world' })
  })

  it('should not update state when null is returned from function update', () => {
    const { result } = renderHook(() => useSetState({ count: 0, text: 'hello' }))
    act(() => {
      result.current[1](() => null)
    })
    expect(result.current[0]).toEqual({ count: 0, text: 'hello' })
  })

  it('should preserve object reference when no changes are made', () => {
    const { result } = renderHook(() => useSetState({ count: 0 }))
    const initialState = result.current[0]
    act(() => {
      result.current[1]({})
    })
    expect(result.current[0]).toBe(initialState)
  })

  it('should work with function as initial state', () => {
    const initialStateFn = vi.fn(() => ({ count: 0 }))
    const { result } = renderHook(() => useSetState(initialStateFn))
    expect(result.current[0]).toEqual({ count: 0 })
    expect(initialStateFn).toHaveBeenCalledTimes(1)
  })

  it('should maintain stability of setState function', () => {
    const { result, rerender } = renderHook(() => useSetState({ count: 0 }))
    const initialSetState = result.current[1]
    rerender()
    expect(result.current[1]).toBe(initialSetState)
  })

  it('should handle multiple setState calls with same key', () => {
    const { result } = renderHook(() => useSetState({ name: 'John', age: 30 }))
    act(() => {
      result.current[1]({ name: 'Doe', age: 31 })
      result.current[1]({ age: 32 })
    })
    expect(result.current[0]).toEqual({ name: 'Doe', age: 32 })
  })
})
