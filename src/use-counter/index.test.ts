import { act, renderHook } from '@/test'
import { describe, expect, test } from 'vitest'
import { useCounter } from './index'

describe('useCounter', () => {
  test('should initialize with default count 0', () => {
    const { result } = renderHook(() => useCounter())
    const [count] = result.current
    expect(count).toBe(0)
  })

  test('should initialize with provided initial count', () => {
    const { result } = renderHook(() => useCounter(10))
    const [count, _, { initialCount }] = result.current
    expect(count).toBe(10)
    expect(initialCount).toBe(10)
  })

  test('should increment count by 1', () => {
    const { result } = renderHook(() => useCounter())
    const [, { inc }] = result.current
    act(() => inc())
    const [count] = result.current
    expect(count).toBe(1)
  })

  test('should increment count by provided delta', () => {
    const { result } = renderHook(() => useCounter())
    const [, { inc }] = result.current
    act(() => inc(5))
    const [count] = result.current
    expect(count).toBe(5)
  })

  test('should decrement count by 1', () => {
    const { result } = renderHook(() => useCounter(10))
    const [, { dec }] = result.current
    act(() => dec())
    const [count] = result.current
    expect(count).toBe(9)
  })

  test('should decrement count by provided delta', () => {
    const { result } = renderHook(() => useCounter(10))
    const [, { dec }] = result.current
    act(() => dec(5))
    const [count] = result.current
    expect(count).toBe(5)
  })

  test('should set count to provided value', () => {
    const { result } = renderHook(() => useCounter())
    const [, { set }] = result.current
    act(() => set(10))
    const [count] = result.current
    expect(count).toBe(10)
  })

  test('should reset count to initial count', () => {
    const { result } = renderHook(() => useCounter(10))
    const [, { reset }] = result.current
    act(() => reset())
    const [count] = result.current
    expect(count).toBe(10)
  })

  test('should reset count to provided value', () => {
    const { result } = renderHook(() => useCounter(10))
    const [, { reset }, { initialCount }] = result.current
    expect(initialCount).toBe(10)
    act(() => reset(5))
    const [count, _, { initialCount: _initialCount }] = result.current
    expect(count).toBe(5)
    expect(_initialCount).toBe(5)
  })

  test('should not increment count beyond max', () => {
    const { result } = renderHook(() => useCounter(10, { max: 10 }))
    const [, { inc }] = result.current
    act(() => inc())
    const [count] = result.current
    expect(count).toBe(10)
  })

  test('should not decrement count beyond min', () => {
    const { result } = renderHook(() => useCounter(10, { min: 10 }))
    const [, { dec }] = result.current
    act(() => dec())
    const [count] = result.current
    expect(count).toBe(10)
  })

  test('should not set count beyond max', () => {
    const { result } = renderHook(() => useCounter(10, { max: 10 }))
    const [, { set }] = result.current
    act(() => set(20))
    const [count] = result.current
    expect(count).toBe(10)
  })

  test('should not set count below min', () => {
    const { result } = renderHook(() => useCounter(10, { min: 10 }))
    const [, { set }] = result.current
    act(() => set(5))
    const [count] = result.current
    expect(count).toBe(10)
  })

  test('should return the whole state', () => {
    const { result } = renderHook(() => useCounter(10, { min: 5, max: 15 }))
    const [, , state] = result.current
    expect(state).toEqual({
      count: 10,
      initialCount: 10,
      min: 5,
      max: 15,
    })
  })

  test('should return the whole state with default values', () => {
    const { result } = renderHook(() => useCounter())
    const [, , state] = result.current
    expect(state).toEqual({
      count: 0,
      initialCount: 0,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY,
    })
  })

  test('should return the whole state with default min', () => {
    const { result } = renderHook(() => useCounter(10, { max: 15 }))
    const [, , state] = result.current
    expect(state).toEqual({
      count: 10,
      initialCount: 10,
      min: Number.NEGATIVE_INFINITY,
      max: 15,
    })
  })
})
