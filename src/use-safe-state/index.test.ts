import { renderHook, act } from '@/test'
import { useSafeState } from './index'
import { describe, expect, test } from 'vitest'

describe('useSafeState', () => {
  test('should initialize state with the provided initial value', () => {
    const initialValue = 0
    const { result } = renderHook(() => useSafeState(initialValue))

    expect(result.current[0]).toBe(initialValue)
  })

  test('should update state when setState is called', () => {
    const { result } = renderHook(() => useSafeState(0))
    act(() => result.current[1](1))
    expect(result.current[0]).toBe(1)
  })

  test('should not update state when setState is called with the same value', () => {
    const { result } = renderHook(() => useSafeState(0))
    act(() => result.current[1](0))
    expect(result.current[0]).toBe(0)
  })

  test('should update state when setState is called with a different value using deep comparison', () => {
    const { result } = renderHook(() => useSafeState({ count: 0 }, { deep: true }))
    act(() => result.current[1]({ count: 1 }))
    expect(result.current[0]).toEqual({ count: 1 })
  })

  test('should not update state when setState is called with the same value using deep comparison', () => {
    const renderCount = { current: 0 }

    const { result } = renderHook(() => {
      renderCount.current++
      return useSafeState({ count: 0 }, { deep: true })
    })

    const setState = result.current[1]

    act(() => setState({ count: 0 }))
    act(() => setState({ count: 0 }))

    expect(result.current[0]).toEqual({ count: 0 })
    expect(renderCount.current).toEqual(1)

    act(() => setState({ count: 2 }))
    act(() => setState({ count: 2 }))
    act(() => setState({ count: 3 }))
    act(() => setState({ count: 3 }))

    expect(result.current[0]).toEqual({ count: 3 })
    expect(renderCount.current).toEqual(3)

    renderCount.current = 0
  })
})
