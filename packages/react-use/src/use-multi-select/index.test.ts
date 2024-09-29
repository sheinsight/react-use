import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMultiSelect } from './index'

describe('useMultiSelect', () => {
  let items: string[]
  let defaultSelected: string[]

  beforeEach(() => {
    items = ['item1', 'item2', 'item3']
    defaultSelected = []
  })

  it('should initialize with default selected items', () => {
    const { result } = renderHook(() => useMultiSelect(items, defaultSelected))
    expect(result.current[0].selected).toEqual(defaultSelected)
    expect(result.current[0].isNoneSelected).toBe(true)
    expect(result.current[0].isAllSelected).toBe(false)
    expect(result.current[0].isPartiallySelected).toBe(false)
  })

  it('should select an item', () => {
    const { result } = renderHook(() => useMultiSelect(items, defaultSelected))
    act(() => {
      result.current[1].select('item1')
      result.current[1].select('item2')
    })
    expect(result.current[0].selected).toEqual(['item1', 'item2'])
    expect(result.current[0].isNoneSelected).toBe(false)
    expect(result.current[0].isAllSelected).toBe(false)
    expect(result.current[0].isPartiallySelected).toBe(true)
  })

  it('should unselect an item', () => {
    const { result } = renderHook(() => useMultiSelect(items, ['item1']))
    act(() => {
      result.current[1].unselect('item1')
    })
    expect(result.current[0].selected).toEqual([])
    expect(result.current[0].isNoneSelected).toBe(true)
  })

  it('should select all items', () => {
    const { result } = renderHook(() => useMultiSelect(items, defaultSelected))
    act(() => {
      result.current[1].selectAll()
    })
    expect(result.current[0].selected).toEqual(items)
    expect(result.current[0].isAllSelected).toBe(true)
  })

  it('should unselect all items', () => {
    const { result } = renderHook(() => useMultiSelect(items, items))
    act(() => {
      result.current[1].unselectAll()
    })
    expect(result.current[0].selected).toEqual([])
    expect(result.current[0].isNoneSelected).toBe(true)
  })

  it('should toggle an item', () => {
    const { result } = renderHook(() => useMultiSelect(items, defaultSelected))
    act(() => {
      result.current[1].toggle('item1')
    })
    expect(result.current[0].selected).toEqual(['item1'])
    act(() => {
      result.current[1].toggle('item1')
    })
    expect(result.current[0].selected).toEqual([])
  })

  it('should toggle all items', () => {
    const { result } = renderHook(() => useMultiSelect(items, defaultSelected))
    act(() => {
      result.current[1].toggleAll()
    })
    expect(result.current[0].selected).toEqual(items)
    act(() => {
      result.current[1].toggleAll()
    })
    expect(result.current[0].selected).toEqual([])
  })

  it('should handle multiple operations', () => {
    const { result } = renderHook(() => useMultiSelect(items, defaultSelected))
    act(() => {
      result.current[1].select('item1')
      result.current[1].select('item2')
    })
    expect(result.current[0].selected).toEqual(['item1', 'item2'])
    act(() => {
      result.current[1].unselect('item1')
      result.current[1].select('item3')
    })
    expect(result.current[0].selected).toEqual(['item2', 'item3'])
    act(() => {
      result.current[1].select('item1')
      result.current[1].select('item2')
      result.current[1].select('item3')
    })
    expect(result.current[0].selected).toEqual(['item2', 'item3', 'item1'])
    act(() => {
      result.current[1].unselectAll()
    })
    expect(result.current[0].selected).toEqual([])
  })
})
