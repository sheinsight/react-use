import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStableFn } from './index'

describe('useStableFn', () => {
  let mockFn: Mock

  beforeEach(() => {
    mockFn = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return the same function reference on re-renders', () => {
    const { result, rerender } = renderHook(() => useStableFn(mockFn))

    const stableFn = result.current
    rerender()
    expect(result.current).toBe(stableFn)
  })

  it('should call the provided function with correct arguments', () => {
    const { result } = renderHook(() => useStableFn(mockFn))

    act(() => {
      result.current.call(null, 'arg1', 'arg2')
    })

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should maintain the latest function reference', () => {
    const { result, rerender } = renderHook(({ fn }) => useStableFn(fn), {
      initialProps: { fn: mockFn },
    })

    act(() => {
      result.current.call(null)
    })
    expect(mockFn).toHaveBeenCalled()

    const newMockFn = vi.fn()
    rerender({ fn: newMockFn })

    act(() => {
      result.current.call(null)
    })
    expect(newMockFn).toHaveBeenCalled()
    expect(mockFn).toHaveBeenCalledTimes(1) // Ensure old fn is not called again
  })

  it('should work with different contexts', () => {
    const context = { value: 'contextValue' }
    const { result } = renderHook(() =>
      useStableFn(function (this: any) {
        return this.value
      }),
    )

    expect(result.current.call(context)).toBe('contextValue')
  })
})
