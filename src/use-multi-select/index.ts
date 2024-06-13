import { useMemo } from 'react'
import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { ReactSetState } from '../use-safe-state'

export interface UseMultiSelectReturn<T> {
  /**
   * The selected items
   */
  selected: T[]
  /**
   * Whether none of the items are selected
   */
  isNoneSelected: boolean
  /**
   * Whether all of the items are selected
   */
  isAllSelected: boolean
  /**
   * Whether some of the items are selected
   */
  isPartiallySelected: boolean
  /**
   * Whether the item is selected
   */
  isItemSelected: (item: T) => boolean
  /**
   * Set the selected items
   */
  setSelected: ReactSetState<T[]>
  /**
   * Select the item
   */
  select: (item: T) => void
  /**
   * Select all items
   */
  selectAll(): void
  /**
   * Unselect the item
   */
  unSelect: (item: T) => void
  /**
   * Unselect all items
   */
  unSelectAll(): void
  /**
   * Toggle the item
   */
  toggle: (item: T) => void
  /**
   * Toggle all items
   */
  toggleAll(): void
}

export function useMultiSelect<T>(items: T[], defaultSelected: T[] = []): UseMultiSelectReturn<T> {
  const [selected, setSelected] = useSafeState<T[]>(defaultSelected)
  const selectedSet = useCreation(() => new Set(selected), [selected])
  const latestSet = useLatest(selectedSet)

  const isNoneSelected = useMemo(() => items.every((o) => !selectedSet.has(o)), [items, selectedSet])

  const isAllSelected = useMemo(
    () => items.every((o) => selectedSet.has(o)) && !isNoneSelected,
    [items, selectedSet, isNoneSelected],
  )

  const isPartiallySelected = useMemo(() => {
    return !isNoneSelected && !isAllSelected
  }, [isNoneSelected, isAllSelected])

  const select = useStableFn((item: T) => {
    latestSet.current.add(item)
    setSelected(Array.from(latestSet.current))
  })

  const unSelect = useStableFn((item: T) => {
    latestSet.current.delete(item)
    setSelected(Array.from(latestSet.current))
  })

  const selectAll = useStableFn(() => {
    for (const item of items) {
      latestSet.current.add(item)
    }
    setSelected(Array.from(latestSet.current))
  })

  const unSelectAll = useStableFn(() => {
    for (const item of items) {
      latestSet.current.delete(item)
    }
    setSelected(Array.from(latestSet.current))
  })

  const toggleAll = useStableFn(() => {
    for (const item of items) {
      isItemSelected(item) ? unSelect(item) : select(item)
    }
  })

  const toggle = useStableFn((item: T) => (isItemSelected(item) ? unSelect(item) : select(item)))

  const isItemSelected = useStableFn((item: T) => latestSet.current.has(item))

  return {
    selected,
    isNoneSelected,
    isAllSelected,
    isPartiallySelected,

    isItemSelected,
    setSelected,

    select,
    selectAll,

    unSelect,
    unSelectAll,

    toggle,
    toggleAll,
  }
}
