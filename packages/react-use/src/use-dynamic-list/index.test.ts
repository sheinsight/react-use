import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { useDynamicList } from './index'

describe('useDynamicList', () => {
  let initialList: number[]

  beforeEach(() => {
    initialList = [1, 2, 3]
  })

  it('should initialize with the provided list', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    expect(result.current[0]).toEqual(initialList)
  })

  it('should insert an item at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].insert(1, 4)
    })
    expect(result.current[0]).toEqual([1, 4, 2, 3])
  })

  it('should merge items at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].merge(1, [4, 5])
    })
    expect(result.current[0]).toEqual([1, 4, 5, 2, 3])
  })

  it('should replace an item at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].replace(1, 4)
    })
    expect(result.current[0]).toEqual([1, 4, 3])
  })

  it('should remove an item at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].remove(1)
    })
    expect(result.current[0]).toEqual([1, 3])
  })

  it('should get the key of the item at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    expect(result.current[1].getKey(1)).toBe(1)
  })

  it('should move an item from the old index to the new index', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].move(0, 2)
    })
    expect(result.current[0]).toEqual([2, 3, 1])
  })

  it('should push an item to the end of the list', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].push(4)
    })
    expect(result.current[0]).toEqual([1, 2, 3, 4])
  })

  it('should pop an item from the end of the list', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].pop()
    })
    expect(result.current[0]).toEqual([1, 2])
  })

  it('should unshift an item to the start of the list', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].unshift(0)
    })
    expect(result.current[0]).toEqual([0, 1, 2, 3])
  })

  it('should shift an item from the start of the list', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].shift()
    })
    expect(result.current[0]).toEqual([2, 3])
  })

  it('should sort the list', () => {
    const { result } = renderHook(() => useDynamicList([2, 1, 5, 3, 7, 6, 4, 9]))
    act(() => {
      result.current[1].sort()
    })
    expect(result.current[0]).toEqual([1, 2, 3, 4, 5, 6, 7, 9])
  })

  it('should sort the list with compare', () => {
    const { result } = renderHook(() => useDynamicList([2, 1, 5, 8, 3, 7, 6, 4, 9]))
    act(() => {
      result.current[1].sort((a, b) => b - a)
    })
    expect(result.current[0]).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])
  })

  it('should reset the list', () => {
    const { result } = renderHook(() => useDynamicList(initialList))
    act(() => {
      result.current[1].reset([4, 5, 6])
    })
    expect(result.current[0]).toEqual([4, 5, 6])
  })
})
