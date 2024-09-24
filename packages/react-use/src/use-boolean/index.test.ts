import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useBoolean } from './index'

describe('useBoolean', () => {
  it('should initialize with default value true', () => {
    const { result } = renderHook(() => useBoolean())
    expect(result.current[0]).toBe(true)
  })

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useBoolean(false))
    expect(result.current[0]).toBe(false)
  })

  it('should set value to true when calling setTrue', () => {
    const { result } = renderHook(() => useBoolean(false))
    act(() => {
      result.current[1].setTrue()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should set value to false when calling setFalse', () => {
    const { result } = renderHook(() => useBoolean(true))
    act(() => {
      result.current[1].setFalse()
    })
    expect(result.current[0]).toBe(false)
  })

  it('should toggle value when calling toggle', () => {
    const { result } = renderHook(() => useBoolean(true))
    act(() => {
      result.current[1].toggle()
    })
    expect(result.current[0]).toBe(false)
    act(() => {
      result.current[1].toggle()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should set value to provided boolean when calling setState', () => {
    const { result } = renderHook(() => useBoolean(true))
    act(() => {
      result.current[1].setState(false)
    })
    expect(result.current[0]).toBe(false)
    act(() => {
      result.current[1].setState(true)
    })
    expect(result.current[0]).toBe(true)
  })

  it('should not change value when setting to the same value', () => {
    const { result } = renderHook(() => useBoolean(true))
    act(() => {
      result.current[1].setState(true)
    })
    expect(result.current[0]).toBe(true)
    act(() => {
      result.current[1].setTrue()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should return stable action references', () => {
    const { result, rerender } = renderHook(() => useBoolean())
    const initialActions = result.current[1]
    rerender()
    expect(result.current[1]).toBe(initialActions)
    expect(result.current[1].setTrue).toBe(initialActions.setTrue)
    expect(result.current[1].setFalse).toBe(initialActions.setFalse)
    expect(result.current[1].setState).toBe(initialActions.setState)
    expect(result.current[1].toggle).toBe(initialActions.toggle)
  })

  it('should handle multiple state changes', () => {
    const { result } = renderHook(() => useBoolean())
    act(() => {
      result.current[1].setFalse()
      result.current[1].toggle()
      result.current[1].setTrue()
      result.current[1].setState(false)
    })
    expect(result.current[0]).toBe(false)
  })
})
