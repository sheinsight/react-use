import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useCounter } from '../index'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current[0]).toBe(0)
  })

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current[0]).toBe(10)
  })

  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0))
    act(() => {
      result.current[1].inc()
    })
    expect(result.current[0]).toBe(1)
  })

  it('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => {
      result.current[1].dec()
    })
    expect(result.current[0]).toBe(4)
  })

  it('should set counter to specific value', () => {
    const { result } = renderHook(() => useCounter(0))
    act(() => {
      result.current[1].set(100)
    })
    expect(result.current[0]).toBe(100)
  })

  it('should get current counter value', () => {
    const { result } = renderHook(() => useCounter(7))
    expect(result.current[1].get()).toBe(7)
  })

  it('should reset counter to initial value', async () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => {
      result.current[1].inc(10)
      result.current[1].reset()
    })
    expect(result.current[0]).toBe(5)
  })

  it('should reset counter to new value', () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => {
      result.current[1].reset(20)
    })
    expect(result.current[0]).toBe(20)
  })

  it('should respect max value', () => {
    const { result } = renderHook(() => useCounter(0, { max: 10 }))
    act(() => {
      result.current[1].inc(15)
    })
    expect(result.current[0]).toBe(10)
  })

  it('should respect min value', () => {
    const { result } = renderHook(() => useCounter(0, { min: -5 }))
    act(() => {
      result.current[1].dec(10)
    })
    expect(result.current[0]).toBe(-5)
  })

  it('should update max and min values', () => {
    const { result, rerender } = renderHook((props) => useCounter(-20, props), {
      initialProps: { max: 10, min: -10 },
    })

    expect(result.current[0]).toBe(-10)

    act(() => {
      result.current[1].inc(100)
    })

    expect(result.current[0]).toBe(10)

    rerender({ max: -30, min: -100 })

    expect(result.current[0]).toBe(-30)

    act(() => {
      result.current[1].inc(12)
    })

    expect(result.current[0]).toBe(-30)

    act(() => {
      result.current[1].dec(10)
    })

    expect(result.current[0]).toBe(-40)
  })

  it('should handle increment with custom delta', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => {
      result.current[1].inc(5)
    })

    expect(result.current[0]).toBe(5)
  })

  it('should handle decrement with custom delta', () => {
    const { result } = renderHook(() => useCounter(10))
    act(() => {
      result.current[1].dec(3)
    })
    expect(result.current[0]).toBe(7)
  })

  it('should return correct state object', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }))

    expect(result.current[2]).toEqual({
      count: 5,
      initialCount: 5,
      min: 0,
      max: 10,
    })
  })

  it('should update initialCount when prop changes', () => {
    const { result, rerender } = renderHook((props) => useCounter(props), { initialProps: 5 })
    expect(result.current[2].initialCount).toBe(5)

    rerender(10)
    expect(result.current[2].initialCount).toBe(10)
  })

  it('should handle floating point numbers', () => {
    const { result } = renderHook(() => useCounter(0.1))
    act(() => {
      result.current[1].inc(0.2)
    })
    expect(result.current[0]).toBeCloseTo(0.3)
  })

  it('should not exceed Number.MAX_SAFE_INTEGER', () => {
    const { result } = renderHook(() => useCounter(Number.MAX_SAFE_INTEGER))
    act(() => {
      result.current[1].inc()
    })
    expect(result.current[0]).toBe(Number.MAX_SAFE_INTEGER)
  })

  it('should not go below Number.MIN_SAFE_INTEGER', () => {
    const { result } = renderHook(() => useCounter(Number.MIN_SAFE_INTEGER))
    act(() => {
      result.current[1].dec()
    })
    expect(result.current[0]).toBe(Number.MIN_SAFE_INTEGER)
  })
})
