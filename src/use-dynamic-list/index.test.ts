import { act, renderHook } from '@/test'
import { describe, expect, test } from 'vitest'
import { useDynamicList } from './index'

describe('useDynamicList', () => {
  test('should merge items at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].merge(1, ['newItem1', 'newItem2'])
    })

    expect(result.current[0]).toEqual(['item1', 'newItem1', 'newItem2', 'item2', 'item3'])
  })

  test('should replace an item at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].replace(1, 'newItem')
    })

    expect(result.current[0]).toEqual(['item1', 'newItem', 'item3'])
  })

  test('should remove an item at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].remove(1)
    })

    expect(result.current[0]).toEqual(['item1', 'item3'])
  })

  test('should get the key of the item at the specified index', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    const key = result.current[1].getKey(1)

    expect(key).toBe(1)
  })

  test('should get the index of the item with the specified key', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    const index = result.current[1].getIndex(1)

    expect(index).toBe(1)
  })

  test('should move an item from the old index to the new index', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].move(0, 2)
    })

    expect(result.current[0]).toEqual(['item2', 'item3', 'item1'])
  })

  test('should push an item to the end of the list', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].push('newItem')
    })

    expect(result.current[0]).toEqual(['item1', 'item2', 'item3', 'newItem'])
  })

  test('should pop an item from the end of the list', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].pop()
    })

    expect(result.current[0]).toEqual(['item1', 'item2'])
  })

  test('should unshift an item to the start of the list', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].unshift('newItem')
    })

    expect(result.current[0]).toEqual(['newItem', 'item1', 'item2', 'item3'])
  })

  test('should shift an item from the start of the list', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].shift()
    })

    expect(result.current[0]).toEqual(['item2', 'item3'])
  })

  test('should sort the list based on the specified result', () => {
    const { result } = renderHook(() => useDynamicList(['item3', 'item1', 'item2']))

    act(() => {
      const [_, actions] = result.current
      actions.setList(actions.sort(['item1', 'item2', 'item3']))
    })

    expect(result.current[0]).toEqual(['item1', 'item2', 'item3'])
  })

  test('should reset the list', () => {
    const { result } = renderHook(() => useDynamicList(['item1', 'item2', 'item3']))

    act(() => {
      result.current[1].reset(['newItem1', 'newItem2'])
    })

    expect(result.current[0]).toEqual(['newItem1', 'newItem2'])
  })
})
