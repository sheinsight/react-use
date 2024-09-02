import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useBoolean } from './index'

describe('useBoolean', () => {
  it('should initialize with the provided initial value', () => {
    const initialValue = false
    const { result } = renderHook(() => useBoolean(initialValue))

    expect(result.current[0]).toBe(initialValue)
  })

  it('should initialize with the default initial value if not provided', () => {
    const { result } = renderHook(() => useBoolean())

    expect(result.current[0]).toBe(true)
  })

  it('should update the boolean state when setTrue is called', () => {
    const { result } = renderHook(() => useBoolean())

    act(() => {
      result.current[1].setTrue()
    })

    expect(result.current[0]).toBe(true)
  })

  it('should update the boolean state when setFalse is called', () => {
    const { result } = renderHook(() => useBoolean())

    act(() => {
      result.current[1].setFalse()
    })

    expect(result.current[0]).toBe(false)
  })

  it('should update the boolean state when setState is called', () => {
    const { result } = renderHook(() => useBoolean())

    act(() => {
      result.current[1].setState(false)
    })

    expect(result.current[0]).toBe(false)
  })

  it('should toggle the boolean state when toggle is called', () => {
    const { result } = renderHook(() => useBoolean())

    act(() => {
      result.current[1].toggle()
    })

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].toggle()
    })

    expect(result.current[0]).toBe(true)
  })
})
