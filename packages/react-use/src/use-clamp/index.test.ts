import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useClamp } from '../index'

describe('useClamp', () => {
  it('should initialize with the correct value', () => {
    const { result } = renderHook(() => useClamp(5, 0, 10))
    expect(result.current[0]).toBe(5)
  })

  it('should clamp the initial value to the minimum', () => {
    const { result } = renderHook(() => useClamp(-5, 0, 10))
    expect(result.current[0]).toBe(0)
  })

  it('should clamp the initial value to the maximum', () => {
    const { result } = renderHook(() => useClamp(15, 0, 10))
    expect(result.current[0]).toBe(10)
  })

  it('should update the value within bounds', () => {
    const { result } = renderHook(() => useClamp(5, 0, 10))
    act(() => {
      result.current[1].set(7)
    })
    expect(result.current[0]).toBe(7)
  })

  it('should clamp the value to the minimum when setting', () => {
    const { result } = renderHook(() => useClamp(5, 0, 10))
    act(() => {
      result.current[1].set(-3)
    })
    expect(result.current[0]).toBe(0)
  })

  it('should clamp the value to the maximum when setting', () => {
    const { result } = renderHook(() => useClamp(5, 0, 10))
    act(() => {
      result.current[1].set(12)
    })
    expect(result.current[0]).toBe(10)
  })

  it('should increment the value', () => {
    const { result } = renderHook(() => useClamp(5, 0, 10))
    act(() => {
      result.current[1].inc()
    })
    expect(result.current[0]).toBe(6)
  })

  it('should not increment beyond the maximum', () => {
    const { result } = renderHook(() => useClamp(10, 0, 10))
    act(() => {
      result.current[1].inc()
    })
    expect(result.current[0]).toBe(10)
  })

  it('should decrement the value', () => {
    const { result } = renderHook(() => useClamp(5, 0, 10))
    act(() => {
      result.current[1].dec()
    })
    expect(result.current[0]).toBe(4)
  })

  it('should not decrement below the minimum', () => {
    const { result } = renderHook(() => useClamp(0, 0, 10))
    act(() => {
      result.current[1].dec()
    })
    expect(result.current[0]).toBe(0)
  })

  it('should handle dynamic input changes', () => {
    const { result, rerender } = renderHook(({ input }) => useClamp(input, 0, 10), { initialProps: { input: 5 } })
    expect(result.current[0]).toBe(5)

    rerender({ input: 8 })
    expect(result.current[0]).toBe(8)

    rerender({ input: 12 })
    expect(result.current[0]).toBe(10)

    rerender({ input: -2 })
    expect(result.current[0]).toBe(0)
  })

  it('should handle dynamic min changes', () => {
    const { result, rerender } = renderHook(({ min }) => useClamp(5, min, 10), { initialProps: { min: 0 } })
    expect(result.current[0]).toBe(5)

    rerender({ min: 3 })
    expect(result.current[0]).toBe(5)

    rerender({ min: 7 })
    expect(result.current[0]).toBe(7)
  })

  it('should handle dynamic max changes', () => {
    const { result, rerender } = renderHook(({ max }) => useClamp(5, 0, max), { initialProps: { max: 10 } })
    expect(result.current[0]).toBe(5)

    rerender({ max: 8 })
    expect(result.current[0]).toBe(5)

    rerender({ max: 3 })
    expect(result.current[0]).toBe(3)
  })

  it('should work with function inputs', () => {
    const getInput = vi.fn(() => 5)
    const getMin = vi.fn(() => 0)
    const getMax = vi.fn(() => 10)

    const { result } = renderHook(() => useClamp(getInput, getMin, getMax))
    expect(result.current[0]).toBe(5)
    expect(getInput).toHaveBeenCalled()
    expect(getMin).toHaveBeenCalled()
    expect(getMax).toHaveBeenCalled()
  })
})
