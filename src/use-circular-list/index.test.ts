import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useCircularList } from './index'

describe('useCircularList', () => {
  it('should return the initial value', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))
    expect(result.current[0]).toBe('a')
  })

  it('should cycle to the next value', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))
    act(() => {
      result.current[1].next()
    })
    expect(result.current[0]).toBe('b')
  })

  it('should cycle to the previous value', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))
    act(() => {
      result.current[1].prev()
    })
    expect(result.current[0]).toBe('c')
  })

  it('should cycle to the value at the specified index', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))
    act(() => {
      result.current[1].go(2)
    })
    expect(result.current[0]).toBe('c')
  })

  it('should return the current index', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))
    expect(result.current[2]).toBe(0)
  })

  it('should return the fallback index when value is not found', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() =>
      useCircularList(list, {
        initialValue: 'not exist',
        fallbackIndex: 1,
      }),
    )
    expect(result.current[2]).toBe(1)
  })
})
