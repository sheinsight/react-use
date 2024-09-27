import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStateHistory } from './index'

describe('useStateHistory', () => {
  let initialState: number
  let options: any

  beforeEach(() => {
    initialState = 0
    options = {}
  })

  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useStateHistory(initialState, options))
    expect(result.current.source).toBe(initialState)
    expect(result.current.history).toHaveLength(1)
    expect(result.current.last).toEqual({ snapshot: initialState, timestamp: expect.any(Number) })
  })

  it('should commit state changes', () => {
    const { result } = renderHook(() => useStateHistory(initialState, options))

    act(() => {
      result.current.commit()
    })

    expect(result.current.history).toHaveLength(2)
  })

  it('should undo the last change', () => {
    const { result } = renderHook(() => useStateHistory(initialState, options))

    act(() => {
      result.current.commit()
      result.current.undo()
    })

    expect(result.current.history).toHaveLength(1)
  })

  it('should redo the last change', () => {
    const { result } = renderHook(() => useStateHistory(initialState, options))

    act(() => {
      result.current.commit()
      result.current.undo()
      result.current.redo()
    })

    expect(result.current.history).toHaveLength(2)
  })

  it('should clear all history records', () => {
    const { result } = renderHook(() => useStateHistory(initialState, options))

    act(() => {
      result.current.commit()
      result.current.clear()
    })

    expect(result.current.history).toHaveLength(1)
  })

  it('should handle deep option correctly', () => {
    options = { deep: true }
    const { result } = renderHook(() => useStateHistory({ a: 1 }, options))

    act(() => {
      result.current.commit()
    })

    expect(result.current.history).toHaveLength(2)
  })

  afterEach(() => {})
})
