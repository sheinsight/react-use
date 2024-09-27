import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useResetState } from './index'

describe('useResetState', () => {
  let initialState = 0
  let newState = 5

  beforeEach(() => {
    initialState = 0
    newState = 5
  })

  it('should initialize with the correct initial state', () => {
    const { result } = renderHook(() => useResetState(initialState))
    expect(result.current[0]).toBe(initialState)
  })

  it('should update state correctly', () => {
    const { result } = renderHook(() => useResetState(initialState))
    act(() => {
      result.current[1](newState)
    })
    expect(result.current[0]).toBe(newState)
  })

  it('should reset state to initial value', () => {
    const { result } = renderHook(() => useResetState(initialState))
    act(() => {
      result.current[1](newState)
      result.current[2]()
    })
    expect(result.current[0]).toBe(initialState)
  })

  it('should reset state to a new initial value', () => {
    const { result } = renderHook(() => useResetState(initialState))
    act(() => {
      result.current[2](newState)
    })
    expect(result.current[0]).toBe(newState)
  })

  it('should handle undefined initial state', () => {
    const { result } = renderHook(() => useResetState())
    expect(result.current[0]).toBeUndefined()
  })

  it('should reset to latest initial value when called without arguments', () => {
    const { result } = renderHook(() => useResetState(initialState))
    act(() => {
      result.current[1](newState)
      result.current[2]()
    })
    expect(result.current[0]).toBe(initialState)
  })

  afterEach(() => {})
})
