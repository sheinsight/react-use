import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useGetterRef } from './index'

describe('useGetterRef', () => {
  it('should return a mutable ref object and a getter function', () => {
    const { result } = renderHook(() => useGetterRef(0))
    const [ref, getter] = result.current

    expect(ref).toBeDefined()
    expect(ref.current).toBe(0)
    expect(getter).toBeDefined()
    expect(getter()).toBe(0)
  })

  it('should update the ref value when the getter is called', () => {
    const { result } = renderHook(() => useGetterRef(0))
    const [ref, getter] = result.current

    act(() => {
      ref.current = 10
    })

    expect(getter()).toBe(10)
  })

  it('should return the latest ref value even after multiple updates', () => {
    const { result } = renderHook(() => useGetterRef(0))
    const [ref, getter] = result.current

    act(() => {
      ref.current = 5
    })

    expect(getter()).toBe(5)

    act(() => {
      ref.current = 10
    })

    expect(getter()).toBe(10)
  })
})
