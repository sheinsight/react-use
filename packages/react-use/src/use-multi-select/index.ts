import { useMemo } from 'react'
import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { ReactSetState } from '../use-safe-state'

export interface UseMultiSelectReturnsState<T> {
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
}

export interface UseMultiSelectActions<T> {
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
   *
   * @deprecated Use `unselect` instead
   */
  unSelect: (item: T) => void
  /**
   * Unselect all items
   *
   * @deprecated Use `unselectAll` instead
   */
  unSelectAll(): void
  /**
   * Unselect the item
   *
   * @since 1.7.0
   */
  unselect: (item: T) => void
  /**
   * Unselect all items
   *
   * @since 1.7.0
   */
  unselectAll(): void
  /**
   * Toggle the item
   */
  toggle: (item: T) => void
  /**
   * Toggle all items
   */
  toggleAll(): void
}

export type UseMultiSelectReturns<T> = readonly [UseMultiSelectReturnsState<T>, UseMultiSelectActions<T>]

/**
 * A React Hook that manages multi-select state.
 */
export function useMultiSelect<T>(items: T[], defaultSelected: T[] = []): UseMultiSelectReturns<T> {
  const [selected, setSelected] = useSafeState<T[]>(defaultSelected)

  const set = useMemo(() => new Set(selected), [selected])

  const isNoneSelected = useMemo(() => items.every((o) => !set.has(o)), [items, set])
  const isAllSelected = useMemo(() => items.every((o) => set.has(o)) && !isNoneSelected, [items, set, isNoneSelected])

  const latest = useLatest({ set })

  const isPartiallySelected = useCreation(() => {
    return !isNoneSelected && !isAllSelected
  }, [isNoneSelected, isAllSelected])

  const select = useStableFn((item: T) => {
    latest.current.set.add(item)
    setSelected(Array.from(latest.current.set))
  })

  const unselect = useStableFn((item: T) => {
    latest.current.set.delete(item)
    setSelected(Array.from(latest.current.set))
  })

  const selectAll = useStableFn(() => {
    for (const item of items) {
      latest.current.set.add(item)
    }
    setSelected(Array.from(latest.current.set))
  })

  const unselectAll = useStableFn(() => {
    for (const item of items) {
      latest.current.set.delete(item)
    }
    setSelected(Array.from(latest.current.set))
  })

  const toggleAll = useStableFn(() => {
    for (const item of items) {
      isItemSelected(item) ? unselect(item) : select(item)
    }
  })

  const toggle = useStableFn((item: T) => (isItemSelected(item) ? unselect(item) : select(item)))
  const isItemSelected = useStableFn((item: T) => latest.current.set.has(item))

  const state = {
    selected,
    isNoneSelected,
    isAllSelected,
    isPartiallySelected,
  }

  const actions = useCreation(() => ({
    isItemSelected,
    select,
    selectAll,
    setSelected,
    toggle,
    toggleAll,
    unselect,
    unselectAll,
    unSelect: unselect,
    unSelectAll: unselectAll,
  }))

  return [state, actions] as const
}
