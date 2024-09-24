import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useCircularList } from './index'

describe('useCircularList', () => {
  it('should initialize with the first item in the list', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))

    expect(result.current[0]).toBe('a')
    expect(result.current[2]).toBe(0)
  })

  it('should initialize with the provided initialValue', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list, { initialValue: 'b' }))

    expect(result.current[0]).toBe('b')
    expect(result.current[2]).toBe(1)
  })

  it('should cycle to the next item', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].next()
    })

    expect(result.current[0]).toBe('b')
    expect(result.current[2]).toBe(1)
  })

  it('should cycle to the previous item', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].prev()
    })

    expect(result.current[0]).toBe('c')
    expect(result.current[2]).toBe(2)
  })

  it('should wrap around when reaching the end of the list', async () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      // will be merged into one update, 0 => 1
      result.current[1].next()
      result.current[1].next()
      result.current[1].next()
    })

    expect(result.current[0]).toBe('b')
    expect(result.current[2]).toBe(1)
  })

  it('should wrap around when reaching the beginning of the list', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].prev()
      result.current[1].prev()
      result.current[1].prev()
    })

    expect(result.current[0]).toBe('c')
    expect(result.current[2]).toBe(2)
  })

  it('should go to a specific index', () => {
    const list = ['a', 'b', 'c', 'd', 'e']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].go(3)
    })

    expect(result.current[0]).toBe('d')
    expect(result.current[2]).toBe(3)
  })

  it('should handle negative indices when using go', () => {
    const list = ['a', 'b', 'c', 'd', 'e']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].go(-1)
    })

    expect(result.current[0]).toBe('e')
    expect(result.current[2]).toBe(4)
  })

  it('should handle indices larger than list length when using go', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].go(5)
    })

    expect(result.current[0]).toBe('c')
    expect(result.current[2]).toBe(2)
  })

  it('should use fallbackIndex when initialValue is not in the list', () => {
    const list = ['a', 'b', 'c']
    const { result } = renderHook(() => useCircularList(list, { initialValue: 'd', fallbackIndex: 1 }))

    expect(result.current[0]).toBe('b')
    expect(result.current[2]).toBe(1)
  })

  it('should use custom getIndexOf function', () => {
    const list = [
      { id: 1, value: 'a' },
      { id: 2, value: 'b' },
      { id: 3, value: 'c' },
    ]
    const getIndexOf = (value: { id: number; value: string }, arr: typeof list) =>
      arr.findIndex((item) => item.id === value.id)

    const { result } = renderHook(() =>
      useCircularList(list, {
        initialValue: { id: 2, value: 'b' },
        getIndexOf,
      }),
    )

    expect(result.current[0]).toEqual({ id: 2, value: 'b' })
    expect(result.current[2]).toBe(1)
  })

  it('should update when list changes', () => {
    const { result, rerender } = renderHook(({ list }) => useCircularList(list), {
      initialProps: { list: ['a', 'b', 'c'] },
    })

    expect(result.current[0]).toBe('a')

    rerender({ list: ['x', 'y', 'z'] })

    expect(result.current[0]).toBe('x')
    expect(result.current[2]).toBe(0)
  })

  it('should handle steps larger than 1 for next', () => {
    const list = ['a', 'b', 'c', 'd', 'e']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].next(3)
    })

    expect(result.current[0]).toBe('d')
    expect(result.current[2]).toBe(3)
  })

  it('should handle steps larger than 1 for prev', () => {
    const list = ['a', 'b', 'c', 'd', 'e']
    const { result } = renderHook(() => useCircularList(list))

    act(() => {
      result.current[1].prev(2)
    })

    expect(result.current[0]).toBe('d')
    expect(result.current[2]).toBe(3)
  })

  it('should handle empty list', () => {
    const { result } = renderHook(() => useCircularList([]))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[2]).toBe(0)

    act(() => {
      result.current[1].next()
      result.current[1].prev()
      result.current[1].go(5)
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[2]).toBe(0)
  })
})
