import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { useManualStateHistory } from './index'

describe('useManualStateHistory', () => {
  let initialState: number
  let options: any

  beforeEach(() => {
    initialState = 0
    options = { capacity: 5 }
  })

  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useManualStateHistory(initialState, options))
    expect(result.current.source).toBe(initialState)
    expect(result.current.history).toHaveLength(1)
    expect(result.current.last).toHaveProperty('snapshot', initialState)
  })

  it('should commit state changes', () => {
    const { result } = renderHook(() => useManualStateHistory(initialState, options))

    act(() => {
      result.current.commit()
    })

    expect(result.current.history).toHaveLength(2)
  })

  it('should undo the last change', () => {
    const { result } = renderHook(() => useManualStateHistory(initialState, options))

    act(() => {
      result.current.commit()
      result.current.undo()
    })

    expect(result.current.history).toHaveLength(1)
  })

  it('should redo the last undone change', () => {
    const { result } = renderHook(() => useManualStateHistory(initialState, options))

    act(() => {
      result.current.commit()
      result.current.undo()
      result.current.redo()
    })

    expect(result.current.history).toHaveLength(2)
  })

  it('should clear all history records', () => {
    const { result } = renderHook(() => useManualStateHistory(initialState, options))

    act(() => {
      result.current.commit()
      result.current.clear()
    })

    expect(result.current.history).toHaveLength(1)
  })

  it('should respect the capacity limit', () => {
    const { result } = renderHook(() => useManualStateHistory(initialState, options))

    act(() => {
      for (let i = 1; i <= 6; i++) {
        result.current.commit()
      }
    })

    expect(result.current.history).toHaveLength(5) // Should not exceed capacity
  })
})
